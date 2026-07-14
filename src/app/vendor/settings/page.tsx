import { Icon } from "@/components/ui/Icon";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Settings</h1>
          <p className="text-on-surface-variant">Configure global store settings and contact info.</p>
        </div>
      </div>
      <div className="rounded-xl bg-surface p-8 shadow-card text-center">
        <Icon name="settings" className="text-4xl text-outline mb-4" />
        <h3 className="text-lg font-bold">Store Configuration</h3>
        <p className="text-on-surface-variant">Update WhatsApp numbers, store name, and other preferences.</p>
      </div>
    </div>
  );
}
