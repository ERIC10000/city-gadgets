-- Let the shop's staff (vendor/admin) see and manage every order, and read
-- the customer profile behind each one. Previously only "owner read" existed,
-- so the vendor's Orders page saw nothing but their own purchases.

create policy "orders: staff read all" on public.orders
  for select using (public.current_user_role() in ('vendor', 'admin'));

create policy "order_items: staff read all" on public.order_items
  for select using (public.current_user_role() in ('vendor', 'admin'));

create policy "profiles: staff read all" on public.profiles
  for select using (public.current_user_role() in ('vendor', 'admin'));

-- Status updates were admin-only; allow vendors too.
drop policy if exists "orders: admin update" on public.orders;
create policy "orders: staff update" on public.orders
  for update using (public.current_user_role() in ('vendor', 'admin'))
  with check (public.current_user_role() in ('vendor', 'admin'));
