/**
 * Re-encodes referenced Supabase Storage JPEGs as WebP without deleting the
 * originals. Database URLs switch only after every replacement is uploaded and
 * verified. A manifest supports resume and transactional rollback.
 *
 * Commands:
 *   npm run images:webp                         # read-only full dry run
 *   npm run images:webp -- --write              # upload and switch DB refs
 *   npm run images:webp -- --resume <manifest>  # continue an interrupted run
 *   npm run images:webp -- --rollback <manifest> # restore original DB refs
 */

import { createHash, randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import pg from "pg";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_DIR = join(ROOT, ".image-migrations");
const SCHEMA_VERSION = 1;
const DEFAULT_BUCKET = "media";
const DEFAULT_QUALITY = 82;
const DEFAULT_MAX_DIMENSION = 1600;
const DEFAULT_CONCURRENCY = 4;
const MAX_SOURCE_BYTES = 32 * 1024 * 1024;
const MAX_INPUT_PIXELS = 100_000_000;

const REFERENCE_FIELDS = [
  { table: "product_images", column: "url" },
  { table: "product_videos", column: "thumbnail_url" },
  { table: "categories", column: "hero_image" },
  { table: "profiles", column: "avatar_url" },
];

dotenv.config({ path: join(ROOT, ".env.local"), quiet: true });

function usage() {
  console.log(`Supabase WebP migration

Usage:
  node scripts/optimize-supabase-images.mjs [--dry-run]
  node scripts/optimize-supabase-images.mjs --write
  node scripts/optimize-supabase-images.mjs --resume <manifest.json>
  node scripts/optimize-supabase-images.mjs --rollback <manifest.json>

Options:
  --bucket <name>          Storage bucket (default: media)
  --quality <20-100>       WebP quality (default: 82)
  --max-dimension <px>     Longest output edge (default: 1600)
  --concurrency <1-8>      Parallel conversions (default: 4)
  --help                   Show this message

Dry runs require DB_URL and NEXT_PUBLIC_SUPABASE_URL. Write/resume require
Node.js 22+ and SUPABASE_SERVICE_ROLE_KEY. Originals are never deleted.`);
}

function valueAfter(argv, index, name) {
  const inline = argv[index].split("=", 2)[1];
  if (inline) return { value: inline, consumed: 0 };
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value.`);
  return { value, consumed: 1 };
}

function parseArgs(argv) {
  const options = {
    mode: "dry-run",
    manifestPath: null,
    bucket: DEFAULT_BUCKET,
    quality: DEFAULT_QUALITY,
    maxDimension: DEFAULT_MAX_DIMENSION,
    concurrency: DEFAULT_CONCURRENCY,
    help: false,
  };
  let selectedMode = false;

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }
    if (arg === "--dry-run" || arg === "--write") {
      if (selectedMode) throw new Error("Choose only one migration mode.");
      options.mode = arg.slice(2);
      selectedMode = true;
      continue;
    }
    if (arg === "--resume" || arg.startsWith("--resume=")) {
      if (selectedMode) throw new Error("Choose only one migration mode.");
      const next = valueAfter(argv, index, "--resume");
      options.mode = "resume";
      options.manifestPath = resolve(ROOT, next.value);
      selectedMode = true;
      index += next.consumed;
      continue;
    }
    if (arg === "--rollback" || arg.startsWith("--rollback=")) {
      if (selectedMode) throw new Error("Choose only one migration mode.");
      const next = valueAfter(argv, index, "--rollback");
      options.mode = "rollback";
      options.manifestPath = resolve(ROOT, next.value);
      selectedMode = true;
      index += next.consumed;
      continue;
    }

    const numericOptions = {
      "--quality": "quality",
      "--max-dimension": "maxDimension",
      "--concurrency": "concurrency",
    };
    const numericName = Object.keys(numericOptions).find((name) => arg === name || arg.startsWith(`${name}=`));
    if (numericName) {
      const next = valueAfter(argv, index, numericName);
      options[numericOptions[numericName]] = Number(next.value);
      index += next.consumed;
      continue;
    }
    if (arg === "--bucket" || arg.startsWith("--bucket=")) {
      const next = valueAfter(argv, index, "--bucket");
      options.bucket = next.value;
      index += next.consumed;
      continue;
    }
    throw new Error(`Unknown option: ${arg}`);
  }

  if (!Number.isInteger(options.quality) || options.quality < 20 || options.quality > 100) {
    throw new Error("--quality must be an integer from 20 to 100.");
  }
  if (!Number.isInteger(options.maxDimension) || options.maxDimension < 1 || options.maxDimension > 2500) {
    throw new Error("--max-dimension must be an integer from 1 to 2500.");
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 8) {
    throw new Error("--concurrency must be an integer from 1 to 8.");
  }
  return options;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function formatBytes(value) {
  if (!value) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${(value / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function publicObjectUrl(projectUrl, bucket, path) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${projectUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}`;
}

function parseStorageUrl(rawUrl, projectUrl, expectedBucket) {
  try {
    const url = new URL(rawUrl);
    if (url.origin !== new URL(projectUrl).origin) return null;
    const prefixes = ["/storage/v1/object/public/", "/storage/v1/render/image/public/"];
    const prefix = prefixes.find((candidate) => url.pathname.startsWith(candidate));
    if (!prefix) return null;
    const remainder = url.pathname.slice(prefix.length);
    const slash = remainder.indexOf("/");
    if (slash < 1) return null;
    const bucket = decodeURIComponent(remainder.slice(0, slash));
    if (bucket !== expectedBucket) return null;
    return { bucket, path: decodeURIComponent(remainder.slice(slash + 1)) };
  } catch {
    return null;
  }
}

function destinationPath(sourcePath, outputHash) {
  const slash = sourcePath.lastIndexOf("/");
  const directory = slash >= 0 ? sourcePath.slice(0, slash + 1) : "";
  const filename = slash >= 0 ? sourcePath.slice(slash + 1) : sourcePath;
  const stem = filename.replace(/\.[^.]+$/, "") || "image";
  return `${directory}${stem}.${outputHash.slice(0, 12)}.webp`;
}

function summaryFor(manifest) {
  const counts = {};
  let sourceBytes = 0;
  let outputBytes = 0;
  for (const asset of manifest.assets) {
    counts[asset.state] = (counts[asset.state] ?? 0) + 1;
    if (["planned", "uploaded", "reused"].includes(asset.state)) {
      sourceBytes += asset.source?.bytes ?? 0;
      outputBytes += asset.destination?.bytes ?? 0;
    }
  }
  return {
    refs: manifest.refs.length,
    assets: manifest.assets.length,
    counts,
    externalRefs: manifest.refs.filter((ref) => ref.state === "external").length,
    sourceBytes,
    outputBytes,
    savingsPercent: sourceBytes ? Math.round(100 - (outputBytes / sourceBytes) * 100) : 0,
  };
}

function saveManifest(path, manifest) {
  manifest.updatedAt = new Date().toISOString();
  manifest.summary = summaryFor(manifest);
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(manifest, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
    flush: true,
  });
  renameSync(temporary, path);
}

