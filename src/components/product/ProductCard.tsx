import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatKES } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = product.images[0]?.url;
  const outOfStock = product.stock_quantity <= 0;
  const hasDiscount = product.compare_at_price != null && product.compare_at_price > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-outline-variant bg-white p-4 transition-all duration-300 hover:border-transparent hover:shadow-card-lg">
      <Link href={`/product/${product.slug}`} className="relative mb-4 flex aspect-square items-center justify-center">
        {image ? (
          <Image
            src={image}
            alt={product.images[0]?.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
        ) : null}
        {outOfStock && (
          <span className="absolute left-0 top-0 rounded-full bg-neutral-800 px-2.5 py-1 text-badge-text font-semibold text-white">
            Sold Out
          </span>
        )}
      </Link>

      <Link href={`/product/${product.slug}`} className="flex flex-1 flex-col">
        <h3 className="mb-3 line-clamp-2 min-h-[2.5rem] text-body-sm font-medium leading-snug text-on-surface transition-colors group-hover:text-secondary">
          {product.name}
        </h3>

        <div className="mt-auto">
          {hasDiscount && (
            <p className="text-badge-text text-on-surface-variant">
              new <span className="line-through">{formatKES(product.compare_at_price!)}</span>
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-on-surface">{formatKES(product.price)}</span>
            {hasDiscount && (
              <span className="rounded bg-discount-bg px-1.5 py-0.5 text-badge-text font-bold text-discount">
                -{discountPct}%
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add-to-cart reveals on hover so the resting card matches the reference's minimal look */}
      <div className="pointer-events-none mt-3 max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:max-h-16 group-hover:opacity-100">
        <AddToCartButton
          productId={product.id}
          slug={product.slug}
          name={product.name}
          price={product.price}
          image={image ?? ""}
          disabled={outOfStock}
          variant="primary"
          className="h-10 w-full text-sm"
        />
      </div>
    </div>
  );
}
