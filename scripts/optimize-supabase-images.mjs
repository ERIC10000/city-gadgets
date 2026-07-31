/**
 * Converts every product/video image already sitting in Supabase Storage to
 * WebP, re-uploads it alongside the original, and repoints the database rows
 * at the new file.
 *
 * Why this exists: next.config.ts sets `unoptimized: true` (Vercel's image
 * optimizer is metered on Hobby and starts returning 402s), so nothing is
 * transcoded at request time. Shrinking the stored originals is the only
 * lever left.
 *
 * SAFETY
 *  - Originals are never deleted. Rollback = restore the old URLs.
 *  - Runs read-only unless you pass --write.
 *  - Skips anything already .webp, and anything WebP wouldn't shrink.
 *
 * USAGE
 *   node scripts/optimize-supabase-images.mjs            # dry run, prints a report
 *   node scripts/optimize-supabase-images.mjs --write    # actually upload + update
 *
 * REQUIRES  (in .env.local, or exported in the shell)
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   <- service role, NOT the anon key: it needs
 *                                  storage write + table update permissions.
 *
 * DEPENDENCIES
 *   npm i -D sharp @supabase/supabase-js dotenv
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const WRITE = process.argv.includes("--write");
const BUCKET = "product-images";
const QUALITY = 82;
const MAX_WIDTH = 1600;

// --- env -------------------------------------------------------------------

function loadEnvLocal() {
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local — rely on the ambient environment */
  }
}

loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Add them to .env.local (service-role key, not anon) and re-run.",
  );
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

// --- helpers ---------------------------------------------------------------

const publicPrefix = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;

/** Storage path for a public URL, or null if the URL is hosted elsewhere. */
function storagePath(url) {
  if (typeof url !== "string" || !url.startsWith(publicPrefix)) return null;
  return decodeURIComponent(url.slice(publicPrefix.length).split("?")[0]);
}

function publicUrl(path) {
  return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

// --- main ------------------------------------------------------------------

async function main() {
  console.log(WRITE ? "MODE: write\n" : "MODE: dry run (pass --write to apply)\n");

  const { data: rows, error } = await db.from("product_images").select("id, url");
  if (error) throw error;

  const targets = rows
    .map((r) => ({ ...r, path: storagePath(r.url) }))
    .filter((r) => r.path && !r.path.toLowerCase().endsWith(".webp"));

  console.log(`${rows.length} image rows, ${targets.length} convertible.\n`);

  let before = 0;
  let after = 0;
  let converted = 0;
  let skipped = 0;

  for (const row of targets) {
    const { data: blob, error: dlErr } = await db.storage.from(BUCKET).download(row.path);
    if (dlErr) {
      console.warn(`  ! download failed: ${row.path} — ${dlErr.message}`);
      skipped++;
      continue;
    }

    const input = Buffer.from(await blob.arrayBuffer());
    const output = await sharp(input)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();

    // Not worth a second stored object if WebP isn't actually smaller.
    if (output.length >= input.length) {
      console.log(`  = ${row.path}: WebP not smaller, skipped`);
      skipped++;
      continue;
    }

    const newPath = row.path.replace(/\.[^./]+$/, "") + ".webp";
    before += input.length;
    after += output.length;
    converted++;

    console.log(
      `  ${WRITE ? "→" : "·"} ${row.path}: ${kb(input.length)} → ${kb(output.length)} ` +
        `(-${Math.round(100 - (output.length / input.length) * 100)}%)`,
    );

    if (!WRITE) continue;

    const { error: upErr } = await db.storage
      .from(BUCKET)
      .upload(newPath, output, { contentType: "image/webp", upsert: true });
    if (upErr) {
      console.warn(`  ! upload failed: ${newPath} — ${upErr.message}`);
      continue;
    }

    const { error: updErr } = await db
      .from("product_images")
      .update({ url: publicUrl(newPath) })
      .eq("id", row.id);
    if (updErr) console.warn(`  ! row update failed: ${row.id} — ${updErr.message}`);
  }

  console.log(
    `\n${converted} converted, ${skipped} skipped.\n` +
      `Total ${kb(before)} → ${kb(after)}` +
      (before ? ` (-${Math.round(100 - (after / before) * 100)}%)` : ""),
  );
  if (!WRITE && converted) console.log("\nDry run — nothing was changed. Re-run with --write to apply.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