function assertManifest(condition, message) {
  if (!condition) throw new Error(`Invalid migration manifest: ${message}`);
}

function validateStoragePath(path, label) {
  assertManifest(typeof path === "string" && path.length > 0 && path.length <= 1024, `${label} is invalid.`);
  assertManifest(!/[\u0000-\u001f\u007f]/.test(path), `${label} contains control characters.`);
  assertManifest(!path.startsWith("/"), `${label} must be relative to its bucket.`);
  assertManifest(!path.split("/").some((part) => !part || part === "." || part === ".."), `${label} contains an unsafe segment.`);
}

function validateManifest(manifest, projectUrl) {
  const manifestStates = ["planned", "uploading", "uploaded", "committed", "failed", "interrupted", "rolled-back"];
  const assetStates = ["pending", "planned", "uploaded", "reused", "already-webp", "unsupported", "failed"];
  const refStates = ["pending", "external", "already-webp", "unsupported", "ready", "committed", "rolled-back"];
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const hash = /^[0-9a-f]{64}$/;

  assertManifest(manifest && typeof manifest === "object", "root value must be an object.");
  assertManifest(manifest.schemaVersion === SCHEMA_VERSION, "unsupported schema version.");
  assertManifest(manifest.projectOrigin === new URL(projectUrl).origin, "project does not match this environment.");
  assertManifest(typeof manifest.runId === "string" && uuid.test(manifest.runId), "runId is invalid.");
  assertManifest(typeof manifest.bucket === "string" && /^[a-z0-9_-]+$/i.test(manifest.bucket), "bucket is invalid.");
  assertManifest(manifestStates.includes(manifest.state), "state is invalid.");
  assertManifest(Array.isArray(manifest.assets) && Array.isArray(manifest.refs), "reference arrays are missing.");
  assertManifest(Number.isInteger(manifest.config?.quality) && manifest.config.quality >= 20 && manifest.config.quality <= 100, "quality is invalid.");
  assertManifest(Number.isInteger(manifest.config?.maxDimension) && manifest.config.maxDimension >= 1 && manifest.config.maxDimension <= 2500, "maxDimension is invalid.");
  assertManifest(Number.isInteger(manifest.config?.concurrency) && manifest.config.concurrency >= 1 && manifest.config.concurrency <= 8, "concurrency is invalid.");
  assertManifest(typeof manifest.config?.sharpVersion === "string" && manifest.config.sharpVersion.length > 0, "Sharp version is missing.");
  assertManifest(typeof manifest.config?.webpVersion === "string" && manifest.config.webpVersion.length > 0, "WebP version is missing.");

  const seenRefs = new Set();
  for (const ref of manifest.refs) {
    assertManifest(REFERENCE_FIELDS.some((field) => field.table === ref.table && field.column === ref.column), `unsupported field ${ref.table}.${ref.column}.`);
    assertManifest(typeof ref.id === "string" && uuid.test(ref.id), `invalid row id for ${ref.table}.`);
    assertManifest(typeof ref.oldUrl === "string" && ref.oldUrl.length <= 4096, `invalid original URL for ${ref.table}.${ref.id}.`);
    try {
      new URL(ref.oldUrl);
    } catch {
      throw new Error(`Invalid migration manifest: malformed original URL for ${ref.table}.${ref.id}.`);
    }
    assertManifest(ref.newUrl === null || (typeof ref.newUrl === "string" && ref.newUrl.length <= 4096), `invalid replacement URL for ${ref.table}.${ref.id}.`);
    if (ref.newUrl) {
      try {
        assertManifest(new URL(ref.newUrl).origin === manifest.projectOrigin, `replacement URL uses another project for ${ref.table}.${ref.id}.`);
      } catch {
        throw new Error(`Invalid migration manifest: malformed replacement URL for ${ref.table}.${ref.id}.`);
      }
    }
    assertManifest(refStates.includes(ref.state), `invalid reference state for ${ref.table}.${ref.id}.`);
    const refKey = `${ref.table}:${ref.column}:${ref.id}`;
    assertManifest(!seenRefs.has(refKey), `duplicate reference ${refKey}.`);
    seenRefs.add(refKey);
  }

  const mappedRefs = new Map();
  const seenAssets = new Set();
  for (const asset of manifest.assets) {
    validateStoragePath(asset.sourcePath, "sourcePath");
    assertManifest(asset.bucket === manifest.bucket, `asset bucket mismatch for ${asset.sourcePath}.`);
    assertManifest(asset.key === `${asset.bucket}:${asset.sourcePath}`, `asset key mismatch for ${asset.sourcePath}.`);
    assertManifest(!seenAssets.has(asset.key), `duplicate asset ${asset.key}.`);
    seenAssets.add(asset.key);
    assertManifest(asset.sourceUrl === publicObjectUrl(manifest.projectOrigin, asset.bucket, asset.sourcePath), `source URL mismatch for ${asset.sourcePath}.`);
    assertManifest(assetStates.includes(asset.state), `invalid asset state for ${asset.sourcePath}.`);
    assertManifest(Array.isArray(asset.refIndexes) && asset.refIndexes.length > 0, `missing reference indexes for ${asset.sourcePath}.`);

    if (asset.source) {
      assertManifest(Number.isInteger(asset.source.bytes) && asset.source.bytes > 0, `invalid source size for ${asset.sourcePath}.`);
      assertManifest(typeof asset.source.sha256 === "string" && hash.test(asset.source.sha256), `invalid source hash for ${asset.sourcePath}.`);
    }
    if (asset.destination) {
      validateStoragePath(asset.destination.path, "destination.path");
      assertManifest(Number.isInteger(asset.destination.bytes) && asset.destination.bytes > 0, `invalid destination size for ${asset.sourcePath}.`);
      assertManifest(typeof asset.destination.sha256 === "string" && hash.test(asset.destination.sha256), `invalid destination hash for ${asset.sourcePath}.`);
      assertManifest(asset.destination.path === destinationPath(asset.sourcePath, asset.destination.sha256), `destination path mismatch for ${asset.sourcePath}.`);
      assertManifest(asset.destination.url === publicObjectUrl(manifest.projectOrigin, asset.bucket, asset.destination.path), `destination URL mismatch for ${asset.sourcePath}.`);
    }
    if (["planned", "uploaded", "reused"].includes(asset.state)) {
      assertManifest(asset.source && asset.destination, `incomplete prepared asset ${asset.sourcePath}.`);
    }

    for (const index of asset.refIndexes) {
      assertManifest(Number.isInteger(index) && index >= 0 && index < manifest.refs.length, `invalid reference index for ${asset.sourcePath}.`);
      assertManifest(!mappedRefs.has(index), `reference ${index} is mapped more than once.`);
      const ref = manifest.refs[index];
      const parsed = parseStorageUrl(ref.oldUrl, manifest.projectOrigin, manifest.bucket);
      assertManifest(parsed?.path === asset.sourcePath, `reference ${index} does not map to ${asset.sourcePath}.`);
      if (ref.newUrl) assertManifest(ref.newUrl === asset.destination?.url, `replacement URL mismatch for reference ${index}.`);
      mappedRefs.set(index, asset);
    }
  }

  for (let index = 0; index < manifest.refs.length; index++) {
    const ref = manifest.refs[index];
    const parsed = parseStorageUrl(ref.oldUrl, manifest.projectOrigin, manifest.bucket);
    if (parsed) assertManifest(mappedRefs.has(index), `Storage reference ${index} has no asset.`);
    else assertManifest(!mappedRefs.has(index) && ref.state === "external", `external reference ${index} is inconsistent.`);
    if (ref.newUrl || ["ready", "committed", "rolled-back"].includes(ref.state)) {
      const asset = mappedRefs.get(index);
      assertManifest(ref.newUrl && asset?.source && asset?.destination, `prepared reference ${index} is incomplete.`);
    }
  }
}

