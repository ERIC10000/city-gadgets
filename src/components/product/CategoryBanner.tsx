import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

/**
 * Department hero: full-bleed photography with a left-to-right scrim and
 * clean overlaid typography — no template placeholders, real branding.
 */
export function CategoryBanner({
  title,
  tagline,
  image,
  productCount,
}: {
  title: string;
  tagline?: string | null;
  image: string;
  productCount?: number;
}) {
  return (
    <div className="relative min-h-[240px] overflow-hidden rounded-3xl bg-inverse-surface md:min-h-[300px]">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      {/* Legibility scrim */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />

      <div className="relative z-10 flex min-h-[240px] flex-col justify-center px-8 py-10 md:min-h-[300px] md:px-14">
        <div className="mb-3 flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-price-gold text-inverse-surface">
            <Icon name="bolt" filled className="text-[14px]" />
          </span>
          <span className="text-badge-text font-extrabold uppercase tracking-widest text-white/90">City Gadgets</span>
        </div>

        <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">{title}</h1>
        {tagline && <p className="mt-3 max-w-md text-body-sm text-white/75 md:text-body-md">{tagline}</p>}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {typeof productCount === "number" && (
            <span className="rounded-full bg-white/15 px-4 py-1.5 text-badge-text font-bold text-white backdrop-blur-sm">
              {productCount} genuine {productCount === 1 ? "product" : "products"}
            </span>
          )}
          <span className="rounded-full bg-white/15 px-4 py-1.5 text-badge-text font-bold text-white backdrop-blur-sm">
            M-Pesa accepted
          </span>
          <span className="rounded-full bg-price-gold px-4 py-1.5 text-badge-text font-bold text-inverse-surface">
            Same-day Nairobi delivery
          </span>
        </div>
      </div>
    </div>
  );
}
