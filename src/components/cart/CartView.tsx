"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatKES } from "@/lib/format";
import { useCartStore } from "@/store/cart";

export function CartView() {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const subtotal = useCartStore((s) => s.subtotal());

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface-container-low py-24 text-center">
        <Icon name="shopping_cart" className="text-5xl text-on-surface-variant" />
        <div>
          <h2 className="font-bold text-on-surface">Your cart is empty</h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">Add some gadgets to get started.</p>
        </div>
        <Link href="/shop" className="rounded-xl bg-primary px-6 py-3 font-bold text-on-primary hover:opacity-90">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {lines.map((line) => (
          <div key={line.productId} className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-white p-4 transition-shadow hover:shadow-card">
            <Link
              href={`/product/${line.slug}`}
              className="relative h-24 w-24 flex-none overflow-hidden rounded-xl border border-outline-variant bg-white sm:h-28 sm:w-28"
            >
              {line.image ? (
                <Image src={line.image} alt={line.name} fill sizes="112px" className="object-contain p-2" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-on-surface-variant">
                  <Icon name="image" />
                </span>
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/product/${line.slug}`} className="line-clamp-1 font-bold text-on-surface hover:text-primary">
                {line.name}
              </Link>
              <p className="text-body-sm text-on-surface-variant">{formatKES(line.price)}</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-outline-variant">
              <button
                onClick={() => setQuantity(line.productId, line.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center text-on-surface-variant hover:text-primary"
                aria-label="Decrease quantity"
              >
                <Icon name="remove" className="text-base" />
              </button>
              <span className="w-6 text-center text-body-sm font-bold">{line.quantity}</span>
              <button
                onClick={() => setQuantity(line.productId, line.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center text-on-surface-variant hover:text-primary"
                aria-label="Increase quantity"
              >
                <Icon name="add" className="text-base" />
              </button>
            </div>
            <p className="w-24 flex-none text-right font-bold text-on-surface">{formatKES(line.price * line.quantity)}</p>
            <button
              onClick={() => remove(line.productId)}
              className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-on-surface-variant hover:bg-error-container hover:text-error"
              aria-label="Remove item"
            >
              <Icon name="delete" className="text-base" />
            </button>
          </div>
        ))}
      </div>

      <div className="h-fit space-y-6 rounded-2xl bg-surface-container-low p-6">
        <h2 className="font-bold text-on-surface">Order Summary</h2>
        <div className="space-y-2 text-body-sm">
          <div className="flex justify-between text-on-surface-variant">
            <span>Subtotal</span>
            <span>{formatKES(subtotal)}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-outline-variant pt-4 text-lg font-extrabold text-on-surface">
          <span>Total</span>
          <span>{formatKES(subtotal)}</span>
        </div>
        <Link
          href="/checkout"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-on-primary hover:opacity-90"
        >
          Proceed to Checkout
          <Icon name="arrow_forward" />
        </Link>
      </div>
    </div>
  );
}
