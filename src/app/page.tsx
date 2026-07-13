import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryNav } from "@/components/home/CategoryNav";
import { TrustBanner } from "@/components/home/TrustBanner";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { getCategories } from "@/lib/data/categories";
import { getFeaturedProducts, getProducts } from "@/lib/data/products";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default async function HomePage() {
  const [categories, featured, bestSellers] = await Promise.all([
    getCategories(),
    getFeaturedProducts(4),
    getProducts({ sort: "rating", limit: 8 }),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />

      <HeroSlider products={featured.length ? featured : bestSellers.items} />
      <CategoryNav categories={categories} />
      <TrustBanner />

      <section className="bg-surface-off-white py-16">
        <div className="mx-auto w-full max-w-container-max px-margin-mobile md:px-gutter">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-headline-lg font-bold text-on-surface">Best Sellers</h2>
              <p className="mt-2 text-on-surface-variant">The most popular gadgets in the city right now.</p>
            </div>
            <Link href="/shop" className="flex items-center gap-2 font-bold text-primary hover:underline">
              View All
              <Icon name="chevron_right" className="text-[20px]" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.items.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
        </div>
      </section>

      <NewsletterCTA />
    </>
  );
}
