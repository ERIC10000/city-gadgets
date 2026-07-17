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

  const today = new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const statCards = [
    { icon: "payments", tint: "bg-price-gold/15 text-price-gold", value: formatKES(revenue), label: `Revenue · ${orders.length} orders` },
    { icon: "pending_actions", tint: "bg-tertiary-container text-tertiary", value: String(pendingOrders), label: "Orders to fulfil" },
    { icon: "inventory_2", tint: "bg-surface-container-high text-on-primary-container", value: String(stats.total), label: `Products · ${stats.published} live` },
    { icon: "account_balance_wallet", tint: "bg-secondary-container text-on-secondary-container", value: formatKES(stats.inventoryValue), label: "Inventory Value" },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface">
            Good day, {current.profile.full_name?.split(" ")[0] ?? "Vendor"} 👋
          </h1>
          <p className="text-body-sm text-on-surface-variant">{today} · Here&apos;s how your store is doing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/deals"
            className="flex items-center gap-1.5 rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-sm font-bold text-on-surface transition-colors hover:border-on-surface"
          >
            <Icon name="local_fire_department" className="text-[18px] text-discount" />
            Live Deals
          </Link>
          <Link
            href="/vendor/products/new"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-body-sm font-bold text-on-primary hover:opacity-90"
          >
            <Icon name="add" className="text-[18px]" />
            New Product
          </Link>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="flex items-start justify-between rounded-2xl border border-outline-variant bg-white p-5">
            <div>
              <p className="text-xl font-extrabold text-on-surface md:text-2xl">{s.value}</p>
              <p className="mt-1 text-body-sm text-on-surface-variant">{s.label}</p>
            </div>
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.tint}`}>
              <Icon name={s.icon} filled />
            </span>
          </div>
        ))}
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-price-gold/40 bg-price-gold/10 p-5">
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

      {/* Shortcuts */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-2xl border border-outline-variant bg-white p-4 transition-all hover:border-transparent hover:shadow-card-lg"
          >
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high text-on-primary-container">
              <Icon name={s.icon} className="text-[20px]" />
            </span>
            <p className="text-body-sm font-bold text-on-surface">{s.title}</p>
            <p className="mt-0.5 line-clamp-1 text-badge-text text-on-surface-variant">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent orders */}
        <section className="rounded-2xl border border-outline-variant bg-white">
          <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
            <h2 className="font-bold text-on-surface">Recent Orders</h2>
            <Link href="/vendor/orders" className="text-body-sm font-bold text-secondary hover:underline">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <Icon name="shopping_bag" className="text-4xl text-on-surface-variant/50" />
              <p className="text-body-sm text-on-surface-variant">No orders yet — sales will appear here as they come in.</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/60 px-6">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-4 py-3.5">
                  <div>
                    <p className="font-semibold text-on-surface">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-badge-text text-on-surface-variant">{formatDate(order.created_at)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                  <p className="font-bold text-on-surface">{formatKES(order.total)}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent products */}
        <section className="rounded-2xl border border-outline-variant bg-white">
          <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
            <h2 className="font-bold text-on-surface">Recent Products</h2>
            <Link href="/vendor/products" className="text-body-sm font-bold text-secondary hover:underline">
              View all
            </Link>
          </div>
          {recentProducts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <Icon name="inventory_2" className="text-4xl text-on-surface-variant/50" />
              <p className="text-body-sm text-on-surface-variant">No products yet.</p>
              <Link href="/vendor/products/new" className="text-body-sm font-bold text-secondary hover:underline">
                Add your first product
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/60 px-6">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="line-clamp-1 font-semibold text-on-surface">{product.name}</p>
                    <p className="text-badge-text text-on-surface-variant">
                      {formatKES(product.price)} · {product.stock_quantity} in stock
                    </p>
                  </div>
                  <StatusBadge status={product.status === "published" ? "delivered" : "pending"} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
