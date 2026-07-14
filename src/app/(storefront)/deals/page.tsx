import type { Metadata } from "next";
import { HotDealsBanner } from "@/components/deals/HotDealsBanner";
import { FeaturedDeals } from "@/components/deals/FeaturedDeals";
import { DealsExplorer } from "@/components/deals/DealsExplorer";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { getProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Hot Deals",
  description: "Limited-time markdowns on premium smartphones, laptops, gaming and more — up to 70% off retail.",
};

function discountOf(p: Product) {
  return p.compare_at_price && p.compare_at_price > p.price ? (p.compare_at_price - p.price) / p.compare_at_price : 0;
}

export default async function DealsPage() {
  const [{ items: deals }, categories] = await Promise.all([
    getProducts({ onSaleOnly: true, limit: 1000 }),
    getCategories(),
  ]);

  const byDiscount = [...deals].sort((a, b) => discountOf(b) - discountOf(a));
  const featured = byDiscount.slice(0, 6);
  const bannerImages = byDiscount
    .filter((p) => p.images[0]?.url)
    .slice(0, 4)
    .map((p) => p.images[0].url);

  const catOptions = categories
    .filter((c) => deals.some((p) => p.category_slug === c.slug))
    .map((c) => ({ slug: c.slug, label: c.name.replace(/ &.*$/, "").replace("Gaming Consoles", "Consoles") }));

  return (
    <div className="mx-auto w-full max-w-container-max space-y-10 px-margin-mobile py-6 md:px-gutter">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Hot Deals" }]} />
      <HotDealsBanner images={bannerImages} />
      <FeaturedDeals products={featured} />

      <div>
        <h2 className="mb-6 text-xl font-extrabold text-on-surface md:text-2xl">All Hot Deals</h2>
        <DealsExplorer products={deals} categories={catOptions} />
      </div>
    </div>
  );
}
