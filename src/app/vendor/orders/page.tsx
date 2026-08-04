import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { OrdersTable } from "@/components/vendor/OrdersTable";
import { getAllOrders } from "@/lib/data/orders";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage() {
  const orders = await getAllOrders();

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">Orders</h1>
        <p className="text-on-surface-variant">Manage and fulfil customer orders.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total, icon: "shopping_bag", color: "text-primary" },
          { label: "Pending", value: stats.pending, icon: "hourglass_empty", color: "text-on-surface-variant" },
          { label: "Shipped", value: stats.shipped, icon: "local_shipping", color: "text-secondary" },
          { label: "Delivered", value: stats.delivered, icon: "check_circle", color: "text-m-pesa-green" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-surface-container-lowest p-5 shadow-card">
            <Icon name={s.icon} filled className={`mb-2 ${s.color}`} />
            <p className="text-2xl font-extrabold text-on-surface">{s.value}</p>
            <p className="text-body-sm text-on-surface-variant">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-lowest py-20 text-center shadow-card">
          <Icon name="shopping_bag" className="text-4xl text-on-surface-variant" />
          <p className="font-bold text-on-surface">No orders yet</p>
          <p className="text-body-sm text-on-surface-variant">Orders placed by customers will appear here.</p>
        </div>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  );
}
