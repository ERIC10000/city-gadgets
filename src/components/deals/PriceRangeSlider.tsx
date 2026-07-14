"use client";

import { formatKES } from "@/lib/format";

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const pct = (n: number) => ((n - min) / (max - min || 1)) * 100;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1 rounded-lg border border-outline-variant px-2 py-1.5 text-center text-badge-text font-semibold text-on-surface">
          {formatKES(lo)}
        </div>
        <span className="text-on-surface-variant">–</span>
        <div className="flex-1 rounded-lg border border-outline-variant px-2 py-1.5 text-center text-badge-text font-semibold text-on-surface">
          {formatKES(hi)}
        </div>
      </div>

      <div className="relative h-5">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-surface-container-highest" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-on-surface"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          className="range-thumb absolute top-0 h-5 w-full appearance-none bg-transparent"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          className="range-thumb absolute top-0 h-5 w-full appearance-none bg-transparent"
          aria-label="Maximum price"
        />
      </div>
    </div>
  );
}
