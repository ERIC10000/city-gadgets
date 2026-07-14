import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Your Cart" };

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-8 md:px-gutter">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Cart" }]} />
      <h1 className="my-6 text-headline-lg font-bold text-on-surface">Your Cart</h1>
      <CartView />
    </div>
  );
}
