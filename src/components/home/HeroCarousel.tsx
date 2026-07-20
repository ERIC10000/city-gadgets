"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export type HeroSlide = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  href: string;
  cta: string;
  images: string[];
};

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  if (count === 0) return null;
  const slide = slides[index % count];

  return (
    <section className="mx-auto w-full max-w-container-max px-margin-mobile pt-4 md:px-gutter">
      <div className="hero-gradient relative overflow-hidden rounded-3xl">
        <div className="grid grid-cols-1 items-center gap-6 px-8 py-10 md:grid-cols-2 md:px-14 md:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${index}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 max-w-md"
            >
              {slide.eyebrow && (
                <span className="mb-3 inline-block rounded-full bg-white/40 px-3 py-1 text-badge-text font-bold uppercase tracking-wide text-on-surface">
                  {slide.eyebrow}
                </span>
              )}
              <h1 className="text-3xl font-extrabold leading-tight text-on-surface md:text-5xl">{slide.title}</h1>
              <p className="mt-4 max-w-sm text-body-md text-on-surface/70">{slide.subtitle}</p>
              <Link
                href={slide.href}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-on-surface px-7 py-3.5 text-body-sm font-bold text-white transition-transform hover:scale-[1.03]"
              >
                {slide.cta}
              </Link>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${index}`}
              initial={{ opacity: 0, scale: 0.92, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.92, x: -30 }}
              transition={{ duration: 0.5 }}
              className="relative flex h-48 items-end justify-center gap-3 md:h-72"
            >
              {slide.images.slice(0, 3).map((src, i) => (
                <div
                  key={src}
                  className="relative h-40 w-28 overflow-hidden rounded-2xl bg-white/30 shadow-card-lg backdrop-blur-sm md:h-64 md:w-44"
                  style={{ transform: `translateY(${i === 1 ? -18 : 0}px) rotate(${(i - 1) * 5}deg)`, zIndex: i === 1 ? 2 : 1 }}
                >
                  <Image src={src} alt="" fill sizes="176px" className="object-contain p-3" priority={index === 0} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:left-14 md:translate-x-0">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-on-surface" : "w-2 bg-on-surface/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
