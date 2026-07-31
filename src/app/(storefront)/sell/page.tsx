import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { SellDeviceForm } from "@/components/sell/SellDeviceForm";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { OPENING_HOURS, STORE_ADDRESS, whatsappLink } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Sell Your Device",
  description:
    "Trade in your phone, laptop, console or camera at City Gadgets Nairobi. Get an instant WhatsApp quote and same-day payment via M-Pesa.",
};

const STEPS = [
  {
    icon: "chat",
    title: "Get a quote",
    desc: "Tell us what you're selling. We reply on WhatsApp within minutes — no account, no waiting.",
  },
  {
    icon: "storefront",
    title: "Drop off or pickup",
    desc: `Visit us at ${STORE_ADDRESS.line1}, ${STORE_ADDRESS.line2}, or we arrange a rider to collect.`,
  },
  {
    icon: "payments",
    title: "Paid instantly",
    desc: "Device checked on the spot — money hits your M-Pesa the same day, or take it as store credit.",
  },
];

const TRUST = [
  { icon: "verified", text: "Fair market valuations", sub: "Priced against what the device really sells for" },
  { icon: "bolt", text: "Same-day M-Pesa payment", sub: "No waiting for a bank transfer to clear" },
  { icon: "shield_lock", text: "Certified data wipe", sub: "Every device is wiped before it moves on" },
  { icon: "handshake", text: "Trade-in toward anything", sub: "Put the value straight into your next device" },
];

const ACCEPTED = [
  { icon: "smartphone", label: "Phones" },
  { icon: "laptop_mac", label: "Laptops" },
  { icon: "tablet_mac", label: "Tablets" },
  { icon: "watch", label: "Watches" },
  { icon: "sports_esports", label: "Consoles" },
  { icon: "photo_camera", label: "Cameras" },
  { icon: "headphones", label: "Audio" },
  { icon: "devices_other", label: "More" },
];

