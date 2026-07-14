/**
 * Applies the schema migration + seed to a Postgres/Supabase database.
 *
 * Usage:
 *   DB_URL="postgresql://user:pass@host:port/postgres" node scripts/db-push.mjs
 *
 * Runs supabase/migrations/0001_init.sql then supabase/seed.sql, and prints
 * row counts. Uses SSL (required by Supabase). The connection string is read
 * from the DB_URL env var so no credentials are written to disk.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  console.error("✗ Set DB_URL env var to your Supabase connection string.");
  process.exit(1);
}

const migration = readFileSync(join(root, "supabase/migrations/0001_init.sql"), "utf8");
const seed = readFileSync(join(root, "supabase/seed.sql"), "utf8");

const client = new pg.Client({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 40000,
  query_timeout: 120000,
});

try {
  console.log("→ Connecting…");
  await client.connect();
  console.log("✓ Connected");

  // Only run the (non-idempotent) schema migration on a fresh database so this
  // script is safe to re-run after `npm run seed:generate` to sync the catalog.
  const exists = await client.query("select to_regclass('public.products') as t");
  if (exists.rows[0].t) {
    console.log("• Schema already present — skipping migration.");
  } else {
    console.log("→ Applying schema migration (0001_init.sql)…");
    await client.query(migration);
    console.log("✓ Schema applied");
  }

  console.log("→ Seeding catalog (seed.sql)…");
  await client.query(seed);
  console.log("✓ Seed applied");

  const counts = await client.query(`
    select
      (select count(*) from public.categories)     as categories,
      (select count(*) from public.products)        as products,
      (select count(*) from public.product_images)  as images
  `);
  const { categories, products, images } = counts.rows[0];
  console.log(`\n✓ Done — ${categories} categories, ${products} products, ${images} images in the database.`);
} catch (err) {
  console.error("\n✗ Failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
