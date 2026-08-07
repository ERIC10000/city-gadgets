import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { RepairRequestForm } from "@/components/repair/RepairRequestForm";
import { STORE_ADDRESS } from "@/lib/contact";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gadget Repair in Nairobi — Phones, Laptops, Consoles & Screens",
  description:
    "Fast, genuine gadget repair in Nairobi. Fix cracked screens, batteries, water damage and more on phones, laptops, consoles, gaming pads and TVs. Free diagnosis, free rider pickup, warranty on repairs.",
  alternates: canonical("/repair"),
};

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
    a: "It depends on the device and the fault. Diagnosis is free — once we've assessed it, we send you a clear, fixed quote before any work begins. Nothing is charged until you approve.",
  },
  {
    q: "Do you really pick up from my location?",
    a: "Yes. Choose 'Send a rider' and we'll collect your device free within Nairobi, repair it, and return it to you. Outside Nairobi, we'll arrange a courier option.",
  },
  {
    q: "How long does a repair take?",
    a: "Common repairs like screens and batteries are often done the same day or next day. For parts we need to source, we'll tell you the timeline upfront.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. We never access your personal data unless a repair specifically requires it, and only with your permission. Back up your device before any repair where possible.",
  },
  {
    q: "Do you offer a warranty?",
    a: "Every repair comes with a workmanship warranty. If the same fault returns within the warranty period, we fix it again at no cost.",
  },
];

export default function RepairPage() {
  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-8 md:px-gutter">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Gadget Repair" }]} />

      {/* Hero */}
      <section className="mt-6 overflow-hidden rounded-3xl bg-inverse-surface p-8 text-white md:p-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-badge-text font-bold uppercase tracking-wide backdrop-blur-sm">
          <Icon name="build" className="text-[15px]" />
          Repairs
        </span>
        <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">Broken gadget? We&apos;ll fix it.</h1>
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
      <section className="mt-16 max-w-3xl">
        <h2 className="mb-4 text-2xl font-extrabold text-on-surface md:text-headline-lg">Repair FAQs</h2>
        <div className="divide-y divide-outline-variant rounded-2xl border border-outline-variant bg-white">
          {FAQS.map((f) => (
            <details key={f.q} className="group px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-on-surface">
                {f.q}
                <Icon name="expand_more" className="shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-1 pt-3 text-body-md leading-relaxed text-on-surface-variant">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
