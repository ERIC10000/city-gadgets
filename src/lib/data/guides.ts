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
      "The best phones under KSh 20,000 in Kenya for 2026 — what to look for in battery, RAM and storage, plus genuine budget phones in stock with warranty and fast same-day Nairobi delivery.",
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

Every phone below is 100% genuine, comes with a 12-month official brand warranty, and qualifies for fast same-day delivery within Nairobi. Prices are live and update automatically.`,
  },
  {
    slug: "iphone-price-in-kenya",
    title: "iPhone Price in Kenya (2026): Live Price List & Where to Buy",
    description:
      "How much is an iPhone in Kenya in 2026? A live iPhone price list across models and storage, new vs refurbished advice, and genuine iPhones with 12-month official brand warranty and fast same-day Nairobi delivery.",
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

A **certified refurbished** iPhone is fully tested, restored and warrantied — you save a lot versus brand-new with no drop in everyday experience. If you want the newest model sealed in the box, go new. Either way, every unit we sell is genuine Apple hardware with a 12-month official brand warranty. See our full [new vs refurbished guide](/guides/new-vs-refurbished-phones-kenya).

All iPhones below are genuine, warrantied and delivered fast same-day within Nairobi — pay with M-Pesa, card or on delivery.`,
  },
  {
    slug: "best-gaming-laptops-in-kenya",
    title: "Best Gaming Laptops in Kenya (2026): Buyer's Guide",
    description:
      "Best gaming laptops in Kenya for 2026 — the GPU, CPU, RAM and display specs that matter, how much to spend, and genuine laptops in stock with warranty and fast same-day Nairobi delivery.",
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

Every laptop below is genuine, backed by a 12-month official brand warranty, and delivered fast same-day within Nairobi.`,
  },
  {
    slug: "ps5-price-in-kenya",
    title: "PS5 Price in Kenya (2026): Is It Worth It?",
    description:
      "PS5 price in Kenya for 2026 — PS5 Disc vs Digital vs Pro, what to budget for controllers and games, and genuine PlayStation consoles in stock with warranty and fast same-day Nairobi delivery.",
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

Browse genuine PS5 consoles, controllers and games below — fast same-day delivery within Nairobi.`,
  },
  {
    slug: "best-wireless-earbuds-in-kenya",
    title: "Best Wireless Earbuds & Headphones in Kenya (2026)",
    description:
      "Best wireless earbuds and headphones in Kenya for 2026 — battery, noise cancellation, water resistance and fit explained, plus genuine audio in stock with warranty and fast same-day Nairobi delivery.",
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

All audio below is genuine, covered by a 12-month official brand warranty, and delivered fast same-day within Nairobi.`,
  },
  {
    slug: "new-vs-refurbished-phones-kenya",
    title: "New vs Refurbished Phones in Kenya: Which Should You Buy?",
    description:
      "New vs refurbished phones in Kenya — what 'certified refurbished' really means, when to choose each, and how to buy safely with a 12-month official brand warranty and fast same-day Nairobi delivery.",
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

For most people, a **certified refurbished flagship** delivers the best value — a premium phone at a mid-range price. Whatever you choose from City Gadgets is genuine and backed by a 12-month official brand warranty, so you're covered either way.`,
  },
  {
    slug: "best-laptops-for-students-in-kenya",
    title: "Best Laptops for University Students in Kenya (2026)",
    description:
      "Best laptops for university students in Kenya (2026) — the battery, weight, RAM and storage that matter for campus, matched to your course, with genuine laptops in stock, warranty and fast same-day Nairobi delivery.",
    excerpt: "The specs that actually matter on campus, matched to your course — plus affordable student laptops in stock.",
    categorySlug: "macbooks",
    productQuery: { categorySlug: "macbooks", sort: "price-asc", limit: 9 },
    picksHeading: "Student-friendly laptops in stock now",
    updatedAt: "2026-08-07",
    readMinutes: 4,
    body: `Starting university in Kenya? Your laptop is the one tool you'll use every single day — for assignments, research, online classes and Netflix at 2am. Here's how to buy the right one without overspending.

## What actually matters for students

- **Battery life:** lecture halls are short on sockets. Aim for 6+ hours of real use.
- **Weight:** you'll carry it everywhere — 1.6kg or lighter saves your back.
- **RAM:** 8GB is the sweet spot; 16GB if you edit video or run heavy software.
- **Storage:** a 256GB SSD minimum — fast boot and room for your projects.
- **Build:** a sturdy hinge and keyboard survive four years of campus life.

## Match the laptop to your course

- **Business, law, arts:** any solid 8GB/256GB ultrabook is plenty.
- **Engineering, architecture, design:** 16GB RAM and a dedicated GPU for CAD and rendering.
- **Computer science:** 16GB RAM so virtual machines and IDEs don't crawl.

## Save your money for what counts

Don't overspend on a gaming laptop you'll mostly use for Word. Put the savings toward a **padded backpack**, a **mouse** and a **surge protector** — Kenyan power can be rough on chargers.

Every laptop below is genuine, backed by a 12-month official brand warranty, and delivered fast same-day within Nairobi.`,
  },
  {
    slug: "best-samsung-phones-in-kenya",
    title: "Best Samsung Phones in Kenya (2026): S, A & M Series Compared",
    description:
      "Best Samsung phones in Kenya (2026) — how the Galaxy S, A and M series compare and which to buy, with genuine Samsung phones in stock, 12-month official brand warranty and fast same-day Nairobi delivery.",
    excerpt: "Galaxy S vs A vs M — which Samsung family is right for you, plus genuine Samsung phones in stock.",
    categorySlug: "phones",
    productQuery: { categorySlug: "phones", brands: ["Samsung"], sort: "price-desc", limit: 12 },
    picksHeading: "Samsung phones in stock now",
    updatedAt: "2026-08-07",
    readMinutes: 4,
    body: `Samsung is the most popular Android brand in Kenya for good reason — bright screens, strong cameras and a phone at every price. But the line-up is confusing, so here's how to pick the right one.

## The three Samsung families

- **Galaxy S series:** the flagships — best cameras, fastest chips and premium glass-and-metal builds. For power users and photographers.
- **Galaxy A series:** the value champions — big batteries, great screens and solid cameras for far less. This is where most Kenyans should look.
- **Galaxy M series:** battery monsters at rock-bottom prices — brilliant if all-day life matters more than a fancy camera.

## What to check before you buy

- **Software updates:** newer S and A models get years of Android updates — better long-term value.
- **5G vs 4G:** 5G is nice to have, but 4G on Safaricom and Airtel is what you'll actually use today.
- **Storage:** 128GB minimum; many A-series phones take a microSD card.

## Our pick for most people

A mid-range **Galaxy A series** hits the sweet spot — a flagship-feeling screen and battery without the flagship price. Step up to the S series only if the camera is your top priority.

Every Samsung below is genuine, covered by a 12-month official brand warranty, with fast same-day delivery within Nairobi.`,
  },
  {
    slug: "best-smartwatch-in-kenya",
    title: "Best Smartwatch in Kenya (2026): Fitness, Style & Battery",
    description:
      "Best smartwatch in Kenya (2026) — how to choose for fitness, notifications and battery, and which watch pairs with your phone, with genuine smartwatches in stock, warranty and fast same-day Nairobi delivery.",
    excerpt: "Fitness tracking, notifications, battery and phone pairing — how to choose, plus smartwatches in stock.",
    categorySlug: "wearables",
    productQuery: { categorySlug: "wearables", sort: "rating", limit: 9 },
    picksHeading: "Smartwatches & bands in stock now",
    updatedAt: "2026-08-07",
    readMinutes: 4,
    body: `A smartwatch does more than tell time — it tracks your workouts, buzzes your WhatsApps, watches your heart rate and nudges you to move. Here's how to choose the best one in Kenya in 2026.

## Decide what you want it for

- **Fitness & health:** look for heart-rate, SpO2, sleep tracking and built-in GPS for accurate runs.
- **Notifications & style:** a bright AMOLED screen and swappable straps to match your fit.
- **Battery:** Apple and Samsung watches last ~1-2 days; fitness bands and outdoor watches go a week or more.

## Match the watch to your phone

- **iPhone:** the Apple Watch is unbeatable — but it only works with iPhones.
- **Samsung / Android:** Galaxy Watch and Wear OS watches pair best.
- **Any phone, tight budget:** a good fitness band gives you 80% of the features for a fraction of the price.

## Don't overpay for features you won't use

Most people want notifications, steps, heart-rate and a week of battery — a mid-range watch or a premium band nails all of that. Save the flagship money unless you're a serious runner or cyclist.

Every wearable below is genuine, covered by a 12-month official brand warranty, with fast same-day delivery within Nairobi.`,
  },
  {
    slug: "best-cameras-for-content-creators-in-kenya",
    title: "Best Cameras & Gear for Content Creators in Kenya (2026)",
    description:
      "Best cameras and gear for content creators in Kenya (2026) — what to buy first for YouTube, TikTok and podcasts, from mics to lighting to cameras, with genuine gear in stock and fast same-day Nairobi delivery.",
    excerpt: "Building a YouTube or TikTok channel? What to buy first — mic, light, gimbal, camera — and where to spend.",
    categorySlug: "cameras",
    productQuery: { categorySlug: "cameras", sort: "rating", limit: 9 },
    picksHeading: "Creator cameras & gear in stock now",
    updatedAt: "2026-08-07",
    readMinutes: 4,
    body: `Whether you're building a YouTube channel, going viral on TikTok or launching a podcast, the right gear makes your content look and sound pro. Here's what to buy in Kenya — and where to spend first.

## Spend in this order

1. **Sound before video:** viewers forgive shaky footage but not bad audio. A clip-on or shotgun mic is the best first upgrade.
2. **Lighting:** a single LED panel or ring light instantly lifts your footage — especially indoors.
3. **Stabilisation:** a gimbal makes your walking-and-talking shots smooth and watchable.
4. **The camera:** a mirrorless camera or a rugged action cam for movement and vlogging.

## Phone or camera?

A modern flagship phone shoots fantastic 4K — start there and add a mic, light and tripod. Move to a dedicated camera when you need better low-light, background blur or interchangeable lenses.

## The creator starter kit

Mic + light + tripod + a phone or entry mirrorless will take you a very long way. Add a gimbal and a spare battery and you're ready to shoot anywhere in Nairobi.

Every item below is genuine, covered by a 12-month official brand warranty, with fast same-day delivery within Nairobi.`,
  },
  {
    slug: "ps5-vs-xbox-vs-switch-kenya",
    title: "PS5 vs Xbox vs Nintendo Switch: Which to Buy in Kenya (2026)",
    description:
      "PS5 vs Xbox vs Nintendo Switch in Kenya (2026) — an honest comparison of game libraries, value and who each console is for, with genuine consoles in stock, warranty and fast same-day Nairobi delivery.",
    excerpt: "An honest showdown — game libraries, value and who each console is really for in Kenya.",
    categorySlug: "consoles",
    productQuery: { categorySlug: "consoles", sort: "featured", limit: 9 },
    picksHeading: "Consoles in stock now",
    updatedAt: "2026-08-07",
    readMinutes: 5,
    body: `Buying a console in Kenya in 2026? The "best" one depends entirely on how — and what — you play. Here's the honest breakdown.

## PlayStation 5 — the all-rounder

The biggest library of blockbuster exclusives, gorgeous 4K graphics and the most active local player base for FIFA and Call of Duty. If you want one console that does everything, it's the safe pick.

## Xbox Series X|S — the value play

Game Pass is the killer feature — a huge library of games for a monthly fee, which stretches your shilling much further than buying titles one by one. Great if you play widely and love variety.

## Nintendo Switch — the fun, portable one

Nothing else plays like it. Family-friendly exclusives (Mario, Zelda, Mario Kart) and it switches from TV to handheld in seconds — perfect for travel, kids and casual nights.

## Quick advice

- **Play FIFA or COD with friends?** PS5 — that's where everyone in Kenya is.
- **Want the most games for your money?** Xbox plus Game Pass.
- **Family, kids or portability?** Switch.

Whatever you choose below is genuine, warrantied and delivered fast same-day within Nairobi — with games and controllers to match.`,
  },
  {
    slug: "how-to-spot-a-fake-phone-in-kenya",
    title: "How to Spot a Fake Phone in Kenya (Before You Pay)",
    description:
      "How to spot a fake phone in Kenya — check the IMEI, the build, the screen and the price before you pay, and buy safely with a receipt and warranty. Genuine phones in stock at City Gadgets.",
    excerpt: "A deal too good to be true usually is. The 30-second IMEI test and the red flags that expose a clone.",
    categorySlug: "phones",
    productQuery: { categorySlug: "phones", sort: "featured", limit: 9 },
    picksHeading: "Genuine phones you can trust",
    updatedAt: "2026-08-07",
    readMinutes: 4,
    body: `Kenya's phone market is huge — and so is the number of fakes and "clones" passed off as the real thing. A deal that's too good to be true usually is. Here's how to protect yourself before you pay.

## Check the IMEI — the 30-second test

Dial \`*#06#\` to show the phone's IMEI number, then check it on the manufacturer's website or a trusted IMEI checker. A fake will show a mismatched model, a blocked number, or nothing at all.

## Look closely at the details

- **Build & weight:** clones often feel light, creaky or use cheap plastic.
- **Screen & icons:** blurry logos, laggy animations or the wrong app store are red flags.
- **Software:** open Settings — the real model number and Android/iOS version should match the box.
- **Ports & sensors:** test the fingerprint reader, cameras and charging before you hand over money.

## Protect yourself

- **If the price is far below everyone else's, walk away.** Genuine stock has a floor.
- **Buy from a seller who gives you a receipt and a warranty** — that's your proof and your protection.
- **Insist on unboxing and testing** before paying.

At City Gadgets every phone is 100% genuine, IMEI-clean and backed by a 12-month official brand warranty — no clones, no surprises. Browse verified phones below.`,
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
  "best-laptops-for-students-in-kenya": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80&auto=format&fit=crop",
  "best-samsung-phones-in-kenya": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&q=80&auto=format&fit=crop",
  "best-smartwatch-in-kenya": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1200&q=80&auto=format&fit=crop",
  "best-cameras-for-content-creators-in-kenya": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=1200&q=80&auto=format&fit=crop",
  "ps5-vs-xbox-vs-switch-kenya": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&q=80&auto=format&fit=crop",
  "how-to-spot-a-fake-phone-in-kenya": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80&auto=format&fit=crop",
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
