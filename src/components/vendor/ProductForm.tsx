"use client";

import { useMemo, useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";
import type { ProductFormResult } from "@/lib/actions/products";

type SpecRow = { key: string; value: string };

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-outline-variant bg-white p-6">
      <div className="mb-5">
        <h3 className="font-bold text-on-surface">{title}</h3>
        {sub && <p className="mt-0.5 text-body-sm text-on-surface-variant">{sub}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-body-sm font-semibold text-on-surface">{label}</label>
      {children}
      {hint && <p className="mt-1 text-badge-text text-on-surface-variant">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-on-surface focus:outline-none";

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
  const [imageUrls, setImageUrls] = useState(product?.images.map((i) => i.url).join("\n") ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const previews = useMemo(
    () =>
      imageUrls
        .split("\n")
        .map((u) => u.trim())
        .filter((u) => /^https?:\/\//.test(u))
        .slice(0, 8),
    [imageUrls],
  );

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit}>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card title="Product details" sub="Name, brand and where this product lives in the catalog.">
            <div className="space-y-4">
              <Field label="Product name">
                <input name="name" required defaultValue={product?.name} placeholder="e.g. PS5 Pro 2TB" className={inputClass} />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Brand">
                  <input name="brand" defaultValue={product?.brand ?? ""} placeholder="e.g. Sony PlayStation" className={inputClass} />
                </Field>
                <Field label="Category">
                  <select name="categoryId" defaultValue={product?.category_slug} className={inputClass}>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Condition">
                  <select name="condition" defaultValue={product?.condition ?? "new"} className={inputClass}>
                    <option value="new">New</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </Field>
                <Field label="Slug" hint="Optional — auto-generated from the name if left blank.">
                  <input name="slug" defaultValue={product?.slug} placeholder="auto-generated" className={inputClass} />
                </Field>
              </div>
            </div>
          </Card>

          <Card title="Pricing & inventory" sub="A compare-at price above the price shows a discount badge on the storefront.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Price (KSh)">
                <input type="number" name="price" required min={0} defaultValue={product?.price} placeholder="0" className={inputClass} />
              </Field>
              <Field label="Compare-at price">
                <input
                  type="number"
                  name="compareAtPrice"
                  min={0}
                  defaultValue={product?.compare_at_price ?? ""}
                  placeholder="Optional"
                  className={inputClass}
                />
              </Field>
              <Field label="Stock quantity">
                <input
                  type="number"
                  name="stockQuantity"
                  required
                  min={0}
                  defaultValue={product?.stock_quantity ?? 0}
                  className={inputClass}
                />
              </Field>
            </div>
          </Card>

          <Card title="Description">
            <textarea
              name="description"
              rows={5}
              defaultValue={product?.description ?? ""}
              placeholder="What makes this product worth buying? Warranty, contents of the box, key features…"
              className={inputClass}
            />
          </Card>

          <Card title="Media" sub="Paste hosted image URLs, one per line — previews appear instantly.">
            <textarea
              name="imageUrls"
              rows={3}
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              placeholder={"https://images.unsplash.com/…\nhttps://…/photo-2.jpg"}
              className={cn(inputClass, "font-mono text-badge-text leading-relaxed")}
            />
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                {previews.map((url, i) => (
                  <div
                    key={url + i}
                    className="relative aspect-square overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Image ${i + 1}`}
                      className="h-full w-full object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-on-surface px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 flex items-center gap-1.5 text-badge-text text-on-surface-variant">
              <Icon name="cloud_upload" className="text-[14px]" />
              Tip: upload files to your Supabase <code className="rounded bg-surface-container px-1 py-0.5">media</code> bucket and paste the public URLs here.
            </p>
          </Card>

          <Card title="Specifications" sub="Shown as the spec grid on the product page.">
            <div className="space-y-2.5">
              {specs.map((spec, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    name="specKey"
                    value={spec.key}
                    onChange={(e) => setSpecs(specs.map((s, j) => (j === i ? { ...s, key: e.target.value } : s)))}
                    placeholder="e.g. Storage"
                    className={cn(inputClass, "w-1/3")}
                  />
                  <input
                    name="specValue"
                    value={spec.value}
                    onChange={(e) => setSpecs(specs.map((s, j) => (j === i ? { ...s, value: e.target.value } : s)))}
                    placeholder="e.g. 2TB NVMe SSD"
                    className={cn(inputClass, "flex-1")}
                  />
                  <button
                    type="button"
                    onClick={() => setSpecs(specs.filter((_, j) => j !== i))}
                    aria-label="Remove spec"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant transition-colors hover:border-error hover:bg-error-container hover:text-error"
                  >
                    <Icon name="close" className="text-[18px]" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSpecs([...specs, { key: "", value: "" }])}
                className="flex items-center gap-1.5 rounded-full border border-dashed border-outline px-4 py-2 text-body-sm font-semibold text-on-surface-variant transition-colors hover:border-on-surface hover:text-on-surface"
              >
                <Icon name="add" className="text-[18px]" />
                Add specification
              </button>
            </div>
          </Card>
        </div>

        {/* Publish rail */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <section className="rounded-2xl border border-outline-variant bg-white p-6">
            <h3 className="mb-4 font-bold text-on-surface">Publish</h3>
            <Field label="Status" hint="Drafts are hidden from the storefront until published.">
              <select name="status" defaultValue={product?.status ?? "draft"} className={inputClass}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>

            {error && (
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-error-container p-3 text-body-sm font-semibold text-on-error-container">
                <Icon name="error" className="mt-0.5 text-[16px]" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending ? (
                <>
                  <Icon name="progress_activity" className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Icon name={product ? "save" : "add_circle"} />
                  {product ? "Update Product" : "Create Product"}
                </>
              )}
            </button>
          </section>

          <section className="rounded-2xl bg-inverse-surface p-6 text-white">
            <h4 className="mb-3 flex items-center gap-2 font-bold text-primary-container">
              <Icon name="tips_and_updates" className="text-[18px]" />
              Listing tips
            </h4>
            <ul className="space-y-2 text-body-sm text-white/70">
              <li>• Lead the name with the brand — "Sony Xm6 Headphones".</li>
              <li>• Set a compare-at price to appear on the Hot Deals page.</li>
              <li>• Square photos on white backgrounds convert best.</li>
            </ul>
          </section>
        </div>
      </div>
    </form>
  );
}
