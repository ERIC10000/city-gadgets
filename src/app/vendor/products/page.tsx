import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { VendorProductsTable } from "@/components/vendor/VendorProductsTable";
import { getCurrentUser } from "@/lib/data/auth";
import { getVendorProducts } from "@/lib/data/vendor";

export const metadata: Metadata = { title: "My Products" };

export default async function VendorProductsPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const products = await getVendorProducts(current.profile.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">Products</h1>
        <Link
          href="/vendor/products/new"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-on-primary hover:opacity-90"
        >
          <Icon name="add" />
          New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-lowest py-20 text-center shadow-card">
          <Icon name="inventory_2" className="text-4xl text-on-surface-variant" />
          <p className="font-bold text-on-surface">No products yet</p>
          <Link href="/vendor/products/new" className="text-body-sm font-bold text-primary hover:underline">
            Add your first product
          </Link>
        </div>
      ) : (
        <VendorProductsTable products={products} />
      )}
    </div>
  );
}
