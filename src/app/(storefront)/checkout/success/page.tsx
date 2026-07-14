import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Order Confirmed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const reference = order ? order.slice(0, 8).toUpperCase() : "—";

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-margin-mobile py-24 text-center">
      <span className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-m-pesa-green/10 text-m-pesa-green">
        <Icon name="check_circle" filled className="text-5xl" />
      </span>
      <h1 className="text-3xl font-extrabold text-on-surface">Order Confirmed!</h1>
      <p className="mt-3 text-on-surface-variant">
        Thanks for shopping with City Gadgets. Your order reference is{" "}
        <span className="font-mono font-bold text-on-surface">#{reference}</span>. We&apos;ll send updates as it&apos;s
        prepared for same-day delivery.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/account/orders" className="rounded-xl bg-primary px-6 py-3 font-bold text-on-primary hover:opacity-90">
          Track Your Order
        </Link>
        <Link href="/shop" className="rounded-xl bg-surface-container-highest px-6 py-3 font-bold text-on-surface hover:bg-surface-dim">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
