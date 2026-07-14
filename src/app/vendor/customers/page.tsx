import { Icon } from "@/components/ui/Icon";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Customers</h1>
          <p className="text-on-surface-variant">View customer accounts and manage permissions.</p>
        </div>
      </div>
      <div className="rounded-xl bg-surface p-8 shadow-card text-center">
        <Icon name="group" className="text-4xl text-outline mb-4" />
        <h3 className="text-lg font-bold">Customer Directory</h3>
        <p className="text-on-surface-variant">Manage your registered users.</p>
      </div>
    </div>
  );
}