function loadManifest(path, projectUrl) {
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  validateManifest(manifest, projectUrl);
  return manifest;
}

async function connectDatabase(connectionString) {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 40000,
    query_timeout: 120000,
  });
  await client.connect();
  return client;
}

async function discoverReferences(db) {
  const result = await db.query(`
    select 'product_images' as table_name, 'url' as column_name, id::text, url as value
      from public.product_images where url is not null and btrim(url) <> ''
    union all
    select 'product_videos', 'thumbnail_url', id::text, thumbnail_url
      from public.product_videos where thumbnail_url is not null and btrim(thumbnail_url) <> ''
    union all
    select 'categories', 'hero_image', id::text, hero_image
      from public.categories where hero_image is not null and btrim(hero_image) <> ''
    union all
    select 'profiles', 'avatar_url', id::text, avatar_url
      from public.profiles where avatar_url is not null and btrim(avatar_url) <> ''
    order by table_name, id
  `);
  return result.rows.map((row) => ({
    table: row.table_name,
    column: row.column_name,
    id: row.id,
    oldUrl: row.value,
    newUrl: null,
    state: "pending",
  }));
}

function createManifest(refs, projectUrl, options) {
  const assetsByPath = new Map();
  for (let index = 0; index < refs.length; index++) {
    const ref = refs[index];
    const parsed = parseStorageUrl(ref.oldUrl, projectUrl, options.bucket);
    if (!parsed) {
      ref.state = "external";
      continue;
    }
    const key = `${parsed.bucket}:${parsed.path}`;
    let asset = assetsByPath.get(key);
    if (!asset) {
      asset = {
        key,
        bucket: parsed.bucket,
        sourcePath: parsed.path,
        sourceUrl: publicObjectUrl(projectUrl, parsed.bucket, parsed.path),
        refIndexes: [],
        state: "pending",
        source: null,
        destination: null,
        uploadCreated: false,
        error: null,
      };
      assetsByPath.set(key, asset);
    }
    asset.refIndexes.push(index);
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    runId: randomUUID(),
    projectOrigin: new URL(projectUrl).origin,
    bucket: options.bucket,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: options.mode === "dry-run" ? "dry-run" : "planned",
    config: {
      quality: options.quality,
      maxDimension: options.maxDimension,
      concurrency: options.concurrency,
      sharpVersion: sharp.versions.sharp,
      webpVersion: sharp.versions.webp,
    },
    refs,
    assets: [...assetsByPath.values()],
    summary: null,
  };
}

