"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { GoogleReviewCta } from "@/components/marketing/GoogleReviewCta";
import { submitReview } from "@/lib/actions/reviews";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { cn } from "@/lib/utils";
import type { ProductReview } from "@/lib/data/reviews";

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex text-price-gold", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" filled={i < value} className="text-[16px]" />
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className="p-0.5"
        >
          <Icon name="star" filled={n <= shown} className={cn("text-3xl", n <= shown ? "text-price-gold" : "text-outline-variant")} />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({
  productId,
  slug,
  existing,
}: {
  productId: string;
  slug: string;
  existing: ProductReview | null;
}) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  function action(formData: FormData) {
    formData.set("rating", String(rating));
    setError(null);
    start(async () => {
      const res = await submitReview(formData);
      if (res.error) setError(res.error);
      else setDone(true);
    });
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-secondary/40 bg-secondary-container/30 p-5 text-center">
        <Icon name="check_circle" filled className="text-2xl text-secondary" />
        <p className="mt-1 font-bold text-on-surface">Thanks for your review!</p>
        <p className="text-body-sm text-on-surface-variant">It&apos;s live on this page now.</p>
        <div className="mt-4">
          <GoogleReviewCta variant="inline" />
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-sm placeholder:text-on-surface-variant/60 focus:border-on-surface focus:outline-none";

  return (
    <form action={action} className="rounded-2xl border border-outline-variant bg-white p-5">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="slug" value={slug} />
      <p className="font-bold text-on-surface">{existing ? "Update your review" : "Write a review"}</p>
      <div className="mt-3">
        <StarPicker value={rating} onChange={setRating} />
      </div>
      <input name="title" defaultValue={existing?.title ?? ""} placeholder="Summarise it (optional)" className={cn(inputClass, "mt-3")} />
      <textarea
        name="body"
        rows={3}
        defaultValue={existing?.body ?? ""}
        placeholder="How was the product? Was delivery fast? (optional)"
        className={cn(inputClass, "mt-2")}
      />
      {error && <p className="mt-2 text-body-sm font-semibold text-error">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-3 flex items-center gap-2 rounded-xl bg-on-surface px-6 py-2.5 text-body-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? <Icon name="progress_activity" className="animate-spin" /> : <Icon name="rate_review" />}
        {existing ? "Update review" : "Submit review"}
      </button>
    </form>
  );
}

export function ProductReviews({
  productId,
  slug,
  reviews,
  rating,
  reviewCount,
}: {
  productId: string;
  slug: string;
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
}) {
  // Auth is resolved on the client so the product page itself stays cacheable
  // (no server-side cookies() read). The user's own review is already in the
  // public `reviews` list, so we just match on user id — no extra query.
  const [userId, setUserId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setChecked(true);
      return;
    }
    let active = true;
    createClient()
      .auth.getSession()
      .then(({ data }) => {
        if (active) {
          setUserId(data.session?.user?.id ?? null);
          setChecked(true);
        }
      })
      .catch(() => active && setChecked(true));
    return () => {
      active = false;
    };
  }, []);

  const isLoggedIn = userId !== null;
  const myReview = userId ? reviews.find((r) => r.user_id === userId) ?? null : null;

  const dist = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));
  const max = Math.max(1, ...dist.map((d) => d.count));

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-xl font-extrabold text-on-surface md:text-2xl">Customer Reviews</h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Summary + form */}
        <div className="space-y-5">
          {reviewCount > 0 ? (
            <div className="rounded-2xl border border-outline-variant bg-white p-5 text-center">
              <p className="text-4xl font-extrabold text-on-surface">{rating.toFixed(1)}</p>
              <Stars value={Math.round(rating)} className="mt-1 justify-center text-lg" />
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Based on {reviewCount} review{reviewCount === 1 ? "" : "s"}
              </p>
              <div className="mt-4 space-y-1.5">
                {dist.map((d) => (
                  <div key={d.stars} className="flex items-center gap-2">
                    <span className="w-6 text-badge-text text-on-surface-variant">{d.stars}★</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
                      <div className="h-full rounded-full bg-price-gold" style={{ width: `${(d.count / max) * 100}%` }} />
                    </div>
                    <span className="w-6 text-right text-badge-text text-on-surface-variant">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-6 text-center">
              <Icon name="reviews" className="text-3xl text-on-surface-variant" />
              <p className="mt-1 font-bold text-on-surface">No reviews yet</p>
              <p className="text-body-sm text-on-surface-variant">Be the first to review this product.</p>
            </div>
          )}

          {!checked ? (
            <div className="flex items-center justify-center rounded-2xl border border-outline-variant bg-white p-5 text-on-surface-variant">
              <Icon name="progress_activity" className="animate-spin text-xl" />
            </div>
          ) : isLoggedIn ? (
            <ReviewForm productId={productId} slug={slug} existing={myReview} />
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-2xl border border-outline-variant bg-white p-5 text-body-sm font-bold text-on-surface transition-colors hover:border-on-surface"
            >
              <Icon name="rate_review" />
              Sign in to write a review
            </Link>
          )}

          <GoogleReviewCta variant="card" />
        </div>

        {/* Review list */}
        <div className="lg:col-span-2">
          {reviews.length === 0 ? (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border border-outline-variant p-8 text-center text-on-surface-variant">
              <Icon name="forum" className="text-4xl opacity-50" />
              <p className="text-body-sm">Reviews from verified buyers will appear here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-outline-variant rounded-2xl border border-outline-variant bg-white">
              {reviews.map((r) => (
                <li key={r.id} className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high font-bold text-on-primary-container">
                        {(r.reviewer_name ?? "A").slice(0, 1).toUpperCase()}
                      </span>
                      <div>
                        <p className="text-body-sm font-bold text-on-surface">{r.reviewer_name ?? "Verified buyer"}</p>
                        <span className="flex items-center gap-1 text-badge-text text-secondary">
                          <Icon name="verified" className="text-[13px]" /> Verified buyer
                        </span>
                      </div>
                    </div>
                    <span className="text-badge-text text-on-surface-variant">
                      {new Date(r.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <Stars value={r.rating} className="mt-3" />
                  {r.title && <p className="mt-2 font-bold text-on-surface">{r.title}</p>}
                  {r.body && <p className="mt-1 text-body-sm leading-relaxed text-on-surface-variant">{r.body}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
