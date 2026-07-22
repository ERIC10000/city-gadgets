"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export type GridGroup = { label: string; href: string; products: Product[] };

/**
 * Category-tabbed product grid. Replaces the old horizontal rail so the whole
 * catalog is visible at a glance rather than hidden behind a scrollbar.
 */
export function TabbedProductGrid({
  title,
  subtitle,
  groups,
  initialCount = 8,
}: {
  title: string;
  subtitle?: string;
  groups: GridGroup[];
  initialCount?: number;
}) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);

  if (groups.length === 0) return null;
  const group = groups[Math.min(active, groups.length - 1)];
  const shown = expanded ? group.products : group.products.slice(0, initialCount);
  const hidden = group.products.length - shown.length;

  return (
    <section className="bg-surface-off-white py-12">
      <div className="mx-auto w-full max-w-container-max px-margin-mobile md:px-gutter">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-on-surface md:text-2xl">{title}</h2>
            {subtitle && <p className="mt-0.5 text-body-sm text-on-surface-variant">{subtitle}</p>}
          </div>
          <Link
            href={group.href}
            className="flex items-center gap-1 text-body-sm font-semibold text-on-surface hover:text-secondary"
          >
            Browse {group.label} <Icon name="chevron_right" className="text-[18px]" />
          </Link>
        </div>

        {/* Category tabs with counts */}
        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
          {groups.map((g, i) => (
            <button
              key={g.label}
              onClick={() => {
                setActive(i);
                setExpanded(false);
              }}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-body-sm font-semibold transition-colors",
                i === active
                  ? "border-on-surface bg-on-surface text-white"
                  : "border-outline-variant bg-white text-on-surface hover:border-on-surface",
              )}
            >
              {g.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-badge-text font-bold",
                  i === active ? "bg-white/20 text-white" : "bg-surface-container text-on-surface-variant",
                )}
              >
                {g.products.length}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {hidden > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setExpanded(true)}
              className="flex items-center gap-1.5 rounded-full border border-on-surface px-6 py-3 text-body-sm font-bold text-on-surface transition-colors hover:bg-on-surface hover:text-white"
            >
              Show {hidden} more
              <Icon name="expand_more" className="text-[18px]" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