async function fetchBuffer(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`GET ${response.status} for ${url}`);
  const declaredSize = Number(response.headers.get("content-length") ?? 0);
  if (declaredSize > MAX_SOURCE_BYTES) {
    throw new Error(`Source exceeds the ${formatBytes(MAX_SOURCE_BYTES)} safety limit: ${url}`);
  }
  if (!response.body) throw new Error(`GET returned no body for ${url}`);

  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_SOURCE_BYTES) {
      await reader.cancel();
      throw new Error(`Source exceeds the ${formatBytes(MAX_SOURCE_BYTES)} safety limit: ${url}`);
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks, total);
}

async function prepareAsset(asset, manifest, options) {
  asset.error = null;
  const input = await fetchBuffer(asset.sourceUrl);
  const sourceHash = sha256(input);
  if (asset.source?.sha256 && asset.source.sha256 !== sourceHash) {
    throw new Error(`Original changed since the manifest was created: ${asset.sourcePath}`);
  }
  const sourceMetadata = await sharp(input, { failOn: "error", limitInputPixels: MAX_INPUT_PIXELS }).metadata();
  asset.source = {
    bytes: input.length,
    sha256: sourceHash,
    format: sourceMetadata.format ?? null,
    width: sourceMetadata.width ?? null,
    height: sourceMetadata.height ?? null,
  };

  if (sourceMetadata.format === "webp") {
    asset.state = "already-webp";
    for (const index of asset.refIndexes) manifest.refs[index].state = "already-webp";
    return null;
  }
  if (sourceMetadata.format !== "jpeg") {
    asset.state = "unsupported";
    for (const index of asset.refIndexes) manifest.refs[index].state = "unsupported";
    return null;
  }

  const output = await sharp(input)
    .rotate()
    .resize({
      width: options.maxDimension,
      height: options.maxDimension,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: options.quality, effort: 4 })
    .toBuffer();
  const outputMetadata = await sharp(output, { failOn: "error", limitInputPixels: MAX_INPUT_PIXELS }).metadata();
  if (outputMetadata.format !== "webp") throw new Error("Sharp did not produce a valid WebP image.");

  const outputHash = sha256(output);
  if (asset.destination?.sha256 && asset.destination.sha256 !== outputHash) {
    throw new Error(`WebP output changed since the manifest was created: ${asset.sourcePath}`);
  }
  const path = destinationPath(asset.sourcePath, outputHash);
  const url = publicObjectUrl(manifest.projectOrigin, asset.bucket, path);
  asset.destination = {
    path,
    url,
    bytes: output.length,
    sha256: outputHash,
    width: outputMetadata.width ?? null,
    height: outputMetadata.height ?? null,
  };
  asset.state = "planned";
  for (const index of asset.refIndexes) {
    manifest.refs[index].newUrl = url;
    manifest.refs[index].state = "ready";
  }
  return output;
}

