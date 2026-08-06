import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { GuideVisual } from "@/components/guides/GuideVisual";
import type { Guide } from "@/lib/data/guides";

export function HomeGuides({ guides, nameBySlug }: { guides: Guide[]; nameBySlug: Record<string, string> }) {
  if (guides.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-container-max px-margin-mobile py-12 md:px-gutter">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">Buying Guides</h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">Honest advice and live prices to help you choose.</p>
        </div>
        <Link
          href="/guides"
          className="inline-flex shrink-0 items-center gap-1 text-body-sm font-bold text-primary hover:underline"
        >
          All guides
          <Icon name="arrow_forward" className="text-[16px]" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-card transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <GuideVisual
              categorySlug={guide.categorySlug}
              image={guide.heroImage}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              className="aspect-[16/9]"
            >
              <span className="absolute left-4 top-4 rounded-full bg-black/55 px-2.5 py-1 text-badge-text font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                {nameBySlug[guide.categorySlug] ?? "Guide"}
              </span>
            </GuideVisual>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-bold leading-snug text-on-surface group-hover:text-primary">{guide.title}</h3>
              <p className="mt-2 line-clamp-2 flex-1 text-body-sm text-on-surface-variant">{guide.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-body-sm font-bold text-primary">
                Read guide
                <Icon name="arrow_forward" className="text-[16px] transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
