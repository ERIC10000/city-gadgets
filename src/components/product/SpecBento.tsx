import { Icon } from "@/components/ui/Icon";

const ICON_FOR_KEY: Record<string, string> = {
  storage: "storage",
  connectivity: "wifi",
  connection: "cable",
  resolution: "monitor",
  display: "monitor",
  chip: "memory",
  memory: "memory",
  "battery life": "battery_full",
  "water resistance": "water_drop",
  type: "category",
  warranty: "verified_user",
  compatibility: "devices",
  remote: "settings_remote",
  "video resolution": "videocam",
  stabilization: "vibration",
};

export function SpecBento({ specs }: { specs: Record<string, string> }) {
  const entries = Object.entries(specs).slice(0, 4);
  if (entries.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-start gap-3 rounded-xl bg-surface-container-low p-4">
          <Icon name={ICON_FOR_KEY[key.toLowerCase()] ?? "info"} className="text-primary" />
          <div>
            <p className="text-badge-text font-semibold uppercase tracking-wide text-on-surface-variant">{key}</p>
            <p className="text-body-sm font-bold text-on-surface">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
