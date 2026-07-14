import { Icon } from "@/components/ui/Icon";
import { TrustpilotRating } from "@/components/home/Trustpilot";

const FEATURES = [
  { icon: "verified_user", label: "12-Month Warranty" },
  { icon: "local_shipping", label: "Free Delivery" },
  { icon: "cached", label: "30-Day Trial" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-outline-variant bg-white">
      <div className="mx-auto flex w-full max-w-container-max flex-col items-center justify-between gap-3 px-margin-mobile py-3.5 md:flex-row md:px-gutter">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex items-center gap-2 text-body-sm font-medium text-on-surface">
              <Icon name={f.icon} className="text-[18px] text-secondary" />
              {f.label}
            </div>
          ))}
        </div>
        <TrustpilotRating />
      </div>
    </section>
  );
}
