import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { RepairRequestForm } from "@/components/repair/RepairRequestForm";
import { STORE_ADDRESS, WHATSAPP_NUMBERS, whatsappLink } from "@/lib/contact";
import { faqJsonLd } from "@/lib/seo";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gadget Repair in Nairobi — Phones, Laptops, Consoles & Screens",
  description:
    "Fast, genuine gadget repair in Nairobi. Fix cracked screens, batteries, water damage and more on phones, laptops, consoles, gaming pads and TVs. Free diagnosis, free rider pickup, warranty on repairs.",
  alternates: canonical("/repair"),
};

const REPAIR_IMAGE = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80&auto=format&fit=crop";

const STEPS = [
  { icon: "edit_note", title: "Tell us the fault", desc: "Pick your device and what's wrong — takes a minute." },
  { icon: "two_wheeler", title: "Drop off or we collect", desc: "Come to our shop, or a rider picks it up free in Nairobi." },
  { icon: "build", title: "We diagnose & quote", desc: "Free diagnosis, then a clear price before any work starts." },
  { icon: "check_circle", title: "Fixed & returned", desc: "We repair it and hand it back — with a warranty." },
];

const REPAIRS = [
  { icon: "smartphone", label: "Phones" },
  { icon: "laptop_mac", label: "Laptops & MacBooks" },
  { icon: "sports_esports", label: "Consoles" },
  { icon: "stadia_controller", label: "Gaming Pads" },
  { icon: "tablet_mac", label: "Tablets & iPads" },
  { icon: "watch", label: "Smartwatches" },
  { icon: "tv", label: "TV & Monitor Screens" },
  { icon: "headphones", label: "Audio Devices" },
];

const FAULTS = [
  "Cracked & broken screens",
  "Battery replacement",
  "Charging port repair",
  "Water / liquid damage",
  "Won't power on",
  "Software & OS issues",
  "Speaker & mic faults",
  "Camera repair",
  "Overheating",
  "Button & control fixes",
];

const WHY = [
  { icon: "verified", title: "Genuine parts", desc: "Quality components — no cheap knock-offs that fail in weeks." },
  { icon: "shield", title: "Warranty on repairs", desc: "Every fix is backed by a workmanship warranty." },
  { icon: "payments", title: "Free diagnosis", desc: "We assess the fault and quote before you commit — no obligation." },
  { icon: "schedule", title: "Fast turnaround", desc: "Most common repairs are done same-day or next-day." },
];

const FAQS = [
  {
    q: "How much will my repair cost?",
    a: "It depends on the device and the fault. Diagnosis is free — once we've assessed it we send a clear, fixed quote before any work begins, so there are no surprises. Nothing is charged until you approve.",
  },
  {
    q: "What devices and brands do you repair?",
    a: "Phones, laptops and MacBooks, gaming consoles, gaming pads, tablets, smartwatches, TV and monitor screens, and audio gear — across all major brands including Apple, Samsung, Sony, HP, Dell, Lenovo, Tecno and Infinix.",
  },
  {
    q: "Do you use genuine, original parts?",
    a: "Yes. We use genuine or high-grade replacement parts — never the cheap knock-offs that fail within weeks — so your device keeps working the way it should.",
  },
  {
    q: "Do you really pick up from my location?",
    a: "Yes. Choose 'Send a rider' and we'll collect your device free within Nairobi, repair it, and return it to you. Outside Nairobi, we'll arrange a trusted courier option.",
  },
  {
    q: "How long does a repair take?",
    a: "Common repairs like screens and batteries are often done the same day or next day. If we need to source a specific part, we'll tell you the exact timeline upfront.",
  },
  {
    q: "What if my device can't be fixed?",
    a: "If we can't fix it, you don't pay a repair fee — simple. We'll explain why and, where it makes sense, suggest a trade-in or a replacement from our store.",
  },
  {
    q: "Can you fix water damage or recover my data?",
    a: "Often, yes. Switch the device off and bring it in as soon as possible — the sooner we treat liquid damage the better the chances. We can also attempt data recovery where the storage is intact.",
  },
  {
    q: "Is my data safe during the repair?",
    a: "Yes. We never access your personal data unless a repair specifically requires it, and only with your permission. Please back up your device before any repair where possible.",
  },
  {
    q: "Do you repair devices I didn't buy from you?",
    a: "Absolutely. We repair devices no matter where you bought them — you don't need to have purchased from City Gadgets.",
  },
  {
    q: "Do you offer a warranty, and how do I pay?",
    a: "Every repair comes with a workmanship warranty — if the same fault returns within the warranty period, we fix it again free. Pay by M-Pesa, card or cash once you've approved the repair.",
  },
];

