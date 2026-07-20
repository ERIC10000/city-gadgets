import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatKES } from "@/lib/format";
import { getCurrentUser } from "@/lib/data/auth";
import { getVendorProducts } from "@/lib/data/vendor";
import { deleteProduct, toggleProductStatus } from "@/lib/actions/products";

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
        <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-card">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant text-body-sm text-on-surface-variant">
              <tr>
                <th className="px-5 py-4 font-semibold">Product</th>
                <th className="px-5 py-4 font-semibold">Price</th>
                <th className="px-5 py-4 font-semibold">Stock</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 flex-none overflow-hidden rounded-lg bg-white">
                        {product.images[0] && (
                          <Image src={product.images[0].url} alt={product.name} fill sizes="48px" className="object-contain p-1" />
                        )}
                      </div>
                      <span className="line-clamp-1 font-semibold text-on-surface">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-on-surface">{formatKES(product.price)}</td>
                  <td className="px-5 py-4 text-on-surface-variant">{product.stock_quantity}</td>
                  <td className="px-5 py-4">
                    {product.status === "published" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2.5 py-1 text-badge-text font-bold text-on-secondary-container">
                        <Icon name="visibility" className="text-[13px]" />
                        Live in store
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-price-gold/15 px-2.5 py-1 text-badge-text font-bold text-price-gold">
                        <Icon name="visibility_off" className="text-[13px]" />
                        Draft — hidden
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <form action={toggleProductStatus}>
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="status" value={product.status} />
                        <button
                          type="submit"
                          title={product.status === "published" ? "Unpublish" : "Publish"}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                        >
                          <Icon name={product.status === "published" ? "visibility_off" : "visibility"} className="text-[20px]" />
                        </button>
                      </form>
                      <Link
                        href={`/vendor/products/${product.id}`}
                        title="Edit"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
                      >
                        <Icon name="edit" className="text-[20px]" />
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <button
                          type="submit"
                          title="Delete"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error"
                        >
                          <Icon name="delete" className="text-[20px]" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
