import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

export function HotDealsBanner() {
  return (
    <div className="relative min-h-[260px] overflow-hidden rounded-3xl bg-inverse-surface md:min-h-[320px]">
      {/* Red sale photography backdrop, phone & ornaments kept to the right */}
      <Image src="/banners/sale-red.jpg" alt="" fill priority sizes="100vw" className="object-cover object-[65%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />

      <div className="relative z-10 flex min-h-[260px] flex-col justify-center px-8 py-10 md:min-h-[320px] md:px-14">
        <span className="mb-4 flex w-fit items-center gap-1.5 rounded-full bg-discount px-4 py-1.5 text-badge-text font-bold uppercase tracking-wide text-white">
          <Icon name="local_fire_department" filled className="text-[14px]" />
          Limited-time markdowns
        </span>
        <h1 className="text-4xl font-extrabold uppercase italic leading-none tracking-tight text-white md:text-7xl">
          Hot Deals
        </h1>
        <p className="mt-4 max-w-md text-body-sm text-white/80 md:text-body-md">
          Up to <span className="font-extrabold text-price-gold">70% off retail</span> on premium tech — while stock
          lasts. New markdowns land daily.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/15 px-4 py-1.5 text-badge-text font-bold text-white backdrop-blur-sm">
            12-Month Warranty
          </span>
          <span className="rounded-full bg-white/15 px-4 py-1.5 text-badge-text font-bold text-white backdrop-blur-sm">
            M-Pesa accepted
          </span>
          <span className="rounded-full bg-price-gold px-4 py-1.5 text-badge-text font-bold text-inverse-surface">
            Free Nairobi delivery
          </span>
        </div>
      </div>
    </div>
  );
}
