import { Icon } from "@/components/ui/Icon";

export default function DealsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Deals & Banners</h1>
          <p className="text-on-surface-variant">Select products for the Top Deals section and manage homepage banners.</p>
        </div>
      </div>
      <div className="rounded-xl bg-surface p-8 shadow-card text-center">
        <Icon name="local_offer" className="text-4xl text-outline mb-4" />
        <h3 className="text-lg font-bold">Featured Deals Setup</h3>
        <p className="text-on-surface-variant">Configure your promotions and featured products.</p>
      </div>
    </div>
  );
}
