import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatKES } from "@/lib/format";
import { getCurrentUser } from "@/lib/data/auth";
import { getVendorProducts } from "@/lib/data/vendor";
import { toggleProductStatus } from "@/lib/actions/products";

export const metadata: Metadata = { title: "Deals & Banners" };

export default async function DealsPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const allProducts = await getVendorProducts(current.profile.id);
  const featuredProducts = allProducts.filter((p) => p.is_featured);
  const onSaleProducts = allProducts.filter(
    (p) => p.compare_at_price != null && p.compare_at_price > p.price,
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">Deals & Banners</h1>
        <p className="text-on-surface-variant">
          Manage which products are featured and on sale across your storefront.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Products", value: allProducts.length, icon: "inventory_2", color: "text-primary" },
          { label: "Featured", value: featuredProducts.length, icon: "star", color: "text-price-gold" },
          { label: "On Sale", value: onSaleProducts.length, icon: "local_offer", color: "text-m-pesa-green" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-surface-container-lowest p-5 shadow-card">
            <Icon name={s.icon} filled className={`mb-2 ${s.color}`} />
            <p className="text-2xl font-extrabold text-on-surface">{s.value}</p>
            <p className="text-body-sm text-on-surface-variant">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Featured Products */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <Icon name="star" filled className="text-price-gold" />
          <h2 className="text-lg font-bold text-on-surface">Featured Products</h2>
          <span className="rounded-full bg-primary/10 px-3 py-0.5 text-body-sm font-bold text-primary">
            {featuredProducts.length}
          </span>
        </div>
        <p className="mb-4 text-body-sm text-on-surface-variant">
          These products appear in the &ldquo;Customer Favorites&rdquo; and &ldquo;Top Picks&rdquo; sections on the homepage.
          Toggle a product&rsquo;s publish status from the{" "}
          <a href="/vendor/products" className="font-bold text-primary hover:underline">
            Products
          </a>{" "}
          page and set <code className="rounded bg-surface-container-high px-1 font-mono">is_featured = true</code> in your database to feature it.
        </p>
        {featuredProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-lowest py-12 text-center shadow-card">
            <Icon name="star_border" className="text-4xl text-on-surface-variant" />
            <p className="font-bold text-on-surface">No featured products</p>
            <p className="text-body-sm text-on-surface-variant">
              Mark products as featured in Supabase to surface them here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-card">
            <table className="w-full text-left">
              <thead className="border-b border-outline-variant text-body-sm text-on-surface-variant">
                <tr>
                  <th className="px-5 py-4 font-semibold">Product</th>
                  <th className="px-5 py-4 font-semibold">Price</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {featuredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-none overflow-hidden rounded-lg bg-white">
                          {product.images[0] && (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          )}
                        </div>
                        <span className="line-clamp-1 font-semibold text-on-surface">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-on-surface">{formatKES(product.price)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={product.status === "published" ? "delivered" : "pending"} />
                    </td>
                    <td className="px-5 py-4">
                      <form action={toggleProductStatus} className="flex justify-end">
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="status" value={product.status} />
                        <button
                          type="submit"
                          title={product.status === "published" ? "Unpublish" : "Publish"}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
                        >
                          <Icon
                            name={product.status === "published" ? "visibility_off" : "visibility"}
                            className="text-[20px]"
                          />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* On Sale Products */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <Icon name="local_offer" filled className="text-m-pesa-green" />
          <h2 className="text-lg font-bold text-on-surface">On Sale</h2>
          <span className="rounded-full bg-m-pesa-green/10 px-3 py-0.5 text-body-sm font-bold text-m-pesa-green">
            {onSaleProducts.length}
          </span>
        </div>
        <p className="mb-4 text-body-sm text-on-surface-variant">
          Products with a &ldquo;Compare at Price&rdquo; set appear in the Top Deals section. Edit a product to add or remove a sale price.
        </p>
        {onSaleProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-lowest py-12 text-center shadow-card">
            <Icon name="sell" className="text-4xl text-on-surface-variant" />
            <p className="font-bold text-on-surface">No products on sale</p>
            <p className="text-body-sm text-on-surface-variant">
              Set a &ldquo;Compare at Price&rdquo; higher than the current price to create a sale.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-card">
            <table className="w-full text-left">
              <thead className="border-b border-outline-variant text-body-sm text-on-surface-variant">
                <tr>
                  <th className="px-5 py-4 font-semibold">Product</th>
                  <th className="px-5 py-4 font-semibold">Sale Price</th>
                  <th className="px-5 py-4 font-semibold">Was</th>
                  <th className="px-5 py-4 font-semibold">Saving</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {onSaleProducts.map((product) => {
                  const saving = (product.compare_at_price ?? 0) - product.price;
                  const pct = Math.round((saving / (product.compare_at_price ?? 1)) * 100);
                  return (
                    <tr key={product.id} className="hover:bg-surface-container transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 flex-none overflow-hidden rounded-lg bg-white">
                            {product.images[0] && (
                              <Image
                                src={product.images[0].url}
                                alt={product.name}
                                fill
                                sizes="48px"
                                className="object-contain p-1"
                              />
                            )}
                          </div>
                          <span className="line-clamp-1 font-semibold text-on-surface">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-m-pesa-green">{formatKES(product.price)}</td>
                      <td className="px-5 py-4 text-on-surface-variant line-through">
                        {formatKES(product.compare_at_price!)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-m-pesa-green/10 px-3 py-1 text-body-sm font-bold text-m-pesa-green">
                          -{pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
