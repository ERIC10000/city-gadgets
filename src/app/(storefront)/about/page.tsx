import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { OPENING_HOURS, STORE_ADDRESS, whatsappLink } from "@/lib/contact";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "City Gadgets is a Nairobi CBD electronics retailer selling genuine phones, laptops, gaming and audio — every device checked in-house, backed by a 12-month warranty and same-day delivery.",
  alternates: canonical("/about"),
};

/**
 * NOTE FOR THE CLIENT
 * Everything on this page is a claim the site already makes elsewhere
 * (warranty, sourcing, delivery, payment, trade-in). Nothing has been
 * invented. The obvious additions — the year the shop opened, who founded
 * it, how many devices you've sold — would strengthen it considerably, but
 * they have to come from you. Send them over and they slot into the
 * "Our story" block below.
 */

const PRINCIPLES = [
  {
    icon: "fact_check",
    title: "Every device is checked",
    body: "Stock is sourced and inspected in Nairobi before it reaches the shelf. Devices are graded honestly — if something is refurbished, the listing says so.",
  },
  {
    icon: "verified_user",
    title: "12 months of warranty",
    body: "Every order carries a 12-month warranty, battery included. If something fails inside that window, you talk to a person here, not an overseas support queue.",
  },
  {
    icon: "payments",
    title: "Pay the way Kenya pays",
    body: "M-Pesa at checkout, and a real conversation on WhatsApp before it if you'd rather ask first. No account required to buy.",
  },
  {
    icon: "local_shipping",
    title: "Same-day in Nairobi",
    body: "Free same-day delivery across Nairobi, or collect from the shop in the CBD. Countrywide delivery is arranged on request.",
  },
  {
    icon: "swap_horiz",
    title: "Your old device has value",
    body: "Trade in a phone, laptop, console or camera and put the value straight toward the next one. Faulty devices are still worth something.",
  },
  {
    icon: "shield_lock",
    title: "Data handled properly",
    body: "Every device taken in trade gets a certified wipe before it moves on. Nothing of yours travels with it.",
  },
];

const CATEGORIES = [
  { slug: "phones", label: "Smartphones", icon: "smartphone" },
  { slug: "macbooks", label: "Laptops & MacBooks", icon: "laptop_mac" },
  { slug: "tablets", label: "Tablets & iPads", icon: "tablet_mac" },
  { slug: "wearables", label: "Smartwatches", icon: "watch" },
  { slug: "audio", label: "Audio", icon: "headphones" },
  { slug: "consoles", label: "Gaming", icon: "sports_esports" },
  { slug: "cameras", label: "Cameras", icon: "photo_camera" },
  { slug: "accessories", label: "Accessories", icon: "cable" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-8 md:px-gutter">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About Us" }]} />

      {/* ---------------- hero ---------------- */}
      <section className="hero-gradient relative mt-6 overflow-hidden rounded-3xl px-7 py-12 md:px-14 md:py-16">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/50 px-3 py-1 text-badge-text font-bold uppercase tracking-wide text-on-surface">
            <Icon name="storefront" className="text-[15px]" />
            Nairobi CBD
          </span>
          <h1 className="mt-3.5 text-3xl font-extrabold leading-tight text-on-surface md:text-5xl">
            Genuine tech, honestly priced.
          </h1>
          <p className="mt-4 max-w-xl text-body-md text-on-surface/70">
            City Gadgets is an electronics retailer in the Nairobi CBD. We sell phones, laptops,
            consoles, cameras and audio — checked in-house, warranted for twelve months, and
            delivered the same day.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-on-surface px-6 py-3 text-body-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              Browse the shop
              <Icon name="arrow_forward" className="text-[18px]" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-on-surface/20 bg-white/60 px-6 py-3 text-body-sm font-bold text-on-surface transition-colors hover:bg-white"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- story ---------------- */}
      <section className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-extrabold text-on-surface">Our story</h2>
          <div className="mt-4 space-y-4 text-body-md leading-relaxed text-on-surface-variant">
            <p>
              Buying a phone or a laptop in Nairobi usually means one of two things: paying full
              retail at a formal store, or taking a chance on a listing with no warranty and no
              comeback if it fails. Neither is a good deal.
            </p>
            <p>
              City Gadgets exists in between. We source genuine stock, inspect it before it goes on
              sale, price it well below retail, and stand behind it with a twelve-month warranty.
              You can talk to a person on WhatsApp before you buy, pay with M-Pesa, and have the
              device the same day — or walk into the shop on Taveta Road and see it yourself.
            </p>
            <p>
              We also buy devices back. Trading in a phone, laptop, console or camera puts real
              value toward your next one, and even faulty devices are worth something.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-inverse-surface p-7 text-white">
            <h3 className="font-bold text-price-gold">Visit the shop</h3>
            <div className="mt-5 flex items-start gap-3">
              <Icon name="location_on" className="mt-0.5 shrink-0 text-price-gold" />
              <p className="text-body-sm leading-relaxed text-white/85">
                {STORE_ADDRESS.line1}
                <br />
                {STORE_ADDRESS.line2}
                <br />
                {STORE_ADDRESS.line3}
              </p>
            </div>
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 border-t border-white/15 pt-5 text-body-sm">
              {OPENING_HOURS.map((h) => (
                <div key={h.label} className="contents">
                  <dt className="text-white/60">{h.label}</dt>
                  <dd className={h.open ? "text-white" : "text-white/40"}>{h.value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={whatsappLink("Hi City Gadgets! I'd like to visit the shop.")}
              target="_blank"
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-whatsapp-green px-5 py-3 text-body-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Ask us anything
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- how we work ---------------- */}
      <section className="mt-14">
        <h2 className="text-2xl font-extrabold text-on-surface">How we work</h2>
        <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
          Six commitments that apply to every order, whether it&apos;s a KSh 3,000 accessory or a
          flagship laptop.
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="rounded-2xl border border-outline-variant bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-high text-secondary">
                <Icon name={p.icon} />
              </span>
              <h3 className="mt-4 font-bold text-on-surface">{p.title}</h3>
              <p className="mt-2 text-body-sm leading-relaxed text-on-surface-variant">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- what we stock ---------------- */}
      <section className="mt-14">
        <h2 className="text-2xl font-extrabold text-on-surface">What we stock</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-outline-variant bg-white p-5 text-center transition-colors hover:border-on-surface"
            >
              <Icon name={c.icon} className="text-[26px] text-on-surface-variant transition-colors group-hover:text-on-surface" />
              <span className="text-body-sm font-semibold text-on-surface">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- cta ---------------- */}
      <section className="mint-gradient mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl px-8 py-10 md:flex-row md:items-center md:px-12">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface">Upgrading soon?</h2>
          <p className="mt-2 max-w-md text-body-md text-on-surface/70">
            Trade in what you&apos;re using now and put the value straight toward the next one.
          </p>
        </div>
        <Link
          href="/sell"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-on-surface px-7 py-3.5 text-body-sm font-bold text-white transition-transform hover:scale-[1.02]"
        >
          Get a trade-in quote
          <Icon name="arrow_forward" className="text-[18px]" />
        </Link>
      </section>
    </div>
  );
}
