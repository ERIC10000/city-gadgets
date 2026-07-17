"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ProductBadge } from "@/components/ui/ProductBadge";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/lib/types";

export function ImageGallery({ images, badge }: { images: ProductImage[]; badge?: string | null }) {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function goTo(index: number) {
    setActive(index);
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTo({ left: scroller.clientWidth * index, behavior: "smooth" });
  }

  function handleScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const index = Math.round(scroller.scrollLeft / scroller.clientWidth);
    if (index !== active) setActive(index);
  }

  if (images.length === 0) {
    return <div className="aspect-square w-full rounded-2xl border border-outline-variant bg-surface-container-low" />;
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Vertical thumbnail rail (desktop) */}
      {images.length > 1 && (
        <div className="no-scrollbar order-2 flex gap-3 overflow-x-auto md:order-1 md:max-h-[520px] md:flex-col md:overflow-y-auto">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => goTo(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                "relative h-16 w-16 flex-none overflow-hidden rounded-xl border-2 bg-white transition-colors md:h-20 md:w-20",
                i === active ? "border-on-surface" : "border-outline-variant hover:border-on-surface/40",
              )}
            >
              <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}

      {/* Main image — fixed, framed viewport so any photo (portrait or landscape) fits */}
      <div className="relative order-1 min-w-0 flex-1 md:order-2">
        {badge ? <ProductBadge label={badge} className="absolute left-4 top-4 z-10" /> : null}
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="no-scrollbar flex aspect-square max-h-[420px] w-full snap-x snap-mandatory overflow-x-auto rounded-2xl border border-outline-variant bg-white md:max-h-[520px] md:rounded-3xl"
        >
          {images.map((img, i) => (
            <div key={img.url + i} className="relative h-full w-full flex-none snap-center">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-contain p-6 md:p-10"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-2 md:hidden">
            {images.map((img, i) => (
              <button
                key={img.url + i}
                onClick={() => goTo(i)}
                aria-label={`Show image ${i + 1}`}
                className={cn("h-2 rounded-full transition-all", i === active ? "w-6 bg-on-surface" : "w-2 bg-outline-variant")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