async function uploadAndVerify(asset, output, storage) {
  const { error: uploadError } = await storage.upload(asset.destination.path, output, {
    cacheControl: "31536000",
    contentType: "image/webp",
    upsert: false,
  });

  if (uploadError) {
    const { data: existing, error: existingError } = await storage.download(asset.destination.path);
    if (existingError || !existing) throw new Error(`Upload failed: ${uploadError.message}`);
    const existingBuffer = Buffer.from(await existing.arrayBuffer());
    if (sha256(existingBuffer) !== asset.destination.sha256) {
      throw new Error(`Destination already exists with different content: ${asset.destination.path}`);
    }
    asset.state = "reused";
  } else {
    asset.uploadCreated = true;
    asset.state = "uploaded";
  }

  await verifyDestination(asset, storage);
}

async function verifyDestination(asset, storage) {
  if (!asset.destination?.path || !asset.destination?.sha256) {
    throw new Error(`Manifest has no complete destination for ${asset.sourcePath}.`);
  }
  const { data: verified, error: verifyError } = await storage.download(asset.destination.path);
  if (verifyError || !verified) throw new Error(`Could not verify ${asset.destination.path}.`);
  if (verified.size > MAX_SOURCE_BYTES) throw new Error(`Stored replacement is unexpectedly large: ${asset.destination.path}`);
  const verifiedBuffer = Buffer.from(await verified.arrayBuffer());
  if (sha256(verifiedBuffer) !== asset.destination.sha256) throw new Error(`Hash mismatch for ${asset.destination.path}.`);
  const metadata = await sharp(verifiedBuffer, { failOn: "error", limitInputPixels: MAX_INPUT_PIXELS }).metadata();
  if (metadata.format !== "webp") throw new Error(`Stored replacement is not WebP: ${asset.destination.path}`);
}

