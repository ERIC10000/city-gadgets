# City Gadgets

A premium e-commerce platform for **City Gadgets** — a Nairobi-based electronics, gaming & lifestyle-tech retailer. Built from a Google Stitch design system ("Urban Tech Aesthetic") into a production-grade Next.js storefront with a vendor CMS, cart & checkout, a video-inspiration feed, and full SEO.

![Stack](https://img.shields.io/badge/Next.js-16-black) ![Stack](https://img.shields.io/badge/React-19-blue) ![Stack](https://img.shields.io/badge/TypeScript-5-blue) ![Stack](https://img.shields.io/badge/Tailwind-v4-06B6D4) ![Stack](https://img.shields.io/badge/Supabase-Postgres-3FCF8E)

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (design tokens ported from `DESIGN.md`) |
| Animation | Framer Motion (hero slider, add-to-cart state machine, video modal, page micro-interactions) |
| Backend / DB | Supabase (Postgres + Auth + Storage) |
| Cart state | Zustand (with `localStorage` persistence) |
| Fonts | Manrope (Google Fonts) + Material Symbols |
| Images | `next/image` with Unsplash + Supabase Storage remote patterns |

### Runs with zero backend

The storefront is **fully browsable without any backend**. Until you add Supabase credentials, the data layer (`src/lib/data/*`) transparently serves a **bundled seed catalog of 165 products across 10 categories** (147 from the client's price list + 18 mobile phones added for the "Latest Mobile Phones" category, spanning the brands that actually move in the Nairobi market — Apple/Samsung/Google at the top end, Tecno/Infinix/Xiaomi for mid and budget tiers). Auth, order persistence, and the vendor CMS show a friendly "Connect Supabase" notice until configured.

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

That's it for browsing the storefront, product pages, cart, and checkout (checkout completes with a simulated M-Pesa STK push and a generated order reference).

## Connecting Supabase (auth, orders, vendor CMS)

1. **Create a project** at [supabase.com](https://supabase.com).
2. **Copy env vars** — duplicate `.env.local.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY` (only used by the seeding script)
   - `NEXT_PUBLIC_SITE_URL` (your deployed URL, for SEO/OG tags)
3. **Run the schema migration** — open the Supabase SQL editor and paste the contents of
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). This creates all tables,
   the `handle_new_user` trigger, Row-Level-Security policies, and a public `media` storage bucket.
4. **Seed the catalog** — either:
   - paste [`supabase/seed.sql`](supabase/seed.sql) into the SQL editor, **or**
   - run `npm run seed:push` (uses the service-role key to upsert products + images).
5. **Restart** `npm run dev`. Sign-up, login, order history, and the vendor CMS now work.

### Promoting a vendor account

New sign-ups are `customer` by default. To grant CMS access, set a user's role to `vendor` (or `admin`) in the `profiles` table:

```sql
update public.profiles set role = 'vendor' where id = (
  select id from auth.users where email = 'vendor@example.com'
);
```

Then visit `/vendor` to manage products and video inspiration.

## Product catalog & seeding

The raw price list lives in [`scripts/generate-seed.ts`](scripts/generate-seed.ts). It parses the
list, categorizes each item, infers brand + specs, assigns validated Unsplash placeholder images, and
emits deterministic stock/rating data. Regenerate any time with:

```bash
npm run seed:generate   # → src/data/seed/*.json  +  supabase/seed.sql
```

| Category | Slug | Items |
| --- | --- | --- |
| Gaming Consoles & Handhelds | `consoles` | 28 |
| Gaming Accessories | `gaming-accessories` | 21 |
| Audio & Mics | `audio` | 19 |
| Action Cameras & Gimbals | `cameras` | 15 |
| Smartwatches & Rings | `wearables` | 13 |
| MacBooks & Computers | `macbooks` | 10 |
| Tablets (iPad) | `tablets` | 12 |
| Streaming Devices | `streaming` | 10 |
| Tech Accessories | `accessories` | 19 |
| Latest Mobile Phones | `phones` | 18 (added on request; not in the original price list) |

## Payments

The checkout M-Pesa flow is a **UI-complete simulation** of a Safaricom Daraja STK push (see
`src/components/checkout/CheckoutView.tsx` and `src/lib/actions/orders.ts`). To go live, wire the
`createOrder` server action to the Daraja `/stkpush` endpoint using your merchant credentials
(paybill/till, consumer key/secret, passkey). WhatsApp checkout is fully functional — it deep-links a
pre-filled order message to the store's WhatsApp number.

## Project structure

```
src/
├─ app/                      # App Router routes
│  ├─ page.tsx               # Home (hero slider, categories, best-sellers)
│  ├─ shop/ category/[slug]/ # Listing pages (filters, sort, pagination)
│  ├─ product/[slug]/        # Product detail (+ dynamic OG image, JSON-LD)
│  ├─ cart/ checkout/        # Cart + checkout + order success
│  ├─ account/               # Customer dashboard, orders, addresses, settings
│  ├─ vendor/                # Role-gated CMS (products CRUD, video uploads)
│  ├─ inspiration/           # Dark-themed video showcase feed
│  ├─ login/ signup/         # Supabase auth
│  ├─ sitemap.ts robots.ts manifest.ts
├─ components/               # ui/ layout/ product/ cart/ checkout/ account/ vendor/ home/ inspiration/
├─ lib/
│  ├─ data/                  # Data-access layer (Supabase → seed fallback)
│  ├─ actions/               # Server actions (auth, orders, products, videos, addresses)
│  ├─ supabase/              # Browser + server clients
│  └─ seo.ts format.ts types.ts
├─ store/cart.ts             # Zustand cart (localStorage-persisted)
└─ proxy.ts                  # Session-refresh middleware (Next 16 "proxy")
supabase/
├─ migrations/0001_init.sql  # Schema + RLS + storage
└─ seed.sql                  # Generated catalog inserts
```

## SEO

- Per-page `generateMetadata` with Open Graph + Twitter cards
- **JSON-LD**: `Organization` + `WebSite` (home), `Product` + `Offer` + `AggregateRating` + `BreadcrumbList` (product pages)
- Dynamic per-product **OG images** via `next/og` (`product/[slug]/opengraph-image.tsx`)
- `sitemap.xml` (all products + categories), `robots.txt`, and a PWA `manifest.webmanifest`
- Semantic HTML, `next/image` with alt text everywhere

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run seed:generate` | Regenerate seed JSON + `supabase/seed.sql` from the price list |
| `npm run seed:push` | Push the seed catalog into Supabase (needs service-role key) |

## License

Private project for City Gadgets. Design system derived from the provided Google Stitch export.
