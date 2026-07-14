import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { ProductVideo } from "@/lib/types";

export function CircularEconomy({ videos }: { videos: ProductVideo[] }) {
  if (!videos.length) return null;
  return (
    <section className="bg-surface-off-white py-12">
      <div className="mx-auto w-full max-w-container-max px-margin-mobile md:px-gutter">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-on-surface md:text-2xl">Join the Circular Economy</h2>
          <Link href="/inspiration" className="flex items-center gap-1 text-body-sm font-semibold text-on-surface hover:text-secondary">
            See all <Icon name="chevron_right" className="text-[18px]" />
          </Link>
        </div>
        <p className="mb-6 max-w-2xl text-body-sm text-on-surface-variant">
          Give tech a second life. See how our community saves money and cuts e-waste with premium pre-loved gadgets.
        </p>
        <div className="no-scrollbar scrollbar-thin -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          {videos.map((v) => (
            <Link
              key={v.id}
              href="/inspiration"
              className="group relative aspect-[9/14] w-[200px] shrink-0 overflow-hidden rounded-2xl bg-inverse-surface"
            >
              {v.thumbnail_url && (
                <Image src={v.thumbnail_url} alt={v.title} fill sizes="200px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-on-surface shadow-lg transition-transform group-hover:scale-110">
                <Icon name="play_arrow" filled className="text-[26px]" />
              </span>
              <p className="absolute inset-x-0 bottom-0 line-clamp-2 p-3 text-badge-text font-semibold text-white">{v.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
