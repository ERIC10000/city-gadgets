import { GOOGLE_REVIEW_URL } from "@/lib/contact";

/** Coloured Google "G" so the CTA is instantly recognisable. */
function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/**
 * Funnels happy customers to the Google Business Profile review page. Google
 * reviews are the single biggest driver of a local retailer's search ranking
 * and the star rating shown next to the business in search/maps.
 */
export function GoogleReviewCta({ variant = "card" }: { variant?: "card" | "inline" | "banner" }) {
  if (variant === "inline") {
    return (
      <a
        href={GOOGLE_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-white px-5 py-2.5 text-body-sm font-bold text-on-surface transition-colors hover:border-on-surface"
      >
        <GoogleG className="h-4 w-4" />
        Rate us on Google
      </a>
    );
  }

  if (variant === "banner") {
    return (
      <a
        href={GOOGLE_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-white p-5 transition-shadow hover:shadow-card"
      >
        <GoogleG className="h-10 w-10 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-on-surface">Enjoyed shopping with us?</p>
          <p className="text-body-sm text-on-surface-variant">Leave a Google review — it takes 20 seconds and helps hugely.</p>
        </div>
        <span className="hidden shrink-0 rounded-full bg-on-surface px-5 py-2.5 text-body-sm font-bold text-white sm:block">
          Review us
        </span>
      </a>
    );
  }

  return (
    <a
      href={GOOGLE_REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-2xl bg-inverse-surface p-5 text-white transition-transform hover:scale-[1.01]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white">
        <GoogleG className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-bold">Rate us on Google</p>
        <p className="text-badge-text text-white/60">Your review helps other shoppers find us</p>
      </div>
      <span className="material-symbols-outlined text-white/60">open_in_new</span>
    </a>
  );
}
