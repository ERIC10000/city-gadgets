import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
  className,
}: {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-price-display";
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-extrabold text-primary", sizeClass)}>{formatKES(price)}</span>
      {compareAtPrice && compareAtPrice > price ? (
        <span className="text-body-sm text-on-surface-variant line-through">{formatKES(compareAtPrice)}</span>
      ) : null}
    </div>
  );
}
