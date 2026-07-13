import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  reviewCount,
  className,
}: {
  rating: number;
  reviewCount?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex text-price-gold">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = rating >= i + 1;
          const half = !filled && rating > i && rating < i + 1;
          return <Icon key={i} name={half ? "star_half" : "star"} filled={filled || half} className="text-base" />;
        })}
      </div>
      <span className="text-body-sm font-semibold text-on-surface">{rating.toFixed(1)}</span>
      {reviewCount != null ? (
        <span className="text-body-sm text-on-surface-variant">({reviewCount} reviews)</span>
      ) : null}
    </div>
  );
}
