"use client";

import { useCartStore } from "@/store/cart";

export function CartBadge() {
  const count = useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
  if (count === 0) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-tertiary text-[10px] font-bold text-on-tertiary">
      {count > 9 ? "9+" : count}
    </span>
  );
}
