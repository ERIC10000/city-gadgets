"use client";

import { useMemo, useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { ImageUploader } from "@/components/vendor/ImageUploader";
import { SPEC_TEMPLATES } from "@/lib/spec-templates";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";
import type { ProductFormResult } from "@/lib/actions/products";

type SpecRow = { key: string; value: string };

const STEPS = [
  { id: 0, icon: "info", label: "Overview" },
  { id: 1, icon: "add_photo_alternate", label: "Media" },
  { id: 2, icon: "sell", label: "Pricing & Specs" },
  { id: 3, icon: "rocket_launch", label: "Publish" },
] as const;

const inputClass =
  "w-full rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-on-surface focus:outline-none";

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

export function ProductForm({
  categories,
  product,
  action,
}: {
  categories: Category[];
  product?: Product;
  action: (formData: FormData) => Promise<ProductFormResult>;
}) {
  const [step, setStep] = useState(0);
  const [specs, setSpecs] = useState<SpecRow[]>(
    product ? Object.entries(product.specs).map(([key, value]) => ({ key, value })) : [{ key: "", value: "" }],
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Mirrored state for validation + the live preview card.
  const [name, setName] = useState(product?.name ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [price, setPrice] = useState(product?.price ? String(product.price) : "");
  const [compareAt, setCompareAt] = useState(product?.compare_at_price ? String(product.compare_at_price) : "");
  // The select posts category IDs; an edited product arrives with its slug, so
  // map it back to the matching id (falls back to the raw value for seed data
  // where id === slug).
  const [categoryId, setCategoryId] = useState(() => {
    if (!product) return categories[0]?.id ?? "";
    const match = categories.find((c) => c.slug === product.category_slug || c.id === product.category_slug);
    return match?.id ?? categories[0]?.id ?? "";
  });
  // New listings default to Published — "upload but invisible" was the #1
  // vendor confusion; drafts are now an explicit opt-in.
  const [status, setStatus] = useState(product?.status ?? "published");
  const [coverUrl, setCoverUrl] = useState(product?.images[0]?.url ?? "");

  const activeCategory = categories.find((c) => c.id === categoryId || c.slug === categoryId);
  const suggestedSpecs = SPEC_TEMPLATES[activeCategory?.slug ?? ""] ?? [];
  const missingSuggestions = suggestedSpecs.filter((k) => !specs.some((s) => s.key.toLowerCase() === k.toLowerCase()));

  const priceNum = Number(price) || 0;
  const compareNum = Number(compareAt) || 0;
  const discountPct = compareNum > priceNum && priceNum > 0 ? Math.round(((compareNum - priceNum) / compareNum) * 100) : 0;

  function applySuggestions() {
    const empty = specs.filter((s) => !s.key && !s.value);
    const kept = specs.filter((s) => s.key || s.value);
    void empty;
    setSpecs([...kept, ...missingSuggestions.map((key) => ({ key, value: "" }))]);
  }

  function validate(): { ok: boolean; step?: number; message?: string } {
    if (!name.trim()) return { ok: false, step: 0, message: "Give the product a name before publishing." };
    if (!priceNum || priceNum <= 0) return { ok: false, step: 2, message: "Set a selling price greater than zero." };
    if (compareNum > 0 && compareNum <= priceNum)
      return { ok: false, step: 2, message: "Compare-at price should be higher than the selling price." };
    return { ok: true };
  }

  function handleSubmit(formData: FormData) {
    const v = validate();
    if (!v.ok) {
      setStep(v.step ?? 0);
      setError(v.message ?? "Please complete the required fields.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  const previewImage = useMemo(() => (/^https?:\/\//.test(coverUrl) ? coverUrl : null), [coverUrl]);

  return (
    <form action={handleSubmit}>
      {/* Stepper */}
      <div className="no-scrollbar mb-6 flex items-center gap-2 overflow-x-auto rounded-2xl border border-outline-variant bg-white p-3">
        {STEPS.map((s, i) => {
          const state = step === s.id ? "active" : step > s.id ? "done" : "todo";
          return (
            <div key={s.id} className="flex shrink-0 items-center gap-2">
              {i > 0 && <span className={cn("h-px w-6 md:w-10", step >= s.id ? "bg-on-surface" : "bg-outline-variant")} />}
              <button
                type="button"
                onClick={() => setStep(s.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 transition-colors",
                  state === "active" && "bg-on-surface text-white",
                  state === "done" && "text-on-surface hover:bg-surface-container",
                  state === "todo" && "text-on-surface-variant hover:bg-surface-container",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg border",
                    state === "active" ? "border-white/30 bg-white/10" : "border-outline-variant bg-white",
                  )}
                >
                  <Icon name={state === "done" ? "check" : s.icon} className={cn("text-[16px]", state === "done" && "text-secondary")} />
                </span>
                <span className="whitespace-nowrap text-body-sm font-bold">
                  <span className="mr-1 text-badge-text font-semibold uppercase opacity-60">Step {i + 1}</span>
                  {s.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Main column — every step stays mounted so the final submit posts the full form */}
        <div className="space-y-6 lg:col-span-2">
          {/* STEP 1 — Overview */}
          <div className={cn(step !== 0 && "hidden", "space-y-6")}>
            <Card title="Product details" sub="Name, brand and where this product lives in the catalog.">
              <div className="space-y-4">
                <Field label="Product name *">
                  <input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Samsung Galaxy S26 Ultra 256GB"
                    className={inputClass}
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Brand">
                    <input
                      name="brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Samsung"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Category" hint="Suggested spec fields follow the category you pick.">
                    <select name="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
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

            <Card title="Description">
              <textarea
                name="description"
                rows={5}
                defaultValue={product?.description ?? ""}
                placeholder="What makes this product worth buying? Warranty, box contents, key features…"
                className={inputClass}
              />
            </Card>
          </div>

          {/* STEP 2 — Media */}
          <div className={cn(step !== 1 && "hidden")}>
            <Card title="Product images" sub="The first image is the cover shown on cards and search results.">
              <ImageUploader
                initialUrls={product?.images.map((i) => i.url) ?? []}
                onChange={(next) => setCoverUrl(next[0] ?? "")}
              />
            </Card>
          </div>

          {/* STEP 3 — Pricing & Specs */}
          <div className={cn(step !== 2 && "hidden", "space-y-6")}>
            <Card title="Pricing & inventory" sub="A compare-at price above the selling price shows a discount badge and lists the item on Hot Deals.">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Price (KSh) *">
                  <input
                    type="number"
                    name="price"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </Field>
                <Field label="Compare-at price">
                  <input
                    type="number"
                    name="compareAtPrice"
                    min={0}
                    value={compareAt}
                    onChange={(e) => setCompareAt(e.target.value)}
                    placeholder="Optional"
                    className={inputClass}
                  />
                </Field>
                <Field label="Stock quantity">
                  <input type="number" name="stockQuantity" min={0} defaultValue={product?.stock_quantity ?? 0} className={inputClass} />
                </Field>
              </div>
              {discountPct > 0 && (
                <p className="mt-3 flex items-center gap-1.5 text-body-sm font-semibold text-secondary">
                  <Icon name="local_offer" className="text-[16px]" />
                  Shoppers will see a −{discountPct}% badge on this product.
                </p>
              )}
            </Card>

            <Card title="Specifications" sub={activeCategory ? `Suggested fields for ${activeCategory.name}.` : "Shown as the spec grid on the product page."}>
              {missingSuggestions.length > 0 && (
                <button
                  type="button"
                  onClick={applySuggestions}
                  className="mb-4 flex items-center gap-1.5 rounded-full bg-surface-container-high px-4 py-2 text-body-sm font-bold text-on-primary-container transition-transform hover:scale-[1.02]"
                >
                  <Icon name="auto_awesome" className="text-[16px]" />
                  Add {activeCategory?.name ?? "category"} fields: {missingSuggestions.join(", ")}
                </button>
              )}
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
                      placeholder="e.g. 256GB"
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

          {/* STEP 4 — Publish */}
          <div className={cn(step !== 3 && "hidden")}>
            <Card title="Review & publish" sub="One last look before this goes live on the storefront.">
              <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {[
                  ["Name", name || "—"],
                  ["Brand", brand || "—"],
                  ["Category", activeCategory?.name ?? "—"],
                  ["Price", priceNum ? formatKES(priceNum) : "—"],
                  ["Compare-at", compareNum ? formatKES(compareNum) : "—"],
                  ["Specs", specs.filter((s) => s.key && s.value).length + " filled"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-outline-variant/50 pb-2">
                    <dt className="text-body-sm text-on-surface-variant">{k}</dt>
                    <dd className="text-right text-body-sm font-bold text-on-surface">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6">
                <input type="hidden" name="status" value={status} />
                <p className="mb-2 text-body-sm font-semibold text-on-surface">Visibility</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setStatus("published")}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors",
                      status === "published" ? "border-secondary bg-secondary-container/40" : "border-outline-variant hover:border-on-surface/40",
                    )}
                  >
                    <p className="flex items-center gap-1.5 text-body-sm font-bold text-on-surface">
                      <Icon name="visibility" className="text-[16px] text-secondary" />
                      Published
                    </p>
                    <p className="mt-0.5 text-badge-text text-on-surface-variant">Live in the store the moment you save.</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("draft")}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors",
                      status === "draft" ? "border-on-surface bg-surface-container" : "border-outline-variant hover:border-on-surface/40",
                    )}
                  >
                    <p className="flex items-center gap-1.5 text-body-sm font-bold text-on-surface">
                      <Icon name="visibility_off" className="text-[16px]" />
                      Draft
                    </p>
                    <p className="mt-0.5 text-badge-text text-on-surface-variant">Hidden from shoppers until you publish it.</p>
                  </button>
                </div>
                {status === "draft" && (
                  <p className="mt-3 flex items-start gap-2 rounded-xl border border-price-gold/40 bg-price-gold/10 p-3 text-body-sm font-semibold text-on-surface">
                    <Icon name="warning" filled className="mt-0.5 text-[16px] text-price-gold" />
                    This product will NOT appear in the store until you publish it from the Products list.
                  </p>
                )}
              </div>
            </Card>
          </div>

          {error && (
            <p className="flex items-start gap-2 rounded-xl bg-error-container p-3 text-body-sm font-semibold text-on-error-container">
              <Icon name="error" className="mt-0.5 text-[16px]" />
              {error}
            </p>
          )}

          {/* Step navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1.5 rounded-xl border border-outline-variant bg-white px-5 py-2.5 text-body-sm font-bold text-on-surface transition-colors hover:border-on-surface disabled:opacity-40"
            >
              <Icon name="arrow_back" className="text-[18px]" />
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="flex items-center gap-1.5 rounded-xl bg-on-surface px-6 py-2.5 text-body-sm font-bold text-white hover:opacity-90"
              >
                Continue
                <Icon name="arrow_forward" className="text-[18px]" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={pending}
                className="flex items-center gap-2 rounded-xl bg-primary px-8 py-2.5 text-body-sm font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {pending ? (
                  <>
                    <Icon name="progress_activity" className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Icon name={product ? "save" : "rocket_launch"} />
                    {product ? "Update Product" : "Create Product"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Live preview rail */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <section className="overflow-hidden rounded-2xl border border-outline-variant bg-white">
            <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3">
              <h3 className="text-body-sm font-bold text-on-surface">Live preview</h3>
              <span className="text-badge-text text-on-surface-variant">Storefront card</span>
            </div>
            <div className="p-5">
              <div className="rounded-2xl border border-outline-variant p-4">
                <div className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-surface-container-low">
                  {previewImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewImage} alt="Cover preview" className="h-full w-full object-contain p-3" />
                  ) : (
                    <span className="flex flex-col items-center gap-1 text-on-surface-variant">
                      <Icon name="image" className="text-3xl" />
                      <span className="text-badge-text">Cover image appears here</span>
                    </span>
                  )}
                </div>
                <p className="line-clamp-2 min-h-[2.5rem] text-body-sm font-medium text-on-surface">
                  {name || "Product name…"}
                </p>
                {discountPct > 0 && (
                  <p className="mt-1 text-badge-text text-on-surface-variant">
                    new <span className="line-through">{formatKES(compareNum)}</span>
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold text-on-surface">{priceNum ? formatKES(priceNum) : "KSh —"}</span>
                  {discountPct > 0 && (
                    <span className="rounded bg-discount-bg px-1.5 py-0.5 text-badge-text font-bold text-discount">
                      -{discountPct}%
                    </span>
                  )}
                </div>
                <p className="mt-1 text-badge-text text-on-surface-variant">{activeCategory?.name ?? ""}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-inverse-surface p-6 text-white">
            <h4 className="mb-3 flex items-center gap-2 font-bold text-primary-container">
              <Icon name="tips_and_updates" className="text-[18px]" />
              Listing tips
            </h4>
            <ul className="space-y-2 text-body-sm text-white/70">
              <li>• Lead the name with the brand — "Sony Xm6 Headphones".</li>
              <li>• Square photos on white backgrounds convert best.</li>
              <li>• Set a compare-at price to appear on Hot Deals.</li>
            </ul>
          </section>
        </div>
      </div>
    </form>
  );
}

