"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { formatKES } from "@/lib/format";

export function FilterSidebar({
  brands,
  priceBounds,
}: {
  brands: string[];
  priceBounds: { min: number; max: number };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const selectedBrands = searchParams.getAll("brand");
  const [minPrice, setMinPrice] = useState(searchParams.get("min") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") ?? "");
  const [brandQuery, setBrandQuery] = useState("");

  const visibleBrands = brandQuery
    ? brands.filter((b) => b.toLowerCase().includes(brandQuery.toLowerCase()))
    : brands;

  function pushParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function toggleBrand(brand: string) {
    pushParams((params) => {
      const current = params.getAll("brand");
      params.delete("brand");
      if (current.includes(brand)) {
        current.filter((b) => b !== brand).forEach((b) => params.append("brand", b));
      } else {
        [...current, brand].forEach((b) => params.append("brand", b));
      }
    });
  }

  function applyPriceRange() {
    pushParams((params) => {
      if (minPrice) params.set("min", minPrice);
      else params.delete("min");
      if (maxPrice) params.set("max", maxPrice);
      else params.delete("max");
    });
  }

  function clearAll() {
    setMinPrice("");
    setMaxPrice("");
    router.push(pathname);
  }

  const hasFilters = selectedBrands.length > 0 || searchParams.has("min") || searchParams.has("max");

  return (
    <aside className="w-full shrink-0 space-y-8 lg:w-64">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-on-surface">Filters</h3>
        {hasFilters && (
          <button onClick={clearAll} className="text-body-sm font-semibold text-primary hover:underline">
            Clear all
          </button>
        )}
      </div>

      {brands.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h4 className="text-label-caps font-bold text-on-surface-variant">Brand</h4>
            <span className="text-badge-text text-on-surface-variant">{brands.length}</span>
          </div>
          {brands.length > 8 && (
            <input
              type="search"
              value={brandQuery}
              onChange={(e) => setBrandQuery(e.target.value)}
              placeholder="Search brand…"
              className="w-full rounded-lg border border-outline-variant px-3 py-2 text-body-sm focus:border-on-surface focus:outline-none"
            />
          )}
          <div className="scrollbar-thin max-h-64 space-y-2 overflow-y-auto pr-1">
            {visibleBrands.map((brand) => (
              <label key={brand} className="flex cursor-pointer items-center gap-3 text-body-sm text-on-surface">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-4 w-4 rounded border-outline-variant text-on-surface accent-on-surface focus:ring-0"
                />
                {brand}
              </label>
            ))}
            {visibleBrands.length === 0 && (
              <p className="text-body-sm text-on-surface-variant">No brands match “{brandQuery}”.</p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-label-caps font-bold text-on-surface-variant">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={String(priceBounds.min)}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={applyPriceRange}
            className="w-full rounded-lg border border-outline-variant px-3 py-2 text-body-sm focus:border-primary focus:outline-none"
          />
          <span className="text-on-surface-variant">–</span>
          <input
            type="number"
            placeholder={String(priceBounds.max)}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={applyPriceRange}
            className="w-full rounded-lg border border-outline-variant px-3 py-2 text-body-sm focus:border-primary focus:outline-none"
          />
        </div>
        <p className="text-body-sm text-on-surface-variant">
          {formatKES(priceBounds.min)} – {formatKES(priceBounds.max)}
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-2xl bg-inverse-surface p-6 text-white lg:block">
        <Icon name="support_agent" className="mb-3 text-3xl text-primary-fixed" />
        <h4 className="font-bold">Need help choosing?</h4>
        <p className="mt-1 text-body-sm text-inverse-on-surface/70">Chat with our team on WhatsApp for expert advice.</p>
      </div>
    </aside>
  );
}
