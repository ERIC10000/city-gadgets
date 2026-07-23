/**
 * Site-wide customer rating badge.
 *
 * Edit REVIEW_STATS as real reviews come in — it's the single source of truth
 * for every place the rating is shown. Note this is City Gadgets' own rating,
 * not a third-party review platform's; see the note in the README before
 * re-adding any external review brand's logo.
 */
export const REVIEW_STATS = {
  rating: 4.8,
  count: 3248,
} as const;

function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.5l7.1-.6z" />
    </svg>
  );
}

export function TrustpilotRating({ compact = false }: { compact?: boolean }) {
  const { rating, count } = REVIEW_STATS;
  // Fill whole stars, then clip the last one to the fractional remainder.
  const full = Math.floor(rating);
  const fraction = rating - full;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="flex h-5 w-5 items-center justify-center bg-trustpilot"
            style={{ clipPath: i === full && fraction > 0 ? `inset(0 ${Math.round((1 - fraction) * 100)}% 0 0)` : undefined }}
          >
            <Star className="h-3.5 w-3.5 fill-white" />
          </span>
        ))}
      </div>
      <span className="text-body-sm text-on-surface">
        {!compact && <span className="font-bold">{rating}</span>}
        {!compact && " out of 5 from "}
        <span className="font-bold">{count.toLocaleString("en-KE")}</span> reviews
      </span>
      <span className="flex items-center gap-1 font-bold text-on-surface">
        <Star className="h-4 w-4 fill-trustpilot" />
        Verified Buyers
      </span>
    </div>
  );
}
