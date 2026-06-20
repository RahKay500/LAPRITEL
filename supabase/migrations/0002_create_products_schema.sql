create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  color_name text not null,
  color_slug text not null,
  hex text not null,
  price numeric(10, 2) not null,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, color_slug)
);

create index if not exists product_variants_product_id_idx on product_variants (product_id);

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row
  execute function set_updated_at();

drop trigger if exists product_variants_set_updated_at on product_variants;
create trigger product_variants_set_updated_at
  before update on product_variants
  for each row
  execute function set_updated_at();

alter table products enable row level security;
alter table product_variants enable row level security;

-- The backend reads/writes through the service role (bypasses RLS); these
-- policies only matter if the storefront ever queries Supabase directly.
create policy "Anyone can view active products"
  on products for select
  using (is_active = true);

create policy "Anyone can view active product variants"
  on product_variants for select
  using (is_active = true);
