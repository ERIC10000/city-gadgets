-- City Gadgets — core schema, RLS policies, and storage setup.
-- Apply via `supabase db push` or paste into the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('customer', 'vendor', 'admin');
create type public.product_condition as enum ('new', 'refurbished');
create type public.product_status as enum ('draft', 'published');
create type public.order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
create type public.payment_method as enum ('mpesa', 'whatsapp', 'card');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  role public.user_role not null default 'customer',
  loyalty_points integer not null default 0,
  store_credit numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  icon text,
  hero_tagline text,
  hero_image text,
  sort_order integer not null default 0
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.profiles (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  slug text unique not null,
  name text not null,
  brand text,
  description text,
  price numeric(12, 2) not null check (price >= 0),
  compare_at_price numeric(12, 2) check (compare_at_price is null or compare_at_price >= price),
  currency text not null default 'KES',
  condition public.product_condition not null default 'new',
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_featured boolean not null default false,
  badge text,
  specs jsonb not null default '{}'::jsonb,
  rating numeric(2, 1) not null default 0,
  review_count integer not null default 0,
  status public.product_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_idx on public.products (category_id);
create index products_vendor_idx on public.products (vendor_id);
create index products_status_idx on public.products (status);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order integer not null default 0
);
create index product_images_product_idx on public.product_images (product_id);

create table public.product_videos (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.profiles (id) on delete set null,
  product_id uuid references public.products (id) on delete set null,
  title text not null,
  description text,
  video_url text not null,
  thumbnail_url text,
  duration_seconds integer,
  category text,
  view_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text,
  line1 text not null,
  city text not null,
  phone text,
  is_default boolean not null default false
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  status public.order_status not null default 'pending',
  subtotal numeric(12, 2) not null,
  shipping_fee numeric(12, 2) not null default 0,
  total numeric(12, 2) not null,
  payment_method public.payment_method,
  phone_number text,
  shipping_address jsonb,
  created_at timestamptz not null default now()
);
create index orders_user_idx on public.orders (user_id);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  unit_price numeric(12, 2) not null,
  quantity integer not null default 1 check (quantity > 0)
);
create index order_items_order_idx on public.order_items (order_id);

create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ---------------------------------------------------------------------------
-- New-user hook: auto-create a profile row when someone signs up via Supabase Auth
-- ---------------------------------------------------------------------------
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'customer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper used inside RLS policies to read the caller's own role without
-- re-triggering RLS recursion (SECURITY DEFINER, scoped to auth.uid() only).
create function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_videos enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlists enable row level security;

-- profiles
create policy "profiles: read own or admin" on public.profiles
  for select using (auth.uid() = id or public.current_user_role() = 'admin');
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- categories: public catalog metadata
create policy "categories: public read" on public.categories
  for select using (true);
create policy "categories: admin write" on public.categories
  for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

-- products: published rows are public; vendors manage their own; admins manage all
create policy "products: public read published" on public.products
  for select using (status = 'published' or vendor_id = auth.uid() or public.current_user_role() = 'admin');
create policy "products: vendor insert own" on public.products
  for insert with check (vendor_id = auth.uid() or public.current_user_role() = 'admin');
create policy "products: vendor update own" on public.products
  for update using (vendor_id = auth.uid() or public.current_user_role() = 'admin')
  with check (vendor_id = auth.uid() or public.current_user_role() = 'admin');
create policy "products: vendor delete own" on public.products
  for delete using (vendor_id = auth.uid() or public.current_user_role() = 'admin');

-- product_images: follow the parent product's visibility/ownership
create policy "product_images: read with product" on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id
        and (p.status = 'published' or p.vendor_id = auth.uid() or public.current_user_role() = 'admin')
    )
  );
create policy "product_images: manage with product" on public.product_images
  for all using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.vendor_id = auth.uid() or public.current_user_role() = 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.vendor_id = auth.uid() or public.current_user_role() = 'admin')
    )
  );

-- product_videos: public read (it's a marketing feed), vendor manages own
create policy "product_videos: public read" on public.product_videos
  for select using (true);
create policy "product_videos: vendor insert own" on public.product_videos
  for insert with check (vendor_id = auth.uid() or public.current_user_role() = 'admin');
create policy "product_videos: vendor update own" on public.product_videos
  for update using (vendor_id = auth.uid() or public.current_user_role() = 'admin')
  with check (vendor_id = auth.uid() or public.current_user_role() = 'admin');
create policy "product_videos: vendor delete own" on public.product_videos
  for delete using (vendor_id = auth.uid() or public.current_user_role() = 'admin');

-- addresses: strictly owner-only
create policy "addresses: owner all" on public.addresses
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- orders: customers see/create their own; admins see all
create policy "orders: owner read" on public.orders
  for select using (user_id = auth.uid() or public.current_user_role() = 'admin');
create policy "orders: owner insert" on public.orders
  for insert with check (user_id = auth.uid());
create policy "orders: admin update" on public.orders
  for update using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

-- order_items: visible/insertable only through an owned order
create policy "order_items: read via order" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.current_user_role() = 'admin')
    )
  );
create policy "order_items: insert via order" on public.order_items
  for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- wishlists: strictly owner-only
create policy "wishlists: owner all" on public.wishlists
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Storage: a public "media" bucket for product images and inspiration videos.
-- Vendors upload into a folder prefixed with their own user id.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media: public read" on storage.objects
  for select using (bucket_id = 'media');
create policy "media: authenticated upload to own folder" on storage.objects
  for insert with check (
    bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "media: owner manage own folder" on storage.objects
  for update using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "media: owner delete own folder" on storage.objects
  for delete using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
