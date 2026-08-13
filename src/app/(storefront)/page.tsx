import { HeroCarousel, type HeroImage, type HeroSlide } from "@/components/home/HeroCarousel";
import { TrustStrip } from "@/components/home/TrustStrip";
import { PopularCategories, type CategoryCircle } from "@/components/home/PopularCategories";
import { TabbedProductGrid, type GridGroup } from "@/components/home/TabbedProductGrid";
import { PromoBanners } from "@/components/home/PromoBanners";
import { TopDeals } from "@/components/home/TopDeals";
import { RefurbishedBanner } from "@/components/home/RefurbishedBanner";
import { SectionRail } from "@/components/home/SectionRail";
import { CircularEconomy } from "@/components/home/CircularEconomy";
import { HomeGuides } from "@/components/home/HomeGuides";
import { getCategories } from "@/lib/data/categories";
import { getProducts, getCategoryCounts } from "@/lib/data/products";
import { getGuides } from "@/lib/data/guides";
import { getVideos } from "@/lib/data/videos";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { canonical } from "@/lib/site";
import type { Product } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: canonical("/"),
};

// Cache the homepage and refresh it periodically (ISR) instead of rendering it
// fresh on every request. Product mutations already call revalidatePath("/"),
// so new stock still appears immediately.
export const revalidate = 600;

// How many products to render per browse tab. The full catalogue lives behind
// the "Browse" links — shipping all ~600 into the homepage HTML was the biggest
// single cause of the multi-second load.
const HOME_TAB_LIMIT = 12;

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

/**
 * Picks up to `n` hero images for a department, one per brand, so the banner
 * showcases the range stocked rather than three of the same handset. Products
 * arrive sorted by rating, so the pick is still the best-rated example of each
 * brand. If a department has fewer distinct brands than slots, the remaining
 * slots are filled with the next best-rated products, skipping duplicate
 * imagery.
 */
function pickBrandImages(products: Product[], slug: string, n: number): HeroImage[] {
  const inCategory = products.filter((p) => p.category_slug === slug && p.images[0]?.url);

  const picked: HeroImage[] = [];
  const seenBrands = new Set<string>();
  const seenUrls = new Set<string>();

  for (const p of inCategory) {
    const url = p.images[0].url;
    const brand = p.brand?.trim();
    if (!brand || seenBrands.has(brand.toLowerCase()) || seenUrls.has(url)) continue;
    seenBrands.add(brand.toLowerCase());
    seenUrls.add(url);
    picked.push({ src: url, brand });
    if (picked.length === n) return picked;
  }

  for (const p of inCategory) {
    const url = p.images[0].url;
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);
    picked.push({ src: url, brand: p.brand?.trim() || null });
    if (picked.length === n) break;
  }

  return picked;
}

export default async function HomePage() {
  const [categories, { items: all }, videos, counts] = await Promise.all([
    getCategories(),
    getProducts({ limit: 200, sort: "rating" }),
    getVideos(),
    getCategoryCounts(),
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
      images: pickBrandImages(all, "phones", 3),
    },
    {
      eyebrow: "Pro power, less spend",
      title: "MacBooks & Laptops",
      subtitle: "M5 performance and all-day battery, with a 12-month warranty.",
      href: "/category/macbooks",
      cta: "Shop Laptops",
      images: pickBrandImages(all, "macbooks", 3),
    },
    {
      eyebrow: "Play more, pay less",
      title: "Next-Gen Gaming",
      subtitle: "Consoles, handhelds and VR — genuine gear, unbeatable prices.",
      href: "/category/consoles",
      cta: "Shop Gaming",
      images: pickBrandImages(all, "consoles", 3),
    },
  ].filter((s) => s.images.length > 0);

  // Category circles — one representative product image per department.
  const circles: CategoryCircle[] = categories
    .map((c) => {
      const img = byCategory(c.slug)[0]?.images[0]?.url;
      return img ? { slug: c.slug, label: CIRCLE_LABEL[c.slug] ?? c.name, image: img } : null;
    })
    .filter((c): c is CategoryCircle => c !== null);

  // Browse grid — an "All" tab so the whole catalog is visible up front, then
  // one tab per stocked department.
  const browseGroups: GridGroup[] = [
    { label: "All Products", href: "/shop", products: all.slice(0, HOME_TAB_LIMIT), count: counts.total },
    ...FAVORITE_TABS.map((tab) => ({
      label: tab.label,
      href: `/category/${tab.slug}`,
      products: byCategory(tab.slug).slice(0, HOME_TAB_LIMIT),
      count: counts.byCategory[tab.slug] ?? byCategory(tab.slug).length,
    })),
  ].filter((g) => g.products.length > 0);

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

  const guides = getGuides().slice(0, 3);
  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

  // Departments already surfaced by the browse grid's tabs — don't repeat them
  // lower down the page as near-identical sections.
  const browsedSlugs = new Set(browseGroups.flatMap((g) => g.products.map((p) => p.category_slug)));
  const showGaming = gaming.length > 0 && !browsedSlugs.has("consoles");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />

      <HeroCarousel slides={heroSlides} />
      <TrustStrip />
      <PopularCategories items={circles} />
      <TabbedProductGrid
        title="Shop Our Collection"
        subtitle="Every product in stock — filter by department or browse the lot."
        groups={browseGroups}
        initialCount={12}
      />
      <PromoBanners />
      <TopDeals products={topDeals} />
      <RefurbishedBanner />
      <SectionRail title="Smart Home & Streaming" href="/category/streaming" products={streaming} />
      {showGaming && <SectionRail title="Gaming" href="/category/consoles" products={gaming} tone="gray" />}
      <HomeGuides guides={guides} nameBySlug={categoryNames} />
      <CircularEconomy videos={videos} />
    </>
  );
}