const FAQS = [
  {
    q: "How long does a quote take?",
    a: "We reply on WhatsApp within minutes during opening hours. Outside them, leave the message and we answer first thing.",
  },
  {
    q: "Do you buy faulty or cracked devices?",
    a: "Yes. Select Faulty on the form and describe the issue — a cracked screen or worn battery lowers the offer but doesn't rule the device out.",
  },
  {
    q: "How do I get paid?",
    a: "Same-day M-Pesa once the device is checked, or take the value as store credit toward anything in the shop.",
  },
  {
    q: "Is my data safe?",
    a: "Every device we take in gets a certified data wipe before it goes anywhere. You're welcome to factory-reset it yourself first.",
  },
  {
    q: "Can I trade in toward a new device?",
    a: "Yes — trade-in value can go straight onto anything in store, so you only pay the difference.",
  },
  {
    q: "Where are you located?",
    a: `${STORE_ADDRESS.full}. ${OPENING_HOURS.map((h) => `${h.label}: ${h.value}`).join(" · ")}.`,
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function SellPage() {
  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-8 md:px-gutter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Sell Your Device" }]} />

      {/* ---------------- hero ---------------- */}
      <section className="mint-gradient relative mt-6 overflow-hidden rounded-3xl px-7 py-11 md:px-14 md:py-16">
        {/* Soft device cluster, replaces the single oversized glyph */}
        <div className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 lg:block" aria-hidden="true">
          <div className="relative h-72 w-72">
            <span className="absolute left-6 top-4 flex h-28 w-28 rotate-[-8deg] items-center justify-center rounded-3xl bg-white/45 backdrop-blur-sm">
              <Icon name="smartphone" className="text-[52px] text-on-surface/45" />
            </span>
            <span className="absolute right-4 top-14 flex h-36 w-36 rotate-[7deg] items-center justify-center rounded-3xl bg-white/40 backdrop-blur-sm">
              <Icon name="laptop_mac" className="text-[64px] text-on-surface/40" />
            </span>
            <span className="absolute bottom-3 left-16 flex h-24 w-24 rotate-[4deg] items-center justify-center rounded-3xl bg-white/50 backdrop-blur-sm">
              <Icon name="sports_esports" className="text-[44px] text-on-surface/45" />
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 text-badge-text font-bold uppercase tracking-wide text-on-surface">
            <Icon name="swap_horiz" className="text-[15px]" />
            Trade-in · Instant M-Pesa
          </span>
          <h1 className="mt-3.5 text-3xl font-extrabold leading-tight text-on-surface md:text-5xl">
            Sell your device. Get paid today.
          </h1>
          <p className="mt-4 text-body-md text-on-surface/70">
            Phones, laptops, consoles, cameras and more — upgrade your tech and turn the old one into
            cash or store credit.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {["Quote in minutes", "Paid same day", "Any brand", "Faulty devices welcome"].map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-1.5 text-badge-text font-semibold text-on-surface"
              >
                <Icon name="check_circle" filled className="text-[14px] text-whatsapp-green" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- accepted devices ---------------- */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-outline-variant bg-white">
        <div className="flex items-center gap-2 border-b border-outline-variant px-5 py-3">
          <Icon name="inventory_2" className="text-[18px] text-on-surface-variant" />
          <h2 className="text-body-sm font-bold text-on-surface">What we buy</h2>
        </div>
        <ul className="grid grid-cols-4 divide-x divide-outline-variant sm:grid-cols-8">
          {ACCEPTED.map((a) => (
            <li key={a.label} className="flex flex-col items-center gap-1.5 px-2 py-4">
              <Icon name={a.icon} className="text-[22px] text-on-surface-variant" />
              <span className="text-badge-text font-semibold text-on-surface">{a.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- form + supporting rail ----------------
          The form is the conversion action, so on mobile it comes first;
          on desktop it sits in the right column where the eye lands last. */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <SellDeviceForm />
          </div>
        </div>

        <div className="order-2 space-y-6 lg:order-1">
          {/* Steps as a connected timeline — the numbers are a real sequence */}
          <div className="rounded-2xl border border-outline-variant bg-white p-6">
            <h2 className="text-body-sm font-bold uppercase tracking-wide text-on-surface-variant">
              How it works
            </h2>
            <ol className="relative mt-5">
              <span
                className="absolute bottom-6 left-[19px] top-6 w-px bg-outline-variant"
                aria-hidden="true"
              />
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-white text-on-surface">
                    <Icon name={s.icon} className="text-[20px]" />
                  </span>
                  <div className="pt-1">
                    <p className="font-bold text-on-surface">
                      <span className="text-on-surface-variant">{i + 1}.</span> {s.title}
                    </p>
                    <p className="mt-1 text-body-sm leading-relaxed text-on-surface-variant">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Why sell here */}
          <div className="rounded-2xl bg-inverse-surface p-6 text-white">
            <h2 className="mb-5 font-bold text-price-gold">Why sell to City Gadgets?</h2>
            <ul className="space-y-4">
              {TRUST.map((t) => (
                <li key={t.text} className="flex items-start gap-3">
                  <Icon name={t.icon} className="mt-0.5 shrink-0 text-[20px] text-price-gold" />
                  <div>
                    <p className="text-body-sm font-bold text-white">{t.text}</p>
                    <p className="text-badge-text text-white/60">{t.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit us */}
          <div className="rounded-2xl border border-outline-variant bg-white p-6">
            <h2 className="text-body-sm font-bold uppercase tracking-wide text-on-surface-variant">
              Prefer to walk in?
            </h2>
            <div className="mt-4 flex items-start gap-3">
              <Icon name="location_on" className="mt-0.5 shrink-0 text-secondary" />
              <p className="text-body-sm text-on-surface">
                {STORE_ADDRESS.line1}
                <br />
                {STORE_ADDRESS.line2}
                <br />
                {STORE_ADDRESS.line3}
              </p>
            </div>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 border-t border-outline-variant pt-4 text-body-sm">
              {OPENING_HOURS.map((h) => (
                <div key={h.label} className="contents">
                  <dt className="text-on-surface-variant">{h.label}</dt>
                  <dd className={h.open ? "text-on-surface" : "text-on-surface-variant/60"}>{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* FAQ — also feeds FAQPage structured data above */}
          <div className="rounded-2xl border border-outline-variant bg-white p-6">
            <h2 className="text-body-sm font-bold uppercase tracking-wide text-on-surface-variant">
              Common questions
            </h2>
            <div className="mt-3 divide-y divide-outline-variant">
              {FAQS.map((f) => (
                <details key={f.q} className="group py-3.5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-body-sm font-semibold text-on-surface marker:hidden">
                    {f.q}
                    <Icon
                      name="expand_more"
                      className="shrink-0 text-[20px] text-on-surface-variant transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-2 text-body-sm leading-relaxed text-on-surface-variant">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile helper — the form is above, this covers people who scrolled past */}
      <a
        href={whatsappLink("Hi City Gadgets! I have a question about selling my device.")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 flex items-center justify-center gap-2 rounded-full border border-outline-variant bg-white px-6 py-3.5 text-body-sm font-bold text-on-surface transition-colors hover:border-whatsapp-green hover:text-whatsapp-green lg:hidden"
      >
        <WhatsAppIcon className="h-4 w-4 text-whatsapp-green" />
        Rather just ask a question?
      </a>
    </div>
  );
}
