import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { SellDeviceForm } from "@/components/sell/SellDeviceForm";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Sell Your Device",
  description:
    "Trade in your phone, laptop, console or camera at City Gadgets Nairobi. Get an instant WhatsApp quote and same-day payment via M-Pesa.",
};

const STEPS = [
  { icon: "request_quote", title: "1 · Get a quote", desc: "Tell us what you're selling — we reply on WhatsApp within minutes." },
  { icon: "storefront", title: "2 · Drop off or pickup", desc: "Visit Gadget Plaza, Nairobi CBD, or we arrange a rider pickup." },
  { icon: "payments", title: "3 · Paid instantly", desc: "Device checked on the spot — money hits your M-Pesa same day." },
];

const TRUST = [
  { icon: "verified", text: "Fair market valuations" },
  { icon: "bolt", text: "Same-day M-Pesa payment" },
  { icon: "recycling", text: "Certified data wipe on every device" },
  { icon: "handshake", text: "Trade-in toward anything in store" },
];

export default function SellPage() {
  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-8 md:px-gutter">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Sell Your Device" }]} />

      <div className="mint-gradient relative mt-6 overflow-hidden rounded-3xl px-8 py-12 md:px-14 md:py-16">
        <div className="relative z-10 max-w-xl">
          <span className="mb-3 inline-block rounded-full bg-white/50 px-3 py-1 text-badge-text font-bold uppercase tracking-wide text-on-surface">
            Trade-in · Instant M-Pesa
          </span>
          <h1 className="text-3xl font-extrabold leading-tight text-on-surface md:text-5xl">
            Sell your device. Get paid today.
          </h1>
          <p className="mt-4 text-body-md text-on-surface/70">
            Phones, laptops, consoles, cameras and more — upgrade your tech and turn the old one into cash or store credit.
          </p>
        </div>
        <Icon
          name="currency_exchange"
          className="pointer-events-none absolute -bottom-8 -right-6 text-[180px] text-white/40 md:text-[240px]"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-4">
            {STEPS.map((s) => (
              <div key={s.title} className="flex items-start gap-4 rounded-2xl border border-outline-variant bg-white p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-on-primary-container">
                  <Icon name={s.icon} />
                </span>
                <div>
                  <p className="font-bold text-on-surface">{s.title}</p>
                  <p className="text-body-sm text-on-surface-variant">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-inverse-surface p-6 text-white">
            <h3 className="mb-4 font-bold text-price-gold">Why sell to City Gadgets?</h3>
            <ul className="space-y-3">
              {TRUST.map((t) => (
                <li key={t.text} className="flex items-center gap-3 text-body-sm text-white/80">
                  <Icon name={t.icon} className="text-price-gold" />
                  {t.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <SellDeviceForm />
      </div>
    </div>
  );
}
