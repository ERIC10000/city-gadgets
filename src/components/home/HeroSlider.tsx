"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { formatKES } from "@/lib/format";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function HeroSlider({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);
  const slides = products.slice(0, 4);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const product = slides[index];

  return (
    <section className="relative w-full overflow-hidden bg-surface-off-white">
      <div className="mx-auto flex w-full max-w-container-max flex-col items-center gap-12 px-margin-mobile py-12 md:flex-row md:px-gutter md:py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-1 flex-col gap-6"
          >
            <span className="inline-block w-fit rounded-full bg-primary-container px-3 py-1 text-label-caps font-bold text-on-primary-container">
              {product.badge ?? "FEATURED"}
            </span>
            <h1 className="font-display-lg text-4xl leading-tight text-on-surface md:text-display-lg">
              Experience the Power of <span className="text-primary">{product.name}</span>
            </h1>
            <p className="max-w-lg text-body-md text-on-surface-variant">{product.description}</p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <span className="text-price-display font-extrabold text-primary">{formatKES(product.price)}</span>
              <Link
                href={`/product/${product.slug}`}
                className="flex h-12 items-center gap-2 rounded-xl bg-primary px-8 font-bold text-on-primary transition-all hover:shadow-card-lg"
              >
                Buy Now
                <Icon name="arrow_forward" />
              </Link>
              <Link
                href={`/product/${product.slug}`}
                className="flex h-12 items-center rounded-xl bg-surface-container-highest px-8 font-bold text-on-surface transition-all hover:bg-surface-dim"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="relative h-64 w-full flex-1 md:h-96">
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative h-full w-full"
            >
              {product.images[0] ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="rounded-3xl object-cover drop-shadow-2xl"
                  priority
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="mb-6 flex items-center justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={cn("h-2 rounded-full transition-all", i === index ? "w-6 bg-primary" : "w-2 bg-outline-variant")}
            />
          ))}
        </div>
      )}
    </section>
  );
}
