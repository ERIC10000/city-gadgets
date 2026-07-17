import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { CartView } from "@/components/cart/CartView";
import { ProductCard } from "@/components/product/ProductCard";
import { getProducts } from "@/lib/data/products";

export const metadata: Metadata = { title: "Your Cart" };

export default async function CartPage() {
  // Image-rich recommendation rail under the cart, mirroring the marketplace
  // pattern — top-rated items that are currently discounted.
  const { items } = await getProducts({ onSaleOnly: true, sort: "rating", limit: 4 });

  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-8 md:px-gutter">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Cart" }]} />
      <h1 className="my-6 text-headline-lg font-bold text-on-surface">Your Cart</h1>
      <CartView />

      {items.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-extrabold text-on-surface md:text-2xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
