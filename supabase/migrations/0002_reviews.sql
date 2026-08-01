-- Customer product reviews. Ratings/counts on products are kept in sync by a
-- trigger so every existing surface (cards, badges, product page) shows the
-- real aggregate with no extra code.

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reviewer_name text,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

alter table public.product_reviews enable row level security;

create policy "reviews: public read" on public.product_reviews
  for select using (true);
create policy "reviews: insert own" on public.product_reviews
  for insert with check (auth.uid() = user_id);
create policy "reviews: update own" on public.product_reviews
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviews: delete own" on public.product_reviews
  for delete using (auth.uid() = user_id);

create or replace function public.sync_product_rating()
returns trigger language plpgsql security definer as $$
declare pid uuid;
begin
  pid := coalesce(new.product_id, old.product_id);
  update public.products p set
    review_count = (select count(*) from public.product_reviews r where r.product_id = pid),
    rating = coalesce((select round(avg(r.rating)::numeric, 1) from public.product_reviews r where r.product_id = pid), 0)
  where p.id = pid;
  return null;
end; $$;

drop trigger if exists trg_sync_product_rating on public.product_reviews;
create trigger trg_sync_product_rating
  after insert or update or delete on public.product_reviews
  for each row execute function public.sync_product_rating();