async function processAsset(asset, manifest, options, storage) {
  if (["already-webp", "unsupported"].includes(asset.state)) return;
  try {
    if (["uploaded", "reused"].includes(asset.state)) {
      try {
        await verifyDestination(asset, storage);
        return;
      } catch {
        asset.state = "pending";
      }
    }
    const output = await prepareAsset(asset, manifest, options);
    if (!output || options.mode === "dry-run") return;
    await uploadAndVerify(asset, output, storage);
  } catch (error) {
    asset.state = "failed";
    asset.error = error instanceof Error ? error.message : String(error);
  }
}

async function runPool(items, concurrency, worker) {
  let nextIndex = 0;
  const errors = [];
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const item = items[nextIndex++];
      try {
        await worker(item);
      } catch (error) {
        errors.push(error);
      }
    }
  });
  await Promise.all(runners);
  if (errors.length) throw errors[0];
}

function sqlIdentifiers(table, column) {
  const field = REFERENCE_FIELDS.find((candidate) => candidate.table === table && candidate.column === column);
  if (!field) throw new Error(`Manifest contains an unsupported reference field: ${table}.${column}`);
  return { table: `public."${field.table}"`, column: `"${field.column}"` };
}

async function switchReferences(db, manifest) {
  const refs = manifest.refs.filter((ref) => ref.newUrl);
  for (const ref of refs) {
    const index = manifest.refs.indexOf(ref);
    const asset = manifest.assets.find((candidate) => candidate.refIndexes.includes(index));
    if (!asset || !["uploaded", "reused"].includes(asset.state)) {
      throw new Error(`Replacement was not verified for ${ref.table}.${ref.id}.`);
    }
  }
  await db.query("begin");
  try {
    await db.query("select pg_advisory_xact_lock(hashtext($1), hashtext($2))", ["city-gadgets-webp", manifest.bucket]);
    const committed = [];
    for (const ref of refs) {
      const identifiers = sqlIdentifiers(ref.table, ref.column);
      const currentResult = await db.query(
        `select ${identifiers.column} as value from ${identifiers.table} where id = $1::uuid for update`,
        [ref.id],
      );
      if (currentResult.rowCount !== 1) throw new Error(`Missing row ${ref.table}.${ref.id}`);
      const current = currentResult.rows[0].value;
      if (current === ref.newUrl) {
        committed.push(ref);
        continue;
      }
      if (current !== ref.oldUrl) throw new Error(`Concurrent URL change detected for ${ref.table}.${ref.id}`);
      const update = await db.query(
        `update ${identifiers.table} set ${identifiers.column} = $1 where id = $2::uuid and ${identifiers.column} = $3`,
        [ref.newUrl, ref.id, ref.oldUrl],
      );
      if (update.rowCount !== 1) throw new Error(`URL switch failed for ${ref.table}.${ref.id}`);
      committed.push(ref);
    }
    await db.query("commit");
    for (const ref of committed) ref.state = "committed";
  } catch (error) {
    await db.query("rollback").catch(() => {});
    throw error;
  }
}

async function verifyCommittedReferences(db, manifest) {
  const refs = manifest.refs.filter((ref) => ref.newUrl);
  await db.query("begin");
  try {
    await db.query("select pg_advisory_xact_lock(hashtext($1), hashtext($2))", ["city-gadgets-webp", manifest.bucket]);
    for (const ref of refs) {
      const identifiers = sqlIdentifiers(ref.table, ref.column);
      const currentResult = await db.query(
        `select ${identifiers.column} as value from ${identifiers.table} where id = $1::uuid for update`,
        [ref.id],
      );
      if (currentResult.rowCount !== 1) throw new Error(`Missing row ${ref.table}.${ref.id}`);
      if (currentResult.rows[0].value !== ref.newUrl) {
        throw new Error(`Committed URL no longer matches for ${ref.table}.${ref.id}.`);
      }
    }
    await db.query("commit");
    for (const ref of refs) ref.state = "committed";
  } catch (error) {
    await db.query("rollback").catch(() => {});
    throw error;
  }
}

