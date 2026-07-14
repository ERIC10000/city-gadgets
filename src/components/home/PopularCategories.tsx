"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export type CategoryCircle = { slug: string; label: string; image: string };

export function PopularCategories({ items }: { items: CategoryCircle[] }) {
  return (
    <section className="mx-auto w-full max-w-container-max px-margin-mobile py-12 md:px-gutter">
      <h2 className="mb-8 text-xl font-extrabold text-on-surface md:text-2xl">Popular Categories</h2>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-7 md:gap-6 md:overflow-visible">
        {items.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 7) * 0.04, duration: 0.35 }}
          >
            <Link href={`/category/${c.slug}`} className="group flex w-24 shrink-0 flex-col items-center gap-3 md:w-auto">
              <div className="relative flex aspect-square w-24 items-center justify-center overflow-hidden rounded-full bg-surface-container-high transition-transform duration-300 group-hover:scale-105 md:w-full">
                <Image src={c.image} alt={c.label} fill sizes="120px" className="object-contain p-4" />
              </div>
              <span className="text-center text-body-sm font-medium text-on-surface group-hover:text-secondary">
                {c.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
