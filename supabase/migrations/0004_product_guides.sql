-- Buying guides authored from the vendor studio. These append to the built-in
-- guides that live in code (src/lib/data/guides.ts). Public reads published
-- guides; staff (vendor/admin) manage their own — mirrors product_videos RLS.

create table if not exists public.product_guides (
  id            uuid primary key default gen_random_uuid(),
  vendor_id     uuid references auth.users(id) on delete set null,
  slug          text unique not null,
  title         text not null,
  description   text not null default '',
  excerpt       text not null default '',
  category_slug text not null,
  hero_image    text,
  picks_heading text not null default 'In stock now',
  body          text not null default '',
  read_minutes  int  not null default 4,
  -- live product grid query
  pq_sort       text not null default 'rating',   -- featured|price-asc|price-desc|newest|rating
  pq_limit      int  not null default 9,
  pq_brand      text,                              -- optional single-brand filter
  pq_max_price  int,                               -- optional price cap
  status        text not null default 'published', -- draft | published
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.product_guides enable row level security;

create policy "product_guides: public read published" on public.product_guides
  for select using (status = 'published' or vendor_id = auth.uid() or public.current_user_role() = 'admin');
create policy "product_guides: vendor insert own" on public.product_guides
  for insert with check (vendor_id = auth.uid() or public.current_user_role() = 'admin');
create policy "product_guides: vendor update own" on public.product_guides
  for update using (vendor_id = auth.uid() or public.current_user_role() = 'admin')
  with check (vendor_id = auth.uid() or public.current_user_role() = 'admin');
create policy "product_guides: vendor delete own" on public.product_guides
  for delete using (vendor_id = auth.uid() or public.current_user_role() = 'admin');
