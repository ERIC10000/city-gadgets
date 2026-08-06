import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
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
  const heroBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.hero_image]));

  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-8 md:px-gutter">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Buying Guides" }]} />

      <header className="mb-10 mt-6 max-w-2xl">
        <h1 className="text-3xl font-extrabold text-on-surface md:text-headline-lg">Buying Guides</h1>
        <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
          Straight-talking advice and live price lists to help you buy the right phone, laptop, console or
          pair of earbuds in Kenya — every pick genuine, warrantied and delivered.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => {
          const hero = heroBySlug[guide.categorySlug];
          return (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-card transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-surface-container">
                {hero && (
                  <Image
                    src={hero}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center gap-2 text-badge-text text-on-surface-variant">
                  <Icon name="schedule" className="text-[15px]" />
                  {guide.readMinutes} min read
                  <span className="text-outline-variant">•</span>
                  {formatDate(guide.updatedAt)}
                </div>
                <h2 className="text-lg font-bold leading-snug text-on-surface group-hover:text-primary">
                  {guide.title}
                </h2>
                <p className="mt-2 line-clamp-2 flex-1 text-body-sm text-on-surface-variant">{guide.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-body-sm font-bold text-primary">
                  Read guide
                  <Icon name="arrow_forward" className="text-[16px] transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
