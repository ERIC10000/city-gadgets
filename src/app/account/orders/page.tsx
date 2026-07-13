import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatKES } from "@/lib/format";
import { getCurrentUser } from "@/lib/data/auth";
import { getOrdersForUser } from "@/lib/data/orders";

export const metadata: Metadata = { title: "Order History" };

export default async function OrdersPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const orders = await getOrdersForUser(current.profile.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">Order History</h1>
        <p className="text-on-surface-variant">Every order you&apos;ve placed with City Gadgets.</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-low py-20 text-center">
          <Icon name="shopping_bag" className="text-4xl text-on-surface-variant" />
          <p className="font-bold text-on-surface">No orders yet</p>
          <p className="text-body-sm text-on-surface-variant">Your purchase history will appear here.</p>
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
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-4 font-mono text-body-sm font-bold text-on-surface">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-5 py-4 text-body-sm text-on-surface-variant">{formatDate(order.created_at)}</td>
                  <td className="px-5 py-4 text-body-sm text-on-surface-variant">{order.items?.length ?? 0} item(s)</td>
                  <td className="px-5 py-4 font-bold text-on-surface">{formatKES(order.total)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
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
