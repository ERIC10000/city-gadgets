import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatKES } from "@/lib/format";
import { getCurrentUser } from "@/lib/data/auth";
import { getVendorProducts, vendorStats } from "@/lib/data/vendor";

export const metadata: Metadata = { title: "Vendor Dashboard" };

const STATS = [
  { key: "total", icon: "inventory_2", tone: "text-primary", label: "Total Products" },
  { key: "published", icon: "visibility", tone: "text-secondary", label: "Published" },
  { key: "outOfStock", icon: "production_quantity_limits", tone: "text-tertiary", label: "Out of Stock" },
] as const;

export default async function VendorDashboardPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const products = await getVendorProducts(current.profile.id);
  const stats = vendorStats(products);
  const recent = products.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">Vendor Dashboard</h1>
          <p className="text-on-surface-variant">Manage your catalog and video showcases.</p>
        </div>
        <Link
          href="/vendor/products/new"
          className="flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-on-primary hover:opacity-90"
        >
          <Icon name="add" />
          New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.key} className="rounded-2xl bg-surface-container-lowest p-6 shadow-card">
            <Icon name={stat.icon} filled className={`mb-3 ${stat.tone}`} />
            <p className="text-2xl font-extrabold text-on-surface">{stats[stat.key]}</p>
            <p className="text-body-sm text-on-surface-variant">{stat.label}</p>
          </div>
        ))}
        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-card">
          <Icon name="account_balance_wallet" filled className="mb-3 text-price-gold" />
          <p className="text-2xl font-extrabold text-on-surface">{formatKES(stats.inventoryValue)}</p>
          <p className="text-body-sm text-on-surface-variant">Inventory Value</p>
        </div>
      </div>

      <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-on-surface">Recent Products</h2>
          <Link href="/vendor/products" className="text-body-sm font-bold text-primary hover:underline">
            View All
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Icon name="inventory_2" className="text-4xl text-on-surface-variant" />
            <p className="font-bold text-on-surface">No products yet</p>
            <Link href="/vendor/products/new" className="text-body-sm font-bold text-primary hover:underline">
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {recent.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="line-clamp-1 font-semibold text-on-surface">{product.name}</p>
                  <p className="text-body-sm text-on-surface-variant">{formatKES(product.price)}</p>
                </div>
                <StatusBadge status={product.status === "published" ? "delivered" : "pending"} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
