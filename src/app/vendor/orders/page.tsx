import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatKES } from "@/lib/format";
import { getAllOrders } from "@/lib/data/orders";
import { updateOrderStatus } from "@/lib/actions/vendor-orders";
import type { OrderStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Orders" };

const STATUS_OPTIONS: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

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
        <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-card">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant text-body-sm text-on-surface-variant">
              <tr>
                <th className="px-5 py-4 font-semibold">Order ID</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Items</th>
                <th className="px-5 py-4 font-semibold">Total</th>
                <th className="px-5 py-4 font-semibold">Payment</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-body-sm text-on-surface-variant">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">{formatDate(order.created_at)}</td>
                  <td className="px-5 py-4 text-on-surface-variant">{order.items?.length ?? 0} item(s)</td>
                  <td className="px-5 py-4 font-bold text-on-surface">{formatKES(order.total)}</td>
                  <td className="px-5 py-4 capitalize text-on-surface-variant">{order.payment_method ?? "—"}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-4">
                    <form action={updateOrderStatus} className="flex justify-end">
                      <input type="hidden" name="id" value={order.id} />
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="rounded-lg border border-outline-variant bg-surface px-3 py-1.5 text-body-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) => e.currentTarget.form?.requestSubmit()}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="capitalize">
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </form>
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
