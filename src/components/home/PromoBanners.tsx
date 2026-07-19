import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

/**
 * Designed promo tiles backed by real campaign photography with our own
 * overlaid copy — replaces template-style banners with correct branding.
 */
export function PromoBanners() {
  return (
    <section className="mx-auto w-full max-w-container-max px-margin-mobile py-6 md:px-gutter">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Flash sale — red campaign */}
        <Link
          href="/deals"
          className="group relative min-h-[220px] overflow-hidden rounded-3xl bg-inverse-surface md:min-h-[260px]"
        >
          <Image
            src="/banners/sale-red.jpg"
            alt=""
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover object-[70%_center] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
          <div className="relative z-10 flex min-h-[220px] flex-col justify-center p-8 md:min-h-[260px] md:p-10">
            <span className="mb-3 w-fit rounded-full bg-discount px-3 py-1 text-badge-text font-bold uppercase tracking-wide text-white">
              Flash Sale
            </span>
            <h3 className="text-2xl font-extrabold leading-tight text-white md:text-3xl">
              Up to 70% off
              <br />
              premium tech
            </h3>
            <span className="mt-4 flex w-fit items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-body-sm font-bold text-on-surface transition-transform group-hover:scale-[1.03]">
              Shop Hot Deals
              <Icon name="arrow_forward" className="text-[16px]" />
            </span>
          </div>
        </Link>

        {/* Trade-in — gold campaign */}
        <Link
          href="/sell"
          className="group relative min-h-[220px] overflow-hidden rounded-3xl bg-price-gold md:min-h-[260px]"
        >
          <Image
            src="/banners/cart-gold.jpg"
            alt=""
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover object-[75%_center] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/80 via-amber-900/35 to-transparent" />
          <div className="relative z-10 flex min-h-[220px] flex-col justify-center p-8 md:min-h-[260px] md:p-10">
            <span className="mb-3 w-fit rounded-full bg-white/90 px-3 py-1 text-badge-text font-bold uppercase tracking-wide text-amber-900">
              Trade-in
            </span>
            <h3 className="text-2xl font-extrabold leading-tight text-white md:text-3xl">
              Old device?
              <br />
              Turn it into cash
            </h3>
            <span className="mt-4 flex w-fit items-center gap-1.5 rounded-full bg-on-surface px-5 py-2.5 text-body-sm font-bold text-white transition-transform group-hover:scale-[1.03]">
              Sell Your Device
              <Icon name="arrow_forward" className="text-[16px]" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
