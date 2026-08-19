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

// What makes a guide people actually read (and buy from) — shown right above the
// editor so the admin never faces a blank box wondering how to fill it.
const WRITING_TIPS = [
  "Open with a hook — the reader's exact problem in one line (\"Buying a laptop in Kenya shouldn't be a gamble\").",
  "Break it up with ## headings, short paragraphs, and a comparison table — walls of text lose readers.",
  "Group your picks by budget (Under 20K / 20–40K / Premium) so shoppers self-select.",
  "Add a short FAQ — it answers objections and Google loves to feature it.",
  "Keep the tone honest and local: mention genuine stock, official warranty and same-day Nairobi delivery.",
];

// A guide-shaped starter skeleton (very different from the product-description
// example). One click drops this in, so the admin edits instead of inventing.
const GUIDE_TEMPLATE = `Buying the right one in Kenya shouldn't feel like a gamble. Here's exactly what to look for, what to skip, and the models worth your money right now.

## Who this guide is for
- First-time buyers who want value, not hype
- Anyone stuck comparing two or three models
- Shoppers working to a clear budget

## What actually matters (and what doesn't)
| What to check | Why it matters |
| --- | --- |
| Battery life | All-day use without hunting for a charger |
| RAM & storage | Smooth multitasking and room for your photos |
| Warranty | 12-month official brand warranty = real peace of mind |

## Our top picks by budget
**Under KSh 20,000 —** the best everyday value right now.

**KSh 20,000–40,000 —** the sweet spot for most people.

**Premium —** flagship performance if you want the very best.

## Pro tips before you pay
- Insist on sealed, genuine stock
- Confirm it's official brand warranty, not a shop guarantee
- Ask about same-day delivery within Nairobi

## FAQ
**Is it brand new and sealed?**
Yes — every unit is genuine, sealed and warrantied.

**Do you deliver the same day?**
Yes, anywhere in Nairobi, often within hours.

_The live prices and models below update automatically — always in stock, always current._`;

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
          <p className="mb-4 text-body-sm text-on-surface-variant">
            Write in Markdown. The live product grid appears automatically below your article — so focus on the
            advice, and let the shop do the selling.
          </p>

          {/* How to write an eye-catching guide — quick, skimmable coaching */}
          <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="mb-2 flex items-center gap-1.5 text-body-sm font-bold text-on-surface">
              <Icon name="tips_and_updates" className="text-[18px] text-primary" />
              How to write a guide people actually read
            </p>
            <ul className="space-y-1.5">
              {WRITING_TIPS.map((tip, i) => (
                <li key={i} className="flex gap-2 text-badge-text leading-relaxed text-on-surface-variant">
                  <Icon name="check_circle" className="mt-px text-[14px] text-primary" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2.5 text-badge-text text-on-surface-variant">
              New to this? Hit <b className="text-on-surface">Insert a starter template</b> below for a ready-made structure to edit.
            </p>
          </div>

          <MarkdownField
            name="body"
            defaultValue={initial?.body ?? ""}
            example={GUIDE_TEMPLATE}
            rows={22}
            className="min-h-[460px]"
          />
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
