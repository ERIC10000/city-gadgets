import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { ProductGrid } from "@/components/product/ProductGrid";
import { RichText } from "@/components/ui/RichText";
import { Icon } from "@/components/ui/Icon";
import { getGuides, getGuideBySlug } from "@/lib/data/guides";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProducts } from "@/lib/data/products";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { absoluteUrl, canonical } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
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
  const guide = getGuideBySlug(slug);
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
  const hero = category?.hero_image ?? "/banners/cart-gold.webp";

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
              image: hero.startsWith("http") ? hero : absoluteUrl(hero),
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

      <article className="mx-auto mt-6 max-w-3xl">
        <header>
          <h1 className="text-3xl font-extrabold leading-tight text-on-surface md:text-4xl">{guide.title}</h1>
          <div className="mt-3 flex items-center gap-2 text-body-sm text-on-surface-variant">
            <Icon name="schedule" className="text-[17px]" />
            {guide.readMinutes} min read
            <span className="text-outline-variant">•</span>
            Updated {formatDate(guide.updatedAt)}
          </div>
        </header>

        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-surface-container">
          <Image src={hero} alt="" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
        </div>

        <RichText content={guide.body} className="mt-8 text-body-md" />
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
