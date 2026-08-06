import type { ProductQuery } from "@/lib/data/products";

/**
 * Buying guides — evergreen, SEO-targeted editorial content.
 *
 * These live in code (not the DB): they're editorial, rarely change, and this
 * keeps them statically generated and fast. Crucially each guide carries a
 * `productQuery` rather than hard-coded prices, so the page renders a LIVE
 * grid from the catalog — the advice stays fixed while prices/stock stay
 * current, and every guide funnels straight to buyable products.
 */
export type Guide = {
  slug: string;
  title: string;
  /** Meta description + Article schema description. */
  description: string;
  /** Short summary shown on the index cards. */
  excerpt: string;
  /** Category this guide funnels into (breadcrumb + "shop all" CTA). */
  categorySlug: string;
  /** Verified hero photo (attached from HERO_IMAGE so bodies stay clean). */
  heroImage: string;
  /** Live products shown inside the guide. */
  productQuery: ProductQuery;
  /** Heading above the live product grid. */
  picksHeading: string;
  updatedAt: string; // ISO date
  readMinutes: number;
  /** Markdown body (rendered with the shared RichText renderer). */
  body: string;
};

const GUIDES: Omit<Guide, "heroImage">[] = [
  {
    slug: "best-phones-under-20000-in-kenya",
    title: "Best Phones Under KSh 20,000 in Kenya (2026)",
    description:
      "The best phones under KSh 20,000 in Kenya for 2026 — what to look for in battery, RAM and storage, plus genuine budget phones in stock with warranty and free Nairobi delivery.",
    excerpt: "Big batteries, smooth screens and real storage — how to pick the best budget phone, plus live picks under KSh 20,000.",
    categorySlug: "phones",
    productQuery: { categorySlug: "phones", maxPrice: 20000, sort: "price-asc", limit: 9 },
    picksHeading: "Phones under KSh 20,000 in stock now",
    updatedAt: "2026-08-06",
    readMinutes: 4,
    body: `Looking for the best phone under KSh 20,000 in Kenya? The budget segment has never been stronger — Samsung, Tecno, Infinix, Xiaomi (Redmi) and Realme now pack big batteries, smooth 90Hz+ screens and genuinely good cameras into this price band.

## What to look for under KSh 20,000

- **Battery:** aim for 5,000mAh — it comfortably survives a full day of WhatsApp, M-Pesa and YouTube.
- **RAM:** 4GB is the practical minimum; 6GB or more keeps apps snappy.
- **Storage:** 128GB so you're not deleting photos every week — a microSD slot is a bonus.
- **Display:** a 90Hz or 120Hz screen feels noticeably smoother when scrolling.
- **Network:** every phone we stock supports 4G on Safaricom and Airtel.

## Our tip

Spend right at the top of your budget on **battery and storage** rather than chasing megapixels. A 5,000mAh, 128GB phone will serve you far longer than a slim phone with a big camera number on the box.

Every phone below is 100% genuine, comes with a 12-month warranty, and qualifies for free same-day delivery in Nairobi. Prices are live and update automatically.`,
  },
  {
    slug: "iphone-price-in-kenya",
    title: "iPhone Price in Kenya (2026): Live Price List & Where to Buy",
    description:
      "How much is an iPhone in Kenya in 2026? A live iPhone price list across models and storage, new vs refurbished advice, and genuine iPhones with 12-month warranty and free Nairobi delivery.",
    excerpt: "A live iPhone price list for Kenya, plus how to choose the right model and whether to go new or refurbished.",
    categorySlug: "phones",
    productQuery: { categorySlug: "phones", brands: ["Apple"], sort: "price-desc", limit: 12 },
    picksHeading: "iPhone prices in Kenya — in stock now",
    updatedAt: "2026-08-06",
    readMinutes: 5,
    body: `How much is an iPhone in Kenya in 2026? It depends on the model, the storage, and whether you buy brand-new or certified refurbished. The list below is **live** — prices update automatically as stock and pricing change, so you're never looking at a stale number.

## Which iPhone is right for you?

- **Older / refurbished Pro models:** the smart-money pick — flagship performance for far less.
- **iPhone 15 / 16 (standard):** the sweet spot for most buyers — excellent cameras and all-day battery.
- **Pro & Pro Max:** for photographers, gamers and anyone who wants the best screen and zoom.

## New vs refurbished

A **certified refurbished** iPhone is fully tested, restored and warrantied — you save a lot versus brand-new with no drop in everyday experience. If you want the newest model sealed in the box, go new. Either way, every unit we sell is genuine Apple hardware with a 12-month warranty. See our full [new vs refurbished guide](/guides/new-vs-refurbished-phones-kenya).

All iPhones below are genuine, warrantied and delivered free same-day in Nairobi — pay with M-Pesa, card or on delivery.`,
  },
  {
    slug: "best-gaming-laptops-in-kenya",
    title: "Best Gaming Laptops in Kenya (2026): Buyer's Guide",
    description:
      "Best gaming laptops in Kenya for 2026 — the GPU, CPU, RAM and display specs that matter, how much to spend, and genuine laptops in stock with warranty and free Nairobi delivery.",
    excerpt: "The specs that actually matter for gaming, how much to spend, and top laptops in stock right now.",
    categorySlug: "macbooks",
    productQuery: { categorySlug: "macbooks", sort: "price-desc", limit: 9 },
    picksHeading: "Top laptops in stock now",
    updatedAt: "2026-08-06",
    readMinutes: 4,
    body: `The best gaming laptop in Kenya is the one that matches the games you actually play and the budget you actually have. Here's how to choose in 2026.

## The specs that matter

- **GPU is king:** an RTX 4050/4060 handles most modern titles at high settings; 4070 and up for 1440p and streaming.
- **CPU:** a recent Intel Core i5/i7 or AMD Ryzen 5/7 is plenty.
- **RAM:** 16GB minimum — 32GB if you multitask or stream.
- **Display:** a 144Hz+ screen makes fast games feel buttery smooth.
- **Cooling:** laptops throttle when hot, so good cooling keeps your performance up.

## Don't forget

Budget a little for a **cooling pad and a mouse**. And if you mainly play esports titles (FIFA, Valorant, CS2), you don't need the most expensive GPU — a mid-range card hits high frame rates easily and saves you money.

Every laptop below is genuine, backed by a 12-month warranty, and delivered free same-day in Nairobi.`,
  },
  {
    slug: "ps5-price-in-kenya",
    title: "PS5 Price in Kenya (2026): Is It Worth It?",
    description:
      "PS5 price in Kenya for 2026 — PS5 Disc vs Digital vs Pro, what to budget for controllers and games, and genuine PlayStation consoles in stock with warranty and free Nairobi delivery.",
    excerpt: "Disc vs Digital vs Pro, what to budget for, and whether the PS5 is worth it in Kenya — with live console prices.",
    categorySlug: "consoles",
    productQuery: { categorySlug: "consoles", sort: "featured", limit: 9 },
    picksHeading: "PlayStation consoles in stock now",
    updatedAt: "2026-08-06",
    readMinutes: 4,
    body: `Thinking about buying a PS5 in Kenya? In 2026 it's a great time — the game library is huge and prices have settled. Here's what to know before you buy.

## PS5 vs PS5 Digital vs PS5 Pro

- **PS5 (Disc):** plays physical discs — handy for buying and selling second-hand games and 4K Blu-rays.
- **PS5 Digital:** cheaper, but download-only — make sure you have good internet and enough storage.
- **PS5 Pro:** for enthusiasts who want the sharpest 4K performance.

## Before you buy

- Factor in an **extra DualSense controller** and a couple of games.
- Storage fills fast — a compatible NVMe SSD is a worthwhile add-on.
- Confirm your unit is genuine with a warranty (all of ours are).

## Is it worth it in Kenya?

If you play AAA games, yes — the exclusives alone justify it, and a genuine, warrantied unit with local support beats a grey-market import you can't return.

Browse genuine PS5 consoles, controllers and games below — free same-day Nairobi delivery.`,
  },
  {
    slug: "best-wireless-earbuds-in-kenya",
    title: "Best Wireless Earbuds & Headphones in Kenya (2026)",
    description:
      "Best wireless earbuds and headphones in Kenya for 2026 — battery, noise cancellation, water resistance and fit explained, plus genuine audio in stock with warranty and free Nairobi delivery.",
    excerpt: "Battery, ANC, water resistance and fit — what to look for, plus the best earbuds and headphones in stock.",
    categorySlug: "audio",
    productQuery: { categorySlug: "audio", sort: "rating", limit: 9 },
    picksHeading: "Earbuds & headphones in stock now",
    updatedAt: "2026-08-06",
    readMinutes: 4,
    body: `From daily commutes to gym sessions and calls, the right pair of wireless earbuds makes a real difference. Here's how to pick the best wireless earbuds in Kenya in 2026.

## What matters

- **Battery life:** look for 5+ hours per charge, 20+ with the case.
- **Noise cancellation (ANC):** worth it for matatu commutes and open offices.
- **Water resistance (IPX4+):** essential if you'll sweat or get caught in the rain.
- **Mic quality:** for M-Pesa calls and meetings, clear voice pickup matters.
- **Fit:** in-ear tips seal out noise; open buds are comfier for long wear.

## Quick picks

- **Best all-rounder:** premium ANC buds from Sony, Bose or Apple.
- **Best value:** Anker Soundcore, JBL and Redmi buds punch above their price.
- **Best for sport:** secure-fit, sweat-proof designs from Beats or JBL.

All audio below is genuine, warrantied for 12 months, and delivered free same-day in Nairobi.`,
  },
  {
    slug: "new-vs-refurbished-phones-kenya",
    title: "New vs Refurbished Phones in Kenya: Which Should You Buy?",
    description:
      "New vs refurbished phones in Kenya — what 'certified refurbished' really means, when to choose each, and how to buy safely with a 12-month warranty and free Nairobi delivery.",
    excerpt: "What 'certified refurbished' really means, and an honest breakdown of when to buy new vs refurbished.",
    categorySlug: "phones",
    productQuery: { categorySlug: "phones", sort: "featured", limit: 9 },
    picksHeading: "Compare phones in stock now",
    updatedAt: "2026-08-06",
    readMinutes: 4,
    body: `Should you buy a new or refurbished phone in Kenya? Both are great options — the right choice comes down to your budget and priorities. Here's an honest breakdown.

## What 'certified refurbished' really means

A certified refurbished phone is a pre-owned device that's been professionally inspected, repaired if needed, cleaned and fully tested to work like new. It is **not** the same as buying 'second-hand' from an unknown seller — refurbished units are graded, disclosed and come with a warranty.

## Choose new if…

- You want the very latest model, sealed in the box.
- You plan to keep the phone three years or more.
- Having the newest cameras and features matters to you.

## Choose refurbished if…

- You want flagship performance for much less.
- You're comfortable with tiny, disclosed cosmetic marks.
- You'd rather put the savings toward a case, earbuds or airtime.

## The bottom line

For most people, a **certified refurbished flagship** delivers the best value — a premium phone at a mid-range price. Whatever you choose from City Gadgets is genuine and backed by a 12-month warranty, so you're covered either way.`,
  },
];

/** Verified hero photos, kept out of the guide bodies. See scratchpad checks. */
const HERO_IMAGE: Record<string, string> = {
  "best-phones-under-20000-in-kenya": "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=1200&q=80&auto=format&fit=crop",
  "iphone-price-in-kenya": "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=1200&q=80&auto=format&fit=crop",
  "best-gaming-laptops-in-kenya": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80&auto=format&fit=crop",
  "ps5-price-in-kenya": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200&q=80&auto=format&fit=crop",
  "best-wireless-earbuds-in-kenya": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=80&auto=format&fit=crop",
  "new-vs-refurbished-phones-kenya": "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=1200&q=80&auto=format&fit=crop",
};

function withHero(g: Omit<Guide, "heroImage">): Guide {
  return { ...g, heroImage: HERO_IMAGE[g.slug] ?? "" };
}

export function getGuides(): Guide[] {
  return [...GUIDES].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(withHero);
}

export function getGuideBySlug(slug: string): Guide | null {
  const g = GUIDES.find((x) => x.slug === slug);
  return g ? withHero(g) : null;
}
