import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { ProductGrid } from "@/components/product/ProductGrid";
import { RichText } from "@/components/ui/RichText";
import { Icon } from "@/components/ui/Icon";
import { GuideVisual } from "@/components/guides/GuideVisual";
import { getGuides, getGuideBySlug } from "@/lib/data/guides";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProducts } from "@/lib/data/products";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { absoluteUrl, canonical } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// Refresh so guides published from the vendor studio appear without a redeploy.
export const revalidate = 600;

export async function generateStaticParams() {
  return (await getGuides()).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: canonical(`/guides/${guide.slug}`),
    openGraph: { type: "article", title: guide.title, description: guide.description },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  const [category, primary] = await Promise.all([
    getCategoryBySlug(guide.categorySlug),
    getProducts(guide.productQuery),
  ]);
  // Never show an empty grid: if the tight query (e.g. a price cap the current
  // catalog can't meet) returns nothing, fall back to the most relevant
  // products from the same category so the guide always funnels to something.
  let picks = primary.items;
  if (picks.length === 0) {
    const fallback = await getProducts({
      categorySlug: guide.categorySlug,
      sort: guide.productQuery.sort ?? "featured",
      limit: guide.productQuery.limit ?? 9,
    });
    picks = fallback.items;
  }
  // Article schema image — the guide's own hero photo, logo as a fallback.
  const articleImage = guide.heroImage || absoluteUrl("/logo.jpeg");

  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-8 md:px-gutter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: guide.title,
              description: guide.description,
              path: `/guides/${guide.slug}`,
              image: articleImage,
              updatedAt: guide.updatedAt,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Buying Guides", href: "/guides" },
              { name: guide.title, href: `/guides/${guide.slug}` },
            ]),
          ),
        }}
      />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Buying Guides", href: "/guides" },
          { name: guide.title },
        ]}
      />

      {/* Magazine-style hero — title overlaid on the guide's hero photo */}
      <GuideVisual
        categorySlug={guide.categorySlug}
        image={guide.heroImage}
        priority
        scrim
        sizes="(max-width: 1280px) 100vw, 1200px"
        className="mt-6 flex min-h-[240px] flex-col justify-end rounded-3xl p-6 md:min-h-[320px] md:p-10"
      >
        <div className="relative max-w-3xl">
          {category && (
            <span className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-badge-text font-bold uppercase tracking-wide text-white backdrop-blur-sm">
              {category.name}
            </span>
          )}
          <h1 className="text-3xl font-extrabold leading-tight text-white drop-shadow md:text-4xl">{guide.title}</h1>
          <div className="mt-3 flex items-center gap-2 text-body-sm text-white/85">
            <Icon name="schedule" className="text-[17px]" />
            {guide.readMinutes} min read
            <span className="text-white/40">•</span>
            Updated {formatDate(guide.updatedAt)}
          </div>
        </div>
      </GuideVisual>

      {/* Article body */}
      <article className="mx-auto mt-8 max-w-3xl">
        <RichText content={guide.body} className="text-body-md" />
      </article>

      {/* Live, always-current product picks — the funnel to buy */}
      <section className="mt-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">{guide.picksHeading}</h2>
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="inline-flex items-center gap-1 text-body-sm font-bold text-primary hover:underline"
            >
              Shop all {category.name}
              <Icon name="arrow_forward" className="text-[16px]" />
            </Link>
          )}
        </div>
        <ProductGrid products={picks} />
      </section>

      <div className="mt-12 border-t border-outline-variant pt-6">
        <Link href="/guides" className="inline-flex items-center gap-1.5 text-body-sm font-bold text-primary hover:underline">
          <Icon name="arrow_back" className="text-[16px]" />
          All buying guides
        </Link>
      </div>
    </div>
  );
}
