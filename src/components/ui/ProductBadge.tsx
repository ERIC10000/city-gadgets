import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  Sale: "bg-tertiary text-on-tertiary",
  "Out of Stock": "bg-outline text-white",
  "Best Seller": "bg-price-gold text-on-surface",
  "New Arrival": "bg-secondary text-on-secondary",
};

export function ProductBadge({ label, className }: { label: string; className?: string }) {
  const tone = TONE[label] ?? "bg-primary text-on-primary";
  return (
    <span className={cn("rounded-lg px-2 py-1 text-badge-text font-semibold uppercase tracking-wide", tone, className)}>
      {label}
    </span>
  );
}
