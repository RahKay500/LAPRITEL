create extension if not exists pgcrypto;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'cancelled')),
  user_id uuid references auth.users (id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_address text not null,
  delivery_city text not null,
  delivery_region text not null,
  delivery_notes text,
  subtotal numeric(10, 2) not null,
  currency text not null default 'GHS',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on orders (user_id);
create index if not exists orders_status_idx on orders (status);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_name text not null default 'The Ivy Bag',
  color_slug text not null,
  color_name text not null,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 2) generated always as (unit_price * quantity) stored
);

create index if not exists order_items_order_id_idx on order_items (order_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at
  before update on orders
  for each row
  execute function set_updated_at();

alter table orders enable row level security;
alter table order_items enable row level security;

-- All writes happen through the backend using the service role key, which
-- bypasses RLS entirely. These policies only govern direct, authenticated
-- reads (e.g. a future "My Orders" page querying Supabase from the client).
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users can view items of their own orders"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );
