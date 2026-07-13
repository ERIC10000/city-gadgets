import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductBadge } from "@/components/ui/ProductBadge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = product.images[0]?.url;
  const outOfStock = product.stock_quantity <= 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-card transition-all duration-300 hover:shadow-card-lg">
      <Link href={`/product/${product.slug}`} className="relative flex h-56 items-center justify-center bg-white p-6">
        {product.badge ? <ProductBadge label={product.badge} className="absolute left-4 top-4 z-10" /> : null}
        {image ? (
          <Image
            src={image}
            alt={product.images[0]?.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {product.brand ? (
          <span className="mb-2 w-fit rounded bg-primary/10 px-2 py-0.5 text-badge-text font-semibold uppercase tracking-wide text-primary">
            {product.brand}
          </span>
        ) : null}
        <Link href={`/product/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 font-bold text-on-surface transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto space-y-3">
          <PriceDisplay price={product.price} compareAtPrice={product.compare_at_price} />
          <AddToCartButton
            productId={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            image={image ?? ""}
            disabled={outOfStock}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
