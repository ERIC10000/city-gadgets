import { HeroCarousel, type HeroSlide } from "@/components/home/HeroCarousel";
import { TrustStrip } from "@/components/home/TrustStrip";
import { PopularCategories, type CategoryCircle } from "@/components/home/PopularCategories";
import { TabbedProductRail, type RailGroup } from "@/components/home/TabbedProductRail";
import { PromoBanners } from "@/components/home/PromoBanners";
import { TopDeals } from "@/components/home/TopDeals";
import { RefurbishedBanner } from "@/components/home/RefurbishedBanner";
import { SectionRail } from "@/components/home/SectionRail";
import { CircularEconomy } from "@/components/home/CircularEconomy";
import { getCategories } from "@/lib/data/categories";
import { getProducts } from "@/lib/data/products";
import { getVideos } from "@/lib/data/videos";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import type { Product } from "@/lib/types";

const CIRCLE_LABEL: Record<string, string> = {
  consoles: "Gaming",
  phones: "Smartphones",
  macbooks: "Laptops",
  tablets: "Tablets",
  wearables: "Smartwatches",
  audio: "Audio",
  cameras: "Cameras",
  "gaming-accessories": "Accessories",
  streaming: "Streaming",
  accessories: "Tech Bits",
};

const FAVORITE_TABS: { label: string; slug: string }[] = [
  { label: "Smartphones", slug: "phones" },
  { label: "Laptops", slug: "macbooks" },
  { label: "Tablets", slug: "tablets" },
  { label: "Smartwatches", slug: "wearables" },
  { label: "Audio", slug: "audio" },
  { label: "Gaming", slug: "consoles" },
];

function pickImages(products: Product[], slug: string, n: number): string[] {
  return products
    .filter((p) => p.category_slug === slug && p.images[0]?.url)
    .slice(0, n)
    .map((p) => p.images[0].url);
}

export default async function HomePage() {
  const [categories, { items: all }, videos] = await Promise.all([
    getCategories(),
    getProducts({ limit: 1000, sort: "rating" }),
    getVideos(),
  ]);

  const byCategory = (slug: string) => all.filter((p) => p.category_slug === slug);

  // Hero slides built from real product imagery per department; departments
  // with no stocked products (no imagery) are dropped from the rotation.
  const heroSlides: HeroSlide[] = [
    {
      eyebrow: "Up to 70% off retail",
      title: "Premium Smartphones. Better Prices.",
      subtitle: "Expertly sourced, quality guaranteed — flagship phones for less.",
      href: "/category/phones",
      cta: "Shop Now",
      images: pickImages(all, "phones", 3),
    },
    {
      eyebrow: "Pro power, less spend",
      title: "MacBooks & Laptops",
      subtitle: "M5 performance and all-day battery, with a 12-month warranty.",
      href: "/category/macbooks",
      cta: "Shop Laptops",
      images: pickImages(all, "macbooks", 3),
    },
    {
      eyebrow: "Play more, pay less",
      title: "Next-Gen Gaming",
      subtitle: "Consoles, handhelds and VR — genuine gear, unbeatable prices.",
      href: "/category/consoles",
      cta: "Shop Gaming",
      images: pickImages(all, "consoles", 3),
    },
  ].filter((s) => s.images.length > 0);

  // Category circles — one representative product image per department.
  const circles: CategoryCircle[] = categories
    .map((c) => {
      const img = byCategory(c.slug)[0]?.images[0]?.url;
      return img ? { slug: c.slug, label: CIRCLE_LABEL[c.slug] ?? c.name, image: img } : null;
    })
    .filter((c): c is CategoryCircle => c !== null);

  // Customer favourites — top-rated per tab.
  const favoriteGroups: RailGroup[] = FAVORITE_TABS.map((tab) => ({
    label: tab.label,
    href: `/category/${tab.slug}`,
    products: byCategory(tab.slug).slice(0, 8),
  })).filter((g) => g.products.length > 0);

  // Today's top deals — biggest discounts first.
  const topDeals = all
    .filter((p) => p.compare_at_price && p.compare_at_price > p.price)
    .sort(
      (a, b) =>
        (b.compare_at_price! - b.price) / b.compare_at_price! - (a.compare_at_price! - a.price) / a.compare_at_price!,
    )
    .slice(0, 8);

  const streaming = byCategory("streaming").slice(0, 8);
  const gaming = [...byCategory("consoles"), ...byCategory("gaming-accessories")].slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />

      <HeroCarousel slides={heroSlides} />
      <TrustStrip />
      <PopularCategories items={circles} />
      <TabbedProductRail title="Customer Favorites" groups={favoriteGroups} />
      <PromoBanners />
      <TopDeals products={topDeals} />
      <RefurbishedBanner />
      <SectionRail title="Smart Home & Streaming" href="/category/streaming" products={streaming} />
      <SectionRail title="Gaming" href="/category/consoles" products={gaming} tone="gray" />
      <CircularEconomy videos={videos} />
    </>
  );
}