async function verifyOriginals(manifest, refs, concurrency) {
  const originals = new Map();
  for (const ref of refs) {
    const index = manifest.refs.indexOf(ref);
    const asset = manifest.assets.find((candidate) => candidate.refIndexes.includes(index));
    if (!asset?.source?.sha256) throw new Error(`Manifest has no original hash for ${ref.table}.${ref.id}.`);
    const previous = originals.get(asset.sourceUrl);
    if (previous && previous !== asset.source.sha256) throw new Error(`Conflicting original hashes for ${asset.sourceUrl}.`);
    originals.set(asset.sourceUrl, asset.source.sha256);
  }
  await runPool([...originals.entries()], concurrency, async ([url, expectedHash]) => {
    const input = await fetchBuffer(url);
    if (sha256(input) !== expectedHash) throw new Error(`Original hash mismatch: ${url}`);
    await sharp(input, { failOn: "error", limitInputPixels: MAX_INPUT_PIXELS }).metadata();
  });
}

async function rollbackReferences(db, manifest, options) {
  const refs = manifest.refs.filter((ref) => ref.newUrl);
  await verifyOriginals(manifest, refs, options.concurrency);
  await db.query("begin");
  try {
    await db.query("select pg_advisory_xact_lock(hashtext($1), hashtext($2))", ["city-gadgets-webp", manifest.bucket]);
    const restored = [];
    for (const ref of refs) {
      const identifiers = sqlIdentifiers(ref.table, ref.column);
      const currentResult = await db.query(
        `select ${identifiers.column} as value from ${identifiers.table} where id = $1::uuid for update`,
        [ref.id],
      );
      if (currentResult.rowCount !== 1) throw new Error(`Missing row ${ref.table}.${ref.id}`);
      const current = currentResult.rows[0].value;
      if (current === ref.oldUrl) {
        restored.push(ref);
        continue;
      }
      if (current !== ref.newUrl) throw new Error(`Concurrent URL change detected for ${ref.table}.${ref.id}`);
      const update = await db.query(
        `update ${identifiers.table} set ${identifiers.column} = $1 where id = $2::uuid and ${identifiers.column} = $3`,
        [ref.oldUrl, ref.id, ref.newUrl],
      );
      if (update.rowCount !== 1) throw new Error(`Rollback failed for ${ref.table}.${ref.id}`);
      restored.push(ref);
    }
    await db.query("commit");
    for (const ref of restored) ref.state = "rolled-back";
  } catch (error) {
    await db.query("rollback").catch(() => {});
    throw error;
  }
}

async function preflightBucket(supabase, bucket) {
  const { data, error } = await supabase.storage.getBucket(bucket);
  if (error || !data) throw new Error(`Cannot access Storage bucket "${bucket}": ${error?.message ?? "not found"}`);
  if (!data.public) throw new Error(`Storage bucket "${bucket}" must be public for the current URL model.`);
  const allowed = data.allowed_mime_types;
  if (Array.isArray(allowed) && allowed.length && !allowed.includes("image/webp")) {
    throw new Error(`Storage bucket "${bucket}" does not allow image/webp uploads.`);
  }
}

function printSummary(manifest, manifestPath = null) {
  const summary = summaryFor(manifest);
  console.log(`\nReferences: ${summary.refs}`);
  console.log(`External references left unchanged: ${summary.externalRefs}`);
  console.log(`Referenced Storage objects: ${summary.assets}`);
  for (const [state, count] of Object.entries(summary.counts).sort()) console.log(`  ${state}: ${count}`);
  console.log(`JPEG bytes: ${formatBytes(summary.sourceBytes)} -> ${formatBytes(summary.outputBytes)} (${summary.savingsPercent}% smaller)`);
  const failures = manifest.assets.filter((asset) => asset.state === "failed");
  for (const asset of failures.slice(0, 20)) console.error(`  FAILED ${asset.sourcePath}: ${asset.error}`);
  if (failures.length > 20) console.error(`  ...and ${failures.length - 20} more failures`);
  if (manifestPath) console.log(`Manifest: ${manifestPath}`);
}

