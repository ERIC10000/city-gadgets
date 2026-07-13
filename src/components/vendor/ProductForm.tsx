"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Category, Product } from "@/lib/types";
import type { ProductFormResult } from "@/lib/actions/products";

type SpecRow = { key: string; value: string };

export function ProductForm({
  categories,
  product,
  action,
}: {
  categories: Category[];
  product?: Product;
  action: (formData: FormData) => Promise<ProductFormResult>;
}) {
  const [specs, setSpecs] = useState<SpecRow[]>(
    product ? Object.entries(product.specs).map(([key, value]) => ({ key, value })) : [{ key: "", value: "" }],
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  const inputClass =
    "w-full rounded-lg border border-outline-variant px-4 py-3 focus:border-primary focus:outline-none";

  return (
    <form action={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Product Name</label>
          <input name="name" required defaultValue={product?.name} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Slug (optional)</label>
          <input name="slug" defaultValue={product?.slug} placeholder="auto-generated from name" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Brand</label>
          <input name="brand" defaultValue={product?.brand ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Category</label>
          <select name="categoryId" defaultValue={product?.category_slug} className={inputClass}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Condition</label>
          <select name="condition" defaultValue={product?.condition ?? "new"} className={inputClass}>
            <option value="new">New</option>
            <option value="refurbished">Refurbished</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Price (KSh)</label>
          <input type="number" name="price" required defaultValue={product?.price} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Compare-at Price (optional)</label>
          <input type="number" name="compareAtPrice" defaultValue={product?.compare_at_price ?? ""} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Stock Quantity</label>
          <input type="number" name="stockQuantity" required defaultValue={product?.stock_quantity ?? 0} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Status</label>
          <select name="status" defaultValue={product?.status ?? "draft"} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Description</label>
        <textarea name="description" rows={4} defaultValue={product?.description ?? ""} className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">
          Image URLs (one per line)
        </label>
        <textarea
          name="imageUrls"
          rows={3}
          defaultValue={product?.images.map((i) => i.url).join("\n")}
          placeholder="https://images.unsplash.com/…"
          className={inputClass}
        />
        <p className="mt-1 text-body-sm text-on-surface-variant">
          Paste hosted image URLs, or upload files to your Supabase{" "}
          <code className="rounded bg-surface-container-highest px-1 py-0.5 text-badge-text">media</code> bucket and
          paste the public URLs here.
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-body-sm font-semibold text-on-surface-variant">Specifications</label>
          <button
            type="button"
            onClick={() => setSpecs([...specs, { key: "", value: "" }])}
            className="flex items-center gap-1 text-body-sm font-bold text-primary hover:underline"
          >
            <Icon name="add" className="text-[18px]" />
            Add Spec
          </button>
        </div>
        <div className="space-y-2">
          {specs.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input
                name="specKey"
                value={spec.key}
                onChange={(e) => setSpecs(specs.map((s, j) => (j === i ? { ...s, key: e.target.value } : s)))}
                placeholder="e.g. Storage"
                className="w-1/3 rounded-lg border border-outline-variant px-3 py-2 text-body-sm focus:border-primary focus:outline-none"
              />
              <input
                name="specValue"
                value={spec.value}
                onChange={(e) => setSpecs(specs.map((s, j) => (j === i ? { ...s, value: e.target.value } : s)))}
                placeholder="e.g. 2TB"
                className="flex-1 rounded-lg border border-outline-variant px-3 py-2 text-body-sm focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSpecs(specs.filter((_, j) => j !== i))}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error"
                aria-label="Remove spec"
              >
                <Icon name="close" className="text-[18px]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-body-sm font-semibold text-error">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-primary px-8 py-3 font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : product ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
