"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import type { Category } from "@/lib/types";

export function AllItemsMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href="/shop"
        className="flex items-center gap-2 py-3 text-body-sm font-semibold text-on-surface transition-colors hover:text-secondary"
      >
        <Icon name="menu" className="text-[20px]" />
        All Items
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 top-full z-50 w-64 overflow-hidden rounded-2xl border border-outline-variant bg-white p-2 shadow-card-lg"
          >
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-high text-on-primary-container">
                  <Icon name={c.icon} className="text-[18px]" />
                </span>
                {c.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
