"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

/** Devices we repair — verified imagery, swipeable card carousel. */
const DEVICES = [
  {
    label: "Phones",
    icon: "smartphone",
    repairs: "Screens · Batteries · Charging ports",
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "Laptops",
    icon: "laptop_mac",
    repairs: "Screens · Keyboards · Batteries · Hinges",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "Tablets & iPads",
    icon: "tablet_mac",
    repairs: "Screens · Batteries · Charging ports",
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "Gaming Consoles",
    icon: "sports_esports",
    repairs: "HDMI · Overheating · No power · Fans",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "Gaming Controllers",
    icon: "stadia_controller",
    repairs: "Stick drift · Buttons · Triggers · Charging",
    image: "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "Smartwatches",
    icon: "watch",
    repairs: "Screens · Batteries · Straps",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "TV & Monitor Screens",
    icon: "tv",
    repairs: "Cracked panels · Backlight · No display",
    image: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "Audio Devices",
    icon: "headphones",
    repairs: "Speakers · Jacks · Charging · Pairing",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80&auto=format&fit=crop",
  },
];

export function RepairCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(true);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    setCanScrollBack(track.scrollLeft > 2);
    setCanScrollForward(track.scrollLeft < maxScrollLeft - 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const frame = requestAnimationFrame(updateControls);
    const observer = new ResizeObserver(updateControls);
    observer.observe(track);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [updateControls]);

  function scroll(dir: 1 | -1) {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("[data-repair-card]");
    if (!track || !card) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  }

  return (
    <section className="mt-10" aria-labelledby="repair-categories-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 id="repair-categories-title" className="text-2xl font-extrabold text-on-surface md:text-headline-lg">
            Gadgets we repair
          </h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Phones, laptops, consoles and more, repaired with genuine parts.
          </p>
        </div>
        <div className="hidden shrink-0 gap-2 md:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous repair categories"
            aria-controls="repair-category-track"
            disabled={!canScrollBack}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-35"
          >
            <Icon name="chevron_left" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next repair categories"
            aria-controls="repair-category-track"
            disabled={!canScrollForward}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface transition-colors hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-35"
          >
            <Icon name="chevron_right" />
          </button>
        </div>
      </div>

      <div
        id="repair-category-track"
        ref={trackRef}
        onScroll={updateControls}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          scroll(event.key === "ArrowRight" ? 1 : -1);
        }}
        tabIndex={0}
        aria-label="Repair categories carousel"
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {DEVICES.map((d) => (
          <article
            key={d.label}
            data-repair-card
            className="group w-[220px] shrink-0 snap-start overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-card transition-shadow hover:shadow-lg sm:w-[248px]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
              <Image
                src={d.image}
                alt=""
                fill
                sizes="248px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
                <Icon name={d.icon} filled className="text-[18px]" />
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-on-surface">{d.label}</h3>
              <p className="mt-1 text-badge-text text-on-surface-variant">{d.repairs}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