let activeManifest = null;
let activeManifestPath = null;
process.on("SIGINT", () => {
  if (activeManifest && activeManifestPath) {
    if (!["committed", "rolled-back"].includes(activeManifest.state)) activeManifest.state = "interrupted";
    saveManifest(activeManifestPath, activeManifest);
    console.error(`\nInterrupted. Resume with --resume ${JSON.stringify(activeManifestPath)}`);
  }
  process.exit(130);
});

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    usage();
    return;
  }

  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const dbUrl = process.env.DB_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!projectUrl || !dbUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL and DB_URL are required in .env.local.");
  if (["write", "resume"].includes(options.mode) && Number(process.versions.node.split(".")[0]) < 22) {
    throw new Error("Node.js 22 or newer is required for Supabase Storage write and resume modes.");
  }
  if (["write", "resume"].includes(options.mode) && !serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for write and resume modes. Add it to .env.local; never expose it to browser code.");
  }

  const db = await connectDatabase(dbUrl);
  try {
    if (options.mode === "rollback") {
      const manifest = loadManifest(options.manifestPath, projectUrl);
      activeManifest = manifest;
      activeManifestPath = options.manifestPath;
      await rollbackReferences(db, manifest, options);
      manifest.state = "rolled-back";
      validateManifest(manifest, projectUrl);
      saveManifest(options.manifestPath, manifest);
      printSummary(manifest, options.manifestPath);
      return;
    }

    let manifest;
    let manifestPath = null;
    let resumingCommitted = false;
    if (options.mode === "resume") {
      manifest = loadManifest(options.manifestPath, projectUrl);
      if (manifest.state === "rolled-back") {
        throw new Error("A rolled-back migration cannot be resumed. Start a new --write run instead.");
      }
      resumingCommitted = manifest.state === "committed";
      manifestPath = options.manifestPath;
      options.bucket = manifest.bucket;
      options.quality = manifest.config.quality;
      options.maxDimension = manifest.config.maxDimension;
      options.concurrency = manifest.config.concurrency;
    } else {
      const refs = await discoverReferences(db);
      manifest = createManifest(refs, projectUrl, options);
      if (options.mode === "write") {
        mkdirSync(MANIFEST_DIR, { recursive: true });
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        manifestPath = join(MANIFEST_DIR, `${timestamp}-${manifest.runId}.json`);
        saveManifest(manifestPath, manifest);
      }
    }

    activeManifest = manifest;
    activeManifestPath = manifestPath;
    let storage = null;
    if (["write", "resume"].includes(options.mode)) {
      const supabase = createClient(projectUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
      await preflightBucket(supabase, options.bucket);
      storage = supabase.storage.from(options.bucket);
      if (!resumingCommitted) manifest.state = "uploading";
      saveManifest(manifestPath, manifest);
    }

    let completed = 0;
    await runPool(manifest.assets, options.concurrency, async (asset) => {
      await processAsset(asset, manifest, options, storage);
      completed += 1;
      if (manifestPath && completed % 10 === 0) saveManifest(manifestPath, manifest);
      if (completed % 50 === 0 || completed === manifest.assets.length) {
        console.log(`Processed ${completed}/${manifest.assets.length} referenced Storage objects`);
      }
    });
    if (manifestPath) saveManifest(manifestPath, manifest);

    const failed = manifest.assets.filter((asset) => asset.state === "failed");
    if (failed.length) {
      manifest.state = "failed";
      if (manifestPath) saveManifest(manifestPath, manifest);
      printSummary(manifest, manifestPath);
      throw new Error(`${failed.length} image conversion(s) failed. Database URLs were not changed.`);
    }

    if (["write", "resume"].includes(options.mode)) {
      if (resumingCommitted) {
        await verifyCommittedReferences(db, manifest);
        manifest.state = "committed";
        validateManifest(manifest, projectUrl);
        saveManifest(manifestPath, manifest);
        printSummary(manifest, manifestPath);
        console.log("\nCommitted migration verified. No database URLs were changed.");
        return;
      }
      manifest.state = "uploaded";
      validateManifest(manifest, projectUrl);
      saveManifest(manifestPath, manifest);
      await switchReferences(db, manifest);
      manifest.state = "committed";
      validateManifest(manifest, projectUrl);
      saveManifest(manifestPath, manifest);
    }

    printSummary(manifest, manifestPath);
    if (options.mode === "dry-run") console.log("\nDry run complete. No Storage objects or database rows were changed.");
  } finally {
    await db.end().catch(() => {});
  }
}

main().catch((error) => {
  console.error(`\nError: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
