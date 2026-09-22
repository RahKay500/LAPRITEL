-- LAPRITEL database schema (Supabase / Postgres).
--
-- This was previously only ever created by clicking around in the Supabase
-- dashboard, with no file anywhere recording it -- which is how it got lost
-- when the project was deleted. Run this whole file once, top to bottom, in
-- the new project's SQL Editor (Supabase dashboard -> SQL Editor -> New query)
-- to recreate it from scratch.
--
-- Auth (users, passwords, sessions) is handled entirely by Supabase Auth
-- (the built-in `auth.users` table) -- see server/controllers/authController.js.
-- There is no separate `users` table here; `role` (admin/customer) lives in
-- each auth user's `app_metadata`, set via server/scripts/setAdminRole.js.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- product_variants
-- ---------------------------------------------------------------------------
-- is_custom marks a made-to-order color offered on request (no photo, not
-- listed as its own shop/collection card) as opposed to a standard,
-- ready-to-ship, photographed colorway -- see ProductPage.jsx's "Custom
-- Colors" section and ShopPage.jsx's grid filter.
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  color_name text not null,
  color_slug text not null,
  hex text not null,
  price numeric(10, 2) not null,
  image_url text,
  is_active boolean not null default true,
  is_custom boolean not null default false,
  created_at timestamptz not null default now(),
  unique (product_id, color_slug)
);

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'failed')),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_address text not null,
  delivery_city text not null,
  delivery_region text not null,
  delivery_notes text,
  subtotal numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on orders(user_id);

-- ---------------------------------------------------------------------------
-- order_items
--
-- product_name is resolved server-side per item (see
-- getActiveVariantMetaMap in server/models/products.js) and set explicitly
-- on insert -- the 'Bag Ivy' default here is only a last-resort fallback,
-- never relied on in the normal order flow. line_total is a generated
-- column instead, since it's derived and never set directly. The client
-- reads both directly off order_items (see OrderConfirmationPage.jsx,
-- MyOrdersPage.jsx, AdminOrdersPage.jsx).
-- ---------------------------------------------------------------------------
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_name text not null default 'Bag Ivy',
  color_slug text not null,
  color_name text not null,
  is_custom boolean not null default false,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 2) generated always as (unit_price * quantity) stored
);

create index if not exists order_items_order_id_idx on order_items(order_id);

-- ---------------------------------------------------------------------------
-- contact_messages
-- ---------------------------------------------------------------------------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- password_reset_tokens
-- ---------------------------------------------------------------------------
create table if not exists password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists password_reset_tokens_user_id_idx on password_reset_tokens(user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- The server only ever talks to these tables with the service-role key
-- (server/config/supabase.js), which bypasses RLS entirely. The anon-key
-- client (server/config/supabaseAuth.js) is only ever used for
-- `.auth.signInWithPassword(...)`, never for direct table queries. So RLS
-- is enabled with NO policies on every table below: deny-by-default for
-- anyone using the public anon key directly (e.g. from a browser), while
-- the server's own service-role access is unaffected.
-- ---------------------------------------------------------------------------
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table contact_messages enable row level security;
alter table password_reset_tokens enable row level security;
