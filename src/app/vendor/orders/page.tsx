import { Icon } from "@/components/ui/Icon";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Orders</h1>
          <p className="text-on-surface-variant">View and manage customer orders.</p>
        </div>
      </div>
      <div className="rounded-xl bg-surface p-8 shadow-card text-center">
        <Icon name="shopping_bag" className="text-4xl text-outline mb-4" />
        <h3 className="text-lg font-bold">No orders yet</h3>
        <p className="text-on-surface-variant">Orders placed by customers will appear here.</p>
      </div>
    </div>
  );
}
