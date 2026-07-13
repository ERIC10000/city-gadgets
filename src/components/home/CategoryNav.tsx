"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import type { Category } from "@/lib/types";

const SHORT_LABEL: Record<string, string> = {
  consoles: "Consoles",
  phones: "Phones",
  "gaming-accessories": "Accessories",
  audio: "Audio",
  cameras: "Cameras",
  wearables: "Wearables",
  macbooks: "MacBooks",
  tablets: "Tablets",
  streaming: "Streaming",
  accessories: "Tech Bits",
};

// Homepage icon row order — leads with the highest-traffic categories
// regardless of their catalog sort_order.
const DISPLAY_ORDER = [
  "phones",
  "consoles",
  "gaming-accessories",
  "audio",
  "cameras",
  "wearables",
  "macbooks",
  "tablets",
  "streaming",
  "accessories",
];

export function CategoryNav({ categories }: { categories: Category[] }) {
  const ordered = [...categories].sort((a, b) => DISPLAY_ORDER.indexOf(a.slug) - DISPLAY_ORDER.indexOf(b.slug));

  return (
    <section className="border-b border-outline-variant bg-surface-container-lowest py-8">
      <div className="mx-auto w-full max-w-container-max px-margin-mobile md:px-gutter">
        <div className="no-scrollbar flex items-center gap-6 overflow-x-auto md:justify-center md:gap-12">
          {ordered.map((category, i) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: "easeOut" }}
            >
              <Link href={`/category/${category.slug}`} className="group flex min-w-[80px] flex-col items-center gap-2">
                <motion.div
                  whileHover={{ y: -4, scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 350, damping: 18 }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container-high text-on-surface-variant shadow-sm transition-colors group-hover:bg-primary-container group-hover:text-on-primary-container"
                >
                  <Icon name={category.icon} className="text-3xl" />
                </motion.div>
                <span className="text-center text-label-caps text-on-surface-variant transition-colors group-hover:text-primary">
                  {SHORT_LABEL[category.slug] ?? category.name.split(" ")[0]}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
