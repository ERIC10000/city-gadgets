import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-8 md:px-gutter">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-headline-lg font-bold text-on-surface">Checkout</h1>
        <span className="hidden items-center gap-2 rounded-full bg-surface-container-low px-4 py-2 text-body-sm font-semibold text-on-surface-variant md:flex">
          <Icon name="lock" className="text-[18px] text-m-pesa-green" />
          Secure Checkout
        </span>
      </div>
      <CheckoutView />
    </div>
  );
}
