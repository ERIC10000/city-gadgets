import { IconBadge } from "@/components/ui/IconBadge";

const ITEMS = [
  { icon: "payments", tone: "mpesa" as const, title: "Secure M-Pesa", copy: "Fast and reliable payments locally." },
  { icon: "verified", tone: "primary" as const, title: "Genuine Products", copy: "100% authentic tech with warranty." },
  { icon: "local_shipping", tone: "secondary" as const, title: "Same-Day Delivery", copy: "Order by 12 PM for doorstep delivery." },
];

export function TrustBanner() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto grid w-full max-w-container-max grid-cols-1 gap-6 px-margin-mobile md:grid-cols-3 md:px-gutter">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-6">
            <IconBadge icon={item.icon} tone={item.tone} />
            <div>
              <h4 className="font-bold text-on-surface">{item.title}</h4>
              <p className="text-body-sm text-on-surface-variant">{item.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
