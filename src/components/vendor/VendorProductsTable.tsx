"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatKES } from "@/lib/format";
import { deleteProduct, toggleProductStatus } from "@/lib/actions/products";
import type { Product } from "@/lib/types";

export function VendorProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand?.toLowerCase().includes(q) ?? false) ||
        p.category_slug.toLowerCase().includes(q),
    );
  }, [products, query]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-md">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products by name, brand or category…"
          aria-label="Search products"
          className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface-container-lowest py-16 text-center shadow-card">
          <Icon name="search_off" className="text-4xl text-on-surface-variant" />
          <p className="font-bold text-on-surface">No products match “{query}”</p>
          <p className="text-body-sm text-on-surface-variant">Try a different name, brand or category.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-card">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant text-body-sm text-on-surface-variant">
              <tr>
                <th className="px-5 py-4 font-semibold">Product</th>
                <th className="px-5 py-4 font-semibold">Price</th>
                <th className="px-5 py-4 font-semibold">Stock</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 flex-none overflow-hidden rounded-lg bg-white">
                        {product.images[0] && (
                          <Image src={product.images[0].url} alt={product.name} fill sizes="48px" className="object-contain p-1" />
                        )}
                      </div>
                      <span className="line-clamp-1 font-semibold text-on-surface">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-on-surface">{formatKES(product.price)}</td>
                  <td className="px-5 py-4 text-on-surface-variant">{product.stock_quantity}</td>
                  <td className="px-5 py-4">
                    {product.status === "published" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2.5 py-1 text-badge-text font-bold text-on-secondary-container">
                        <Icon name="visibility" className="text-[13px]" />
                        Live in store
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-price-gold/15 px-2.5 py-1 text-badge-text font-bold text-price-gold">
                        <Icon name="visibility_off" className="text-[13px]" />
                        Draft — hidden
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <form action={toggleProductStatus}>
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="status" value={product.status} />
                        <button
                          type="submit"
                          title={product.status === "published" ? "Unpublish" : "Publish"}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                        >
                          <Icon name={product.status === "published" ? "visibility_off" : "visibility"} className="text-[20px]" />
                        </button>
                      </form>
                      <Link
                        href={`/vendor/products/${product.id}`}
                        title="Edit"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                      >
                        <Icon name="edit" className="text-[20px]" />
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <button
                          type="submit"
                          title="Delete"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error"
                        >
                          <Icon name="delete" className="text-[20px]" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
