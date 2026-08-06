import { getProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { buildGoogleMerchantFeed } from "@/lib/google-merchant";

// Regenerate at most hourly; the CDN header below lets Vercel serve it from the
// edge between rebuilds so Merchant Center's scheduled fetch is always fast.
export const revalidate = 3600;

export async function GET() {
  const [{ items: products }, categories] = await Promise.all([
    getProducts({ limit: 1000 }),
    getCategories(),
  ]);

  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
  const feed = buildGoogleMerchantFeed(products, categoryNames);

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
