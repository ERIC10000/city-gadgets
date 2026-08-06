import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { GuideVisual } from "@/components/guides/GuideVisual";
import { getGuides } from "@/lib/data/guides";
import { getCategories } from "@/lib/data/categories";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Buying Guides — Tech Prices & Advice in Kenya",
  description:
    "Buying guides for phones, laptops, gaming and audio in Kenya — honest advice and live price lists to help you choose, from City Gadgets. Genuine stock, warranty, free Nairobi delivery.",
  alternates: canonical("/guides"),
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

export default async function GuidesPage() {
  const [guides, categories] = await Promise.all([getGuides(), getCategories()]);
  const nameBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
  const [feature, ...rest] = guides;

  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-8 md:px-gutter">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Buying Guides" }]} />

      <header className="mb-10 mt-6 max-w-2xl">
        <span className="text-badge-text font-bold uppercase tracking-widest text-primary">City Gadgets</span>
        <h1 className="mt-2 text-3xl font-extrabold text-on-surface md:text-4xl">Buying Guides</h1>
        <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
          Straight-talking advice and live price lists to help you buy the right phone, laptop, console or
          pair of earbuds in Kenya — every pick genuine, warrantied and delivered.
        </p>
      </header>

      {/* Featured guide — wide hero card */}
      {feature && (
        <Link
          href={`/guides/${feature.slug}`}
          className="group mb-8 grid overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-2"
        >
          <GuideVisual categorySlug={feature.categorySlug} className="min-h-[200px] md:min-h-full" iconClassName="text-[80px]">
            <span className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 text-badge-text font-bold uppercase tracking-wide text-white backdrop-blur-sm">
              {nameBySlug[feature.categorySlug] ?? "Guide"}
            </span>
          </GuideVisual>
          <div className="flex flex-col justify-center p-6 md:p-10">
            <div className="mb-3 flex items-center gap-2 text-badge-text text-on-surface-variant">
              <Icon name="schedule" className="text-[15px]" />
              {feature.readMinutes} min read
              <span className="text-outline-variant">•</span>
              {formatDate(feature.updatedAt)}
            </div>
            <h2 className="text-2xl font-extrabold leading-tight text-on-surface group-hover:text-primary md:text-3xl">
              {feature.title}
            </h2>
            <p className="mt-3 text-body-md text-on-surface-variant">{feature.excerpt}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-body-sm font-bold text-primary">
              Read guide
              <Icon name="arrow_forward" className="text-[18px] transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      )}

      {/* The rest */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-card transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <GuideVisual categorySlug={guide.categorySlug} className="aspect-[16/9]">
              <span className="absolute left-4 top-4 rounded-full bg-white/15 px-2.5 py-1 text-badge-text font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                {nameBySlug[guide.categorySlug] ?? "Guide"}
              </span>
            </GuideVisual>
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-2 flex items-center gap-2 text-badge-text text-on-surface-variant">
                <Icon name="schedule" className="text-[15px]" />
                {guide.readMinutes} min read
                <span className="text-outline-variant">•</span>
                {formatDate(guide.updatedAt)}
              </div>
              <h2 className="text-lg font-bold leading-snug text-on-surface group-hover:text-primary">{guide.title}</h2>
              <p className="mt-2 line-clamp-2 flex-1 text-body-sm text-on-surface-variant">{guide.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-body-sm font-bold text-primary">
                Read guide
                <Icon name="arrow_forward" className="text-[16px] transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
