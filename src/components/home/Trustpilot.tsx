export function TrustpilotRating({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="flex h-5 w-5 items-center justify-center bg-trustpilot"
            style={{ clipPath: i === 4 ? "inset(0 30% 0 0)" : undefined }}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white">
              <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.5l7.1-.6z" />
            </svg>
          </span>
        ))}
      </div>
      <span className="text-body-sm text-on-surface">
        {!compact && <span className="font-bold">4.7</span>} {!compact && "out of 5 based on "}
        <span className="font-bold">91,360</span> reviews
      </span>
      <span className="flex items-center gap-1 font-bold text-on-surface">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-trustpilot">
          <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.5l7.1-.6z" />
        </svg>
        Trustpilot
      </span>
    </div>
  );
}
