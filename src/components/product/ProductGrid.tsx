import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-surface-container-low py-24 text-center">
        <Icon name="search_off" className="text-5xl text-on-surface-variant" />
        <div>
          <h3 className="font-bold text-on-surface">No products found</h3>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Try adjusting your filters, or check back soon — new stock lands every week.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
