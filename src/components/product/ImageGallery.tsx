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
    return <div className="aspect-square w-full rounded-2xl bg-surface-container-high" />;
  }

  return (
    <div>
      <div className="relative">
        {badge ? <ProductBadge label={badge} className="absolute left-4 top-4 z-10" /> : null}
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="no-scrollbar flex aspect-square w-full snap-x snap-mandatory overflow-x-auto rounded-2xl bg-white md:rounded-3xl"
        >
          {images.map((img, i) => (
            <div key={img.url + i} className="relative w-full flex-none snap-center">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-contain p-8"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <div className="mt-4 flex justify-center gap-2 md:hidden">
            {images.map((img, i) => (
              <button
                key={img.url + i}
                onClick={() => goTo(i)}
                aria-label={`Show image ${i + 1}`}
                className={cn("h-2 rounded-full transition-all", i === active ? "w-6 bg-primary" : "w-2 bg-outline-variant")}
              />
            ))}
          </div>

          <div className="no-scrollbar mt-4 hidden gap-3 overflow-x-auto md:flex">
            {images.map((img, i) => (
              <button
                key={img.url + i}
                onClick={() => goTo(i)}
                className={cn(
                  "relative h-20 w-20 flex-none overflow-hidden rounded-xl border-2 bg-white",
                  i === active ? "border-primary" : "border-outline-variant",
                )}
              >
                <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-contain p-2" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
