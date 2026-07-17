import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatKES } from "@/lib/format";
import { getCurrentUser } from "@/lib/data/auth";
import { getVendorProducts, vendorStats } from "@/lib/data/vendor";
import { getAllOrders } from "@/lib/data/orders";

export const metadata: Metadata = { title: "Vendor Dashboard" };

const SHORTCUTS = [
  { href: "/vendor/orders", icon: "shopping_bag", title: "Orders", sub: "Fulfil & track sales" },
  { href: "/vendor/products", icon: "inventory_2", title: "Products", sub: "Catalog & stock levels" },
  { href: "/vendor/deals", icon: "local_offer", title: "Deals & Banners", sub: "Run promotions" },
  { href: "/vendor/categories", icon: "category", title: "Categories", sub: "Organise departments" },
  { href: "/vendor/videos", icon: "smart_display", title: "Video Inspiration", sub: "Short-form showcases" },
  { href: "/vendor/customers", icon: "group", title: "Customers", sub: "Buyers & contacts" },
];

export default async function VendorDashboardPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const [products, orders] = await Promise.all([getVendorProducts(current.profile.id), getAllOrders(50)]);
  const stats = vendorStats(products);
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const lowStock = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 3);
  const recentProducts = products.slice(0, 5);
  const recentOrders = orders.slice(0, 5);

  const statCards = [
    { icon: "payments", tone: "text-price-gold", value: formatKES(revenue), label: `Revenue · ${orders.length} orders` },
    { icon: "pending_actions", tone: "text-tertiary", value: String(pendingOrders), label: "Orders to fulfil" },
    { icon: "inventory_2", tone: "text-primary", value: String(stats.total), label: `Products · ${stats.published} live` },
    { icon: "account_balance_wallet", tone: "text-secondary", value: formatKES(stats.inventoryValue), label: "Inventory Value" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">Vendor Dashboard</h1>
          <p className="text-on-surface-variant">Your store at a glance — sales, stock and promotions.</p>
        </div>
        <Link
          href="/vendor/products/new"
          className="flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-on-primary hover:opacity-90"
        >
          <Icon name="add" />
          New Product
        </Link>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl bg-surface-container-lowest p-6 shadow-card">
            <Icon name={s.icon} filled className={`mb-3 ${s.tone}`} />
            <p className="text-xl font-extrabold text-on-surface md:text-2xl">{s.value}</p>
            <p className="text-body-sm text-on-surface-variant">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border-l-4 border-price-gold bg-price-gold/10 p-5">
          <Icon name="warning" filled className="text-price-gold" />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-on-surface">
              {lowStock.length} {lowStock.length === 1 ? "product is" : "products are"} almost out of stock
            </p>
            <p className="truncate text-body-sm text-on-surface-variant">
              {lowStock.slice(0, 3).map((p) => p.name).join(" · ")}
              {lowStock.length > 3 ? " …" : ""}
            </p>
          </div>
          <Link href="/vendor/products" className="shrink-0 text-body-sm font-bold text-secondary hover:underline">
            Restock
          </Link>
        </div>
      )}

      {/* Section shortcuts */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-card transition-all hover:shadow-card-lg"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-on-primary-container">
              <Icon name={s.icon} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-on-surface">{s.title}</p>
              <p className="truncate text-body-sm text-on-surface-variant">{s.sub}</p>
            </div>
            <Icon name="chevron_right" className="text-on-surface-variant transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-on-surface">Recent Orders</h2>
            <Link href="/vendor/orders" className="text-body-sm font-bold text-secondary hover:underline">
              View All
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="py-10 text-center text-body-sm text-on-surface-variant">
              No orders yet — sales will appear here as they come in.
            </p>
          ) : (
            <div className="divide-y divide-outline-variant">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-semibold text-on-surface">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-body-sm text-on-surface-variant">{formatDate(order.created_at)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                  <p className="font-bold text-on-surface">{formatKES(order.total)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent products */}
        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-on-surface">Recent Products</h2>
            <Link href="/vendor/products" className="text-body-sm font-bold text-secondary hover:underline">
              View All
            </Link>
          </div>
          {recentProducts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <Icon name="inventory_2" className="text-4xl text-on-surface-variant" />
              <p className="font-bold text-on-surface">No products yet</p>
              <Link href="/vendor/products/new" className="text-body-sm font-bold text-secondary hover:underline">
                Add your first product
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="line-clamp-1 font-semibold text-on-surface">{product.name}</p>
                    <p className="text-body-sm text-on-surface-variant">
                      {formatKES(product.price)} · {product.stock_quantity} in stock
                    </p>
                  </div>
                  <StatusBadge status={product.status === "published" ? "delivered" : "pending"} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
