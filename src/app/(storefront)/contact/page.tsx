import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import {
  OPENING_HOURS,
  SOCIAL_LINKS,
  STORE_ADDRESS,
  STORE_EMAIL,
  WHATSAPP_NUMBERS,
  whatsappLink,
} from "@/lib/contact";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to City Gadgets — WhatsApp our sales or customer relations desk, email us, or visit the shop at New Alnoor Exhibition, Taveta Road, Nairobi CBD.",
  alternates: canonical("/contact"),
};

const SOCIAL_GLYPH: Record<(typeof SOCIAL_LINKS)[number]["id"], (p: { className?: string }) => React.ReactElement> = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
};

/** A Maps search link — no API key, no embed, works on every device. */
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `City Gadgets, ${STORE_ADDRESS.full}`,
)}`;

/** Prefilled openers so each desk receives a message it can act on. */
const DESK_OPENER: Record<string, string> = {
  "Sales Executive": "Hi City Gadgets! I have a question about a product I'd like to buy.",
  "Customer Relations": "Hi City Gadgets! I need help with an existing order or a warranty claim.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-8 md:px-gutter">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact Us" }]} />

      <header className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-extrabold text-on-surface md:text-4xl">Talk to us</h1>
        <p className="mt-3 text-body-md text-on-surface-variant">
          WhatsApp is the fastest way to reach us and the way most of our customers buy. Pick the
          desk that fits and you&apos;ll get a person, not a ticket number.
        </p>
      </header>

      {/* ---------------- desks ---------------- */}
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {WHATSAPP_NUMBERS.map((n) => (
          <Link
            key={n.raw}
            href={whatsappLink(DESK_OPENER[n.role] ?? "Hi City Gadgets!", n.raw)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-outline-variant bg-white p-6 transition-all hover:border-whatsapp-green hover:shadow-card"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-whatsapp-green/10">
                <WhatsAppIcon className="h-6 w-6 text-whatsapp-green" />
              </span>
              <Icon
                name="arrow_outward"
                className="text-on-surface-variant transition-transform group-hover:-translate-y-0.5 group-hover:text-whatsapp-green"
              />
            </div>
            <h2 className="mt-5 text-lg font-extrabold text-on-surface">{n.role}</h2>
            <p className="mt-1 text-body-sm text-on-surface-variant">{n.blurb}</p>
            <p className="mt-4 font-mono text-body-sm font-bold text-whatsapp-green">{n.display}</p>
          </Link>
        ))}
      </section>

      {/* ---------------- other channels ---------------- */}
      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-outline-variant bg-white p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-high text-secondary">
            <Icon name="mail" />
          </span>
          <h2 className="mt-4 font-bold text-on-surface">Email</h2>
          <p className="mt-1.5 text-body-sm text-on-surface-variant">
            Best for anything you need in writing — invoices, bulk orders, warranty paperwork.
          </p>
          <a
            href={`mailto:${STORE_EMAIL}`}
            className="mt-3 inline-block break-all text-body-sm font-semibold text-on-surface underline underline-offset-4 transition-colors hover:text-secondary"
          >
            {STORE_EMAIL}
          </a>
        </div>

        <div className="rounded-2xl border border-outline-variant bg-white p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-high text-secondary">
            <Icon name="storefront" />
          </span>
          <h2 className="mt-4 font-bold text-on-surface">Visit the shop</h2>
          <p className="mt-1.5 text-body-sm leading-relaxed text-on-surface-variant">
            {STORE_ADDRESS.line1}
            <br />
            {STORE_ADDRESS.line2}
            <br />
            {STORE_ADDRESS.line3}
          </p>
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-body-sm font-semibold text-on-surface underline underline-offset-4 transition-colors hover:text-secondary"
          >
            Open in Google Maps
            <Icon name="arrow_outward" className="text-[15px]" />
          </a>
        </div>

        <div className="rounded-2xl border border-outline-variant bg-white p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-high text-secondary">
            <Icon name="schedule" />
          </span>
          <h2 className="mt-4 font-bold text-on-surface">Opening hours</h2>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-body-sm">
            {OPENING_HOURS.map((h) => (
              <div key={h.label} className="contents">
                <dt className="text-on-surface-variant">{h.label}</dt>
                <dd className={h.open ? "font-semibold text-on-surface" : "text-on-surface-variant/60"}>
                  {h.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- socials ---------------- */}
      <section className="mt-4 rounded-2xl bg-inverse-surface p-7 text-white">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-bold text-price-gold">Follow the new stock</h2>
            <p className="mt-1.5 text-body-sm text-white/70">
              New arrivals, unboxings and deals land on our socials first.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {SOCIAL_LINKS.map((s) => {
              const Glyph = SOCIAL_GLYPH[s.id];
              return (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-full border border-price-gold/40 px-4 py-2.5 text-body-sm font-semibold text-price-gold transition-all hover:bg-price-gold hover:text-inverse-surface"
                >
                  <Glyph className="h-4 w-4" />
                  {s.handle}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- quick routes ---------------- */}
      <section className="mt-10">
        <h2 className="text-lg font-extrabold text-on-surface">Looking for something specific?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { href: "/account/orders", icon: "local_shipping", title: "Track an order", sub: "See where your delivery is" },
            { href: "/sell", icon: "swap_horiz", title: "Sell or trade in", sub: "Get a quote in minutes" },
            { href: "/shop", icon: "shopping_bag", title: "Browse the shop", sub: "Everything currently in stock" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3.5 rounded-2xl border border-outline-variant bg-white p-5 transition-colors hover:border-on-surface"
            >
              <Icon name={l.icon} className="shrink-0 text-secondary" />
              <span>
                <span className="block text-body-sm font-bold text-on-surface">{l.title}</span>
                <span className="block text-badge-text text-on-surface-variant">{l.sub}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
