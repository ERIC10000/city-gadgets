# City Gadgets

A premium e-commerce platform for **City Gadgets** — a Nairobi-based electronics, gaming & lifestyle-tech retailer. A production-grade Next.js storefront with a **Reebelo-style refurb-marketplace interface**, a vendor CMS, cart & checkout, a Hot Deals experience, a video-inspiration feed, and full SEO. Prices in **Kenyan Shillings (KES)**.

![Stack](https://img.shields.io/badge/Next.js-16-black) ![Stack](https://img.shields.io/badge/React-19-blue) ![Stack](https://img.shields.io/badge/TypeScript-5-blue) ![Stack](https://img.shields.io/badge/Tailwind-v4-06B6D4) ![Stack](https://img.shields.io/badge/Supabase-Postgres-3FCF8E)

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 — semantic tokens in `globals.css` (`@theme`) |
| Design | "Refurb marketplace" system inspired by Reebelo — white canvas, cyan→mint hero gradient, solid-black CTAs, red discount badges, Trustpilot green |
| Animation | Framer Motion (hero carousel, add-to-cart state machine, video modal, hover micro-interactions) |
| Backend / DB | Supabase (Postgres + Auth + Storage) |
| Cart state | Zustand (with `localStorage` persistence) |
| Fonts | Poppins (Google Fonts) + Material Symbols |
| Images | `next/image` with Unsplash + Supabase Storage remote patterns |

### Runs with zero backend

The storefront is **fully browsable without any backend**. Until Supabase credentials are present, the data layer (`src/lib/data/*`) transparently serves a **bundled seed catalog of 288 products across 10 categories, spanning 75 real brands** — generated from the client's price list plus a broad brand catalog (Apple, Samsung, Google, OnePlus, Oppo, Vivo, Dell, HP, Lenovo, Asus, Bose, Sony, JBL, Garmin, Canon, Razer, and many more). Auth, order persistence, and the vendor CMS show a friendly "Connect Supabase" notice until configured.

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3010
```

That's it for browsing the storefront, product pages, Hot Deals (`/deals`), cart, and checkout (checkout completes with a simulated M-Pesa STK push and a generated order reference).

## Connecting Supabase (auth, orders, vendor CMS)

The app reads from Supabase the moment `NEXT_PUBLIC_SUPABASE_URL` **and** `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set; otherwise it uses the bundled seed catalog.

1. **Create a project** at [supabase.com](https://supabase.com) (or use your existing one).
2. **Copy env vars** — duplicate `.env.local.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API)
   - `DB_URL` — the direct-DB connection string used by `npm run db:push` (see below)
   - `NEXT_PUBLIC_SITE_URL` (your deployed URL, for SEO/OG tags)
3. **Push the schema + catalog** in one command (creates all tables, RLS policies, the
   `handle_new_user` trigger, and seeds the 288-product catalog):

   ```bash
   npm run db:push
   ```

   It's idempotent — it skips the schema if it already exists and just re-seeds, so re-run it
   any time after `npm run seed:generate`. (You can also paste
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) then
   [`supabase/seed.sql`](supabase/seed.sql) into the Supabase SQL editor by hand.)
4. **Restart** `npm run dev`. Sign-up, login, order history, and the vendor CMS now work.

### IPv4 note (connection pooler)

Supabase's direct database host `db.<ref>.supabase.co` is **IPv6-only**. On an IPv4-only network
(and from most CI/hosts) it's unreachable, and so is the MCP server that relies on it. Use the
**Supavisor connection pooler** instead — an IPv4 endpoint:

```
postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

Find it in the dashboard under **Connect → Session pooler**. The username is `postgres.<project-ref>`.
This is the `DB_URL` that `npm run db:push` uses.

### Promoting a vendor account

New sign-ups are `customer` by default. To grant CMS access, set a user's role to `vendor` (or `admin`):

```sql
update public.profiles set role = 'vendor' where id = (
  select id from auth.users where email = 'vendor@example.com'
);
```

Then visit `/vendor` to manage products and video inspiration.

## Product catalog & seeding

The catalog + brand logic lives in [`scripts/generate-seed.ts`](scripts/generate-seed.ts). It parses the
product list, categorizes each item, infers the brand (~75 rules) and specs, assigns visually-verified
Unsplash placeholder images, and emits deterministic stock/rating/discount data. Regenerate any time:

```bash
npm run seed:generate   # → src/data/seed/*.json  +  supabase/seed.sql
npm run db:push         # → sync the regenerated catalog to Supabase
```

| Category | Slug | Items |
| --- | --- | --- |
| Latest Mobile Phones | `phones` | 41 |
| Audio & Mics | `audio` | 37 |
| Gaming Accessories | `gaming-accessories` | 34 |
| Gaming Consoles & Handhelds | `consoles` | 32 |
| Laptops & Computers | `macbooks` | 29 |
| Tech Accessories | `accessories` | 29 |
| Smartwatches & Rings | `wearables` | 25 |
| Action Cameras & Gimbals | `cameras` | 25 |
| Tablets | `tablets` | 20 |
| Streaming Devices | `streaming` | 16 |

## Payments

The checkout M-Pesa flow is a **UI-complete simulation** of a Safaricom Daraja STK push (see
`src/components/checkout/CheckoutView.tsx` and `src/lib/actions/orders.ts`). To go live, wire the
`createOrder` server action to the Daraja `/stkpush` endpoint using your merchant credentials. WhatsApp
checkout is fully functional — it deep-links a pre-filled order message to the store's WhatsApp lines
(**0745 575 931** / **0794 488 806**, configured in `src/lib/contact.ts`).

## Key routes

| Route | What |
| --- | --- |
| `/` | Home — hero carousel, category circles, Customer Favorites, Today's Top Deals (live countdown), section rails, Circular Economy videos |
| `/deals` | Hot Deals — dark banner, featured deals, category chips, price slider + brand/category filters, promo tiles |
| `/shop`, `/category/[slug]` | Listing pages with filter sidebar, sort, pagination |
| `/product/[slug]` | Product detail + dynamic OG image + Product/Offer/Breadcrumb JSON-LD |
| `/cart`, `/checkout` | Cart + checkout (M-Pesa sim / WhatsApp) + order success |
| `/account/*` | Customer dashboard, orders, addresses, settings |
| `/vendor/*` | Role-gated CMS — product CRUD + video uploads |
| `/inspiration` | Video showcase feed |

## Project structure

```
src/
├─ app/                      # App Router routes (see table above)
├─ components/
│  ├─ layout/                # Header (2-row Reebelo nav), Footer, SearchBar, AllItemsMenu, WhatsAppFAB
│  ├─ home/                  # HeroCarousel, PopularCategories, TabbedProductRail, TopDeals, RefurbishedBanner, SectionRail, CircularEconomy, TrustStrip, Trustpilot
│  ├─ deals/                 # HotDealsBanner, FeaturedDeals, DealsExplorer, PriceRangeSlider
│  ├─ product/ cart/ checkout/ account/ vendor/ ui/
├─ lib/
│  ├─ data/                  # Data-access layer (Supabase → seed fallback)
│  ├─ actions/               # Server actions (auth, orders, products, videos, addresses)
│  ├─ contact.ts             # WhatsApp numbers + deep-link helper
│  ├─ supabase/ seo.ts format.ts types.ts env.ts
├─ store/cart.ts             # Zustand cart (localStorage-persisted)
└─ proxy.ts                  # Session-refresh middleware (Next 16 "proxy")
scripts/
├─ generate-seed.ts          # Catalog + brand generator
└─ db-push.mjs               # Idempotent schema + seed push via the IPv4 pooler
supabase/
├─ migrations/0001_init.sql  # Schema + RLS + storage
└─ seed.sql                  # Generated catalog inserts
```

## SEO

- Per-page `generateMetadata` with Open Graph + Twitter cards
- **JSON-LD**: `Organization` + `WebSite` (home), `Product` + `Offer` + `AggregateRating` + `BreadcrumbList` (product pages)
- Dynamic per-product **OG images** via `next/og`
- `sitemap.xml` (all products + categories + `/deals`), `robots.txt`, PWA `manifest.webmanifest`
- Semantic HTML, `next/image` with alt text everywhere

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (port 3010) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run seed:generate` | Regenerate seed JSON + `supabase/seed.sql` |
| `npm run db:push` | Apply schema (first run) + seed the catalog to Supabase via `DB_URL` |

## Deployment (Vercel)

Deployed from GitHub (`ERIC10000/city-gadgets`, `master` branch). Set these in **Vercel → Project →
Settings → Environment Variables** (they are not read from `.env.local` in production):

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — to serve the live catalog (otherwise the
  bundled seed catalog is used, which still renders the full store)
- `NEXT_PUBLIC_SITE_URL` = `https://citygadgetskenya.co.ke` — the production domain, for canonical links / OG / sitemap

### Custom domain (citygadgetskenya.co.ke)

1. Vercel → Project → Settings → **Domains** → add `citygadgetskenya.co.ke` and `www.citygadgetskenya.co.ke`.
2. At the registrar, add the DNS records Vercel shows (apex `A → 76.76.21.21`, `www CNAME → cname.vercel-dns.com`).
3. HTTPS is automatic — Vercel provisions a free certificate once DNS resolves; no registrar SSL needs installing.

## License

Private project for City Gadgets.