export default function RepairPage() {
  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-8 md:px-gutter">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />

      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Gadget Repair" }]} />

      {/* Hero — text on the dark panel, circuit-board image blended on the right */}
      <section className="relative mt-6 overflow-hidden rounded-3xl bg-inverse-surface text-white">
        <Image
          src={REPAIR_IMAGE}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-inverse-surface from-30% via-inverse-surface/95 to-inverse-surface/50 md:to-inverse-surface/10" />
        <div className="relative z-10 max-w-2xl p-8 md:p-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-badge-text font-bold uppercase tracking-wide backdrop-blur-sm">
            <Icon name="build" className="text-[15px]" />
            Repairs
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">Broken gadget? We&apos;ll fix it.</h1>
          <p className="mt-3 max-w-xl text-white/80">
            Cracked screens, dead batteries, water damage and more — on phones, laptops, consoles, gaming pads and TVs.
            Free diagnosis, free Nairobi pickup, and a warranty on every repair.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Free diagnosis", "Free rider pickup", "Genuine parts", "Warranty on repairs"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-badge-text font-semibold backdrop-blur-sm">
                <Icon name="check_circle" filled className="text-[15px] text-whatsapp-green" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-10">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-on-surface md:text-headline-lg">How it works</h2>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-card">
              <span className="absolute right-4 top-4 text-3xl font-extrabold text-outline-variant">{i + 1}</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name={s.icon} filled className="text-[22px]" />
              </span>
              <h3 className="mt-3 font-bold text-on-surface">{s.title}</h3>
              <p className="mt-1 text-body-sm text-on-surface-variant">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Form + supporting info */}
      <section className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RepairRequestForm />
        </div>

        <aside className="space-y-8 lg:col-span-5">
          <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
            <h2 className="font-extrabold text-on-surface">What we repair</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {REPAIRS.map((r) => (
                <span key={r.label} className="flex items-center gap-2 rounded-xl border border-outline-variant bg-white px-3 py-2.5 text-body-sm font-semibold text-on-surface">
                  <Icon name={r.icon} className="text-[18px] text-secondary" />
                  {r.label}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {FAULTS.map((f) => (
                <span key={f} className="rounded-full bg-surface-container-high px-2.5 py-1 text-badge-text font-semibold text-on-surface-variant">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
            <h2 className="font-extrabold text-on-surface">Why City Gadgets</h2>
            <ul className="mt-4 space-y-4">
              {WHY.map((w) => (
                <li key={w.title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container">
                    <Icon name={w.icon} filled className="text-[18px]" />
                  </span>
                  <div>
                    <p className="font-bold text-on-surface">{w.title}</p>
                    <p className="text-body-sm text-on-surface-variant">{w.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-3 rounded-3xl border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
            <Icon name="location_on" filled className="shrink-0 text-secondary" />
            <div className="text-body-sm">
              <p className="font-bold text-on-surface">Visit our shop</p>
              <p className="mt-1 text-on-surface-variant">
                {STORE_ADDRESS.line1}
                <br />
                {STORE_ADDRESS.line2}
                <br />
                {STORE_ADDRESS.line3}
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">Repair FAQs</h2>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Everything you need to know before you send your gadget in. Still unsure? Message us — we&apos;re happy to help.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[FAQS.slice(0, 5), FAQS.slice(5)].map((column, ci) => (
            <div key={ci} className="space-y-4">
              {column.map((f) => (
                <details
                  key={f.q}
                  className="group h-fit rounded-2xl border border-outline-variant bg-white p-5 transition-shadow open:shadow-card"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-on-surface">
                    {f.q}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition-all group-open:rotate-180 group-open:bg-primary group-open:text-white">
                      <Icon name="expand_more" className="text-[18px]" />
                    </span>
                  </summary>
                  <p className="mt-3 text-body-sm leading-relaxed text-on-surface-variant">{f.a}</p>
                </details>
              ))}
            </div>
          ))}
        </div>

        {/* Still have a question — WhatsApp */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 text-center shadow-card sm:flex-row sm:text-left">
          <div>
            <p className="font-bold text-on-surface">Still have a question?</p>
            <p className="text-body-sm text-on-surface-variant">Chat with our repair team on WhatsApp — we usually reply in minutes.</p>
          </div>
          <a
            href={whatsappLink("Hi City Gadgets! I have a question about a repair.", WHATSAPP_NUMBERS[1].raw)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-full bg-whatsapp-green px-6 py-3 font-bold text-white transition-transform hover:scale-[1.02]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Chat with us
          </a>
        </div>
      </section>
    </div>
  );
}
