/**
 * Pushes the generated seed data straight into a real Supabase project using
 * the service role key (bypasses RLS). Alternative to pasting supabase/seed.sql
 * into the SQL editor — useful for re-seeding after schema changes.
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 * Run with: npm run seed:push
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import categories from "../src/data/seed/categories.generated.json" with { type: "json" };
import products from "../src/data/seed/products.generated.json" with { type: "json" };

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local — see README setup section.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function main() {
  console.log(`Seeding ${categories.length} categories...`);
  for (const [index, category] of categories.entries()) {
    const { error } = await supabase
      .from("categories")
      .upsert({ ...category, sort_order: index }, { onConflict: "slug" });
    if (error) throw new Error(`category ${category.slug}: ${error.message}`);
  }

  const { data: categoryRows, error: catErr } = await supabase.from("categories").select("id, slug");
  if (catErr) throw catErr;
  const categoryIdBySlug = new Map(categoryRows!.map((c) => [c.slug, c.id]));

  console.log(`Seeding ${products.length} products...`);
  for (const product of products) {
    const { images, category_slug, ...rest } = product;
    const { data: upserted, error } = await supabase
      .from("products")
      .upsert({ ...rest, category_id: categoryIdBySlug.get(category_slug), status: "published" }, { onConflict: "slug" })
      .select("id")
      .single();
    if (error) throw new Error(`product ${product.slug}: ${error.message}`);

    await supabase.from("product_images").delete().eq("product_id", upserted.id);
    const rows = images.map((img, i) => ({ product_id: upserted.id, url: img.url, alt_text: img.alt, sort_order: i }));
    const { error: imgErr } = await supabase.from("product_images").insert(rows);
    if (imgErr) throw new Error(`images for ${product.slug}: ${imgErr.message}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
