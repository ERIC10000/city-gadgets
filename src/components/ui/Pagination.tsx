import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

function pageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }
  return result;
}

export function Pagination({
  current,
  total,
  makeHref,
}: {
  current: number;
  total: number;
  makeHref: (page: number) => string;
}) {
  if (total <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={makeHref(Math.max(1, current - 1))}
        aria-disabled={current === 1}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary",
          current === 1 && "pointer-events-none opacity-30",
        )}
      >
        <Icon name="chevron_left" />
      </Link>
      {pageNumbers(current, total).map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className="px-1 text-on-surface-variant">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={makeHref(p)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-body-sm font-semibold",
              p === current ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-high",
            )}
          >
            {p}
          </Link>
        ),
      )}
      <Link
        href={makeHref(Math.min(total, current + 1))}
        aria-disabled={current === total}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary",
          current === total && "pointer-events-none opacity-30",
        )}
      >
        <Icon name="chevron_right" />
      </Link>
    </nav>
  );
}
