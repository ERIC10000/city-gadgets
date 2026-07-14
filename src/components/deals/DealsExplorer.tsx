"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { PriceRangeSlider } from "@/components/deals/PriceRangeSlider";
import { formatKES } from "@/lib/format";
import type { Product } from "@/lib/types";

type CatOption = { slug: string; label: string };
type Sort = "best" | "discount" | "price-asc" | "price-desc";

const SORTS: { value: Sort; label: string }[] = [
  { value: "best", label: "Best Selling" },
  { value: "discount", label: "Biggest Discount" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function discountOf(p: Product) {
  return p.compare_at_price && p.compare_at_price > p.price
    ? (p.compare_at_price - p.price) / p.compare_at_price
    : 0;
}

export function DealsExplorer({ products, categories }: { products: Product[]; categories: CatOption[] }) {
  const bounds = useMemo(() => {
    const prices = products.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const brandOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand).filter((b): b is string => Boolean(b)))).sort(),
    [products],
  );

  const [cats, setCats] = useState<Set<string>>(new Set());
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [range, setRange] = useState<[number, number]>([bounds.min, bounds.max]);
  const [sort, setSort] = useState<Sort>("best");

  const activeCats = categories.filter((c) => cats.has(c.slug));

  function toggle(set: Set<string>, key: string, apply: (s: Set<string>) => void) {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    apply(next);
  }

  const filtered = useMemo(() => {
    let items = products.filter((p) => p.price >= range[0] && p.price <= range[1]);
    if (cats.size) items = items.filter((p) => cats.has(p.category_slug));
    if (brands.size) items = items.filter((p) => p.brand && brands.has(p.brand));
    switch (sort) {
      case "discount":
        items = [...items].sort((a, b) => discountOf(b) - discountOf(a));
        break;
      case "price-asc":
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      default:
        items = [...items].sort((a, b) => b.rating - a.rating);
    }
    return items;
  }, [products, range, cats, brands, sort]);

  const hasFilters = cats.size > 0 || brands.size > 0 || range[0] !== bounds.min || range[1] !== bounds.max;

  function clearAll() {
    setCats(new Set());
    setBrands(new Set());
    setRange([bounds.min, bounds.max]);
  }

  return (
    <div>
      {/* Category chips */}
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setCats(new Set())}
          className={`shrink-0 rounded-full border px-4 py-2 text-body-sm font-semibold transition-colors ${
            cats.size === 0 ? "border-on-surface bg-on-surface text-white" : "border-outline-variant bg-white text-on-surface hover:border-on-surface"
          }`}
        >
          All Deals
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => toggle(cats, c.slug, setCats)}
            className={`shrink-0 rounded-full border px-4 py-2 text-body-sm font-semibold transition-colors ${
              cats.has(c.slug) ? "border-on-surface bg-on-surface text-white" : "border-outline-variant bg-white text-on-surface hover:border-on-surface"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 space-y-6 lg:w-64">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-on-surface">Filters</h3>
            {hasFilters && (
              <button onClick={clearAll} className="text-body-sm font-semibold text-secondary hover:underline">
                Clear all
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-outline-variant p-4">
            <h4 className="mb-4 text-label-caps font-bold text-on-surface">Price Range</h4>
            <PriceRangeSlider min={bounds.min} max={bounds.max} value={range} onChange={setRange} />
          </div>

          <FilterGroup title="Category">
            {categories.map((c) => (
              <Check key={c.slug} label={c.label} checked={cats.has(c.slug)} onChange={() => toggle(cats, c.slug, setCats)} />
            ))}
          </FilterGroup>

          <FilterGroup title="Brand">
            {brandOptions.map((b) => (
              <Check key={b} label={b} checked={brands.has(b)} onChange={() => toggle(brands, b, setBrands)} />
            ))}
          </FilterGroup>
        </aside>

        {/* Grid */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-body-sm text-on-surface-variant">{filtered.length} deals</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-sm font-medium text-on-surface focus:border-on-surface focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {activeCats.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeCats.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => toggle(cats, c.slug, setCats)}
                  className="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1 text-badge-text font-semibold text-on-surface"
                >
                  {c.label}
                  <Icon name="close" className="text-[14px]" />
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <Fragment key={p.id}>
                {i === 8 && <PromoTile />}
                <ProductCard product={p} />
              </Fragment>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-20 text-center">
              <Icon name="sentiment_dissatisfied" className="text-4xl text-on-surface-variant" />
              <p className="font-semibold text-on-surface">No deals match your filters</p>
              <button onClick={clearAll} className="text-body-sm font-semibold text-secondary hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-outline-variant p-4">
      <h4 className="mb-3 text-label-caps font-bold text-on-surface">{title}</h4>
      <div className="no-scrollbar max-h-56 space-y-2 overflow-y-auto pr-1">{children}</div>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-body-sm text-on-surface">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-outline-variant text-on-surface accent-on-surface focus:ring-0"
      />
      {label}
    </label>
  );
}

function PromoTile() {
  return (
    <Link
      href="/category/consoles"
      className="mint-gradient group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 text-on-surface"
    >
      <div>
        <h4 className="text-lg font-extrabold leading-tight">Play more. Pay less.</h4>
        <p className="mt-1 text-body-sm text-on-surface/70">Score premium consoles for up to 70% vs new.</p>
      </div>
      <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-on-surface px-4 py-2 text-badge-text font-bold text-white transition-transform group-hover:scale-105">
        Shop Now <Icon name="arrow_forward" className="text-[14px]" />
      </span>
      <Icon name="sports_esports" className="absolute -bottom-3 -right-3 text-8xl text-white/30" />
    </Link>
  );
}
