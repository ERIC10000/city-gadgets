import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data/products";

// Powers the header's instant-search dropdown. Kept lean: only the fields the
// suggestion row renders, capped at 8 results.
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ items: [], total: 0 });

  const { items, total } = await getProducts({ search: q, limit: 8, sort: "rating" });

  return NextResponse.json({
    total,
    items: items.map((p) => ({
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      price: p.price,
      compareAtPrice: p.compare_at_price,
      image: p.images[0]?.url ?? null,
      inStock: p.stock_quantity > 0,
    })),
  });
}
