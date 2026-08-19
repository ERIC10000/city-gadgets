"use client";

import { useMemo, useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { ImageUploader } from "@/components/vendor/ImageUploader";
import { MarkdownField } from "@/components/vendor/MarkdownField";
import { cn } from "@/lib/utils";
import type { GuideRow } from "@/lib/data/guides";
import type { GuideFormResult } from "@/lib/actions/guides";

const SORTS = [
  { value: "rating", label: "Top rated" },
  { value: "featured", label: "Featured first" },
  { value: "price-asc", label: "Cheapest first" },
  { value: "price-desc", label: "Most expensive first" },
  { value: "newest", label: "Newest first" },
];

const inputClass =
  "w-full rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-on-surface focus:outline-none focus:ring-2 focus:ring-on-surface/10";
const labelClass = "mb-1.5 block text-body-sm font-semibold text-on-surface";
const cardClass = "rounded-2xl border border-outline-variant bg-white p-6 shadow-card";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function GuideForm({
  action,
  categories,
  initial,
}: {
  action: (formData: FormData) => Promise<GuideFormResult>;
  categories: { slug: string; name: string }[];
  initial?: GuideRow | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [imgBusy, setImgBusy] = useState(false);
  const [heroUrl, setHeroUrl] = useState(initial?.hero_image ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(initial));

  const derivedSlug = useMemo(() => (slugEdited ? slug : slugify(title)), [slug, slugEdited, title]);

  function handleSubmit(formData: FormData) {
    if (imgBusy) {
      setError("Wait for the cover image to finish uploading.");
      return;
    }
    formData.set("slug", derivedSlug);
    formData.set("heroImage", heroUrl);
    setError(null);
    startTransition(async () => {
      const res = await action(formData);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form action={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main column */}
      <div className="space-y-6 lg:col-span-2">
        <div className={cardClass}>
          <h2 className="mb-4 font-extrabold text-on-surface">Guide details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="g-title" className={labelClass}>Title</label>
              <input
                id="g-title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Best Budget Laptops in Kenya (2026)"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="g-slug" className={labelClass}>
                URL slug <span className="font-normal text-on-surface-variant">— citygadgetskenya.co.ke/guides/<b className="text-on-surface">{derivedSlug || "…"}</b></span>
              </label>
              <input
                id="g-slug"
                value={derivedSlug}
                onChange={(e) => { setSlug(slugify(e.target.value)); setSlugEdited(true); }}
                placeholder="auto-generated from the title"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="g-excerpt" className={labelClass}>Card summary <span className="font-normal text-on-surface-variant">(shown on the guides grid)</span></label>
              <textarea id="g-excerpt" name="excerpt" rows={2} defaultValue={initial?.excerpt ?? ""} placeholder="One punchy sentence that makes people click." className={inputClass} />
            </div>
            <div>
              <label htmlFor="g-desc" className={labelClass}>SEO description <span className="font-normal text-on-surface-variant">(Google search snippet, ~150 chars)</span></label>
              <textarea id="g-desc" name="description" rows={2} defaultValue={initial?.description ?? ""} placeholder="Lead with the keyword + 'in Kenya' + a benefit." className={inputClass} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="mb-1 font-extrabold text-on-surface">Guide content</h2>
          <p className="mb-4 text-body-sm text-on-surface-variant">Write in Markdown — use ## headings, bullet lists and tables. The live product grid appears automatically below it.</p>
          <MarkdownField name="body" defaultValue={initial?.body ?? ""} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className={cardClass}>
          <h2 className="mb-3 font-extrabold text-on-surface">Cover image</h2>
          <ImageUploader initialUrls={heroUrl ? [heroUrl] : []} onChange={(urls) => setHeroUrl(urls[0] ?? "")} onBusyChange={setImgBusy} />
          <p className="mt-2 text-badge-text text-on-surface-variant">A clean, on-topic photo. If left empty, a branded gradient is used automatically.</p>
        </div>

        <div className={cardClass}>
          <h2 className="mb-4 font-extrabold text-on-surface">Products to feature</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="g-cat" className={labelClass}>Category</label>
              <select id="g-cat" name="categorySlug" defaultValue={initial?.category_slug ?? ""} required className={inputClass}>
                <option value="" disabled>Choose a category…</option>
                {categories.map((c) => (<option key={c.slug} value={c.slug}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="g-heading" className={labelClass}>Product grid heading</label>
              <input id="g-heading" name="picksHeading" defaultValue={initial?.picks_heading ?? ""} placeholder="e.g. Budget laptops in stock now" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="g-sort" className={labelClass}>Sort by</label>
                <select id="g-sort" name="pqSort" defaultValue={initial?.pq_sort ?? "rating"} className={inputClass}>
                  {SORTS.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="g-limit" className={labelClass}>Show</label>
                <input id="g-limit" name="pqLimit" type="number" min={3} max={12} defaultValue={initial?.pq_limit ?? 9} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="g-brand" className={labelClass}>Brand <span className="font-normal text-on-surface-variant">(optional)</span></label>
                <input id="g-brand" name="pqBrand" defaultValue={initial?.pq_brand ?? ""} placeholder="e.g. Samsung" className={inputClass} />
              </div>
              <div>
                <label htmlFor="g-max" className={labelClass}>Max price <span className="font-normal text-on-surface-variant">(KSh)</span></label>
                <input id="g-max" name="pqMaxPrice" type="number" min={0} defaultValue={initial?.pq_max_price ?? ""} placeholder="e.g. 20000" className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="mb-4 font-extrabold text-on-surface">Publish</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="g-read" className={labelClass}>Read time (min)</label>
              <input id="g-read" name="readMinutes" type="number" min={1} max={30} defaultValue={initial?.read_minutes ?? 4} className={inputClass} />
            </div>
            <div>
              <label htmlFor="g-status" className={labelClass}>Visibility</label>
              <select id="g-status" name="status" defaultValue={initial?.status ?? "published"} className={inputClass}>
                <option value="published">Published (live)</option>
                <option value="draft">Draft (hidden)</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-error-container p-3 text-body-sm font-semibold text-on-error-container">
              <Icon name="error" className="mt-0.5 text-[16px]" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || imgBusy}
            className={cn("mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60")}
          >
            {pending || imgBusy ? (
              <><Icon name="progress_activity" className="animate-spin" />{imgBusy ? "Finishing upload…" : "Saving…"}</>
            ) : (
              <><Icon name="publish" />{initial ? "Save changes" : "Publish guide"}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
