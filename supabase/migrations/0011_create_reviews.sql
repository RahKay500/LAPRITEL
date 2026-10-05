create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_slug text not null,
  color_slug text not null,
  rating integer not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 10 and 1000),
  author_name text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  created_at timestamptz not null default now(),
  unique (order_id, color_slug)
);

create index if not exists reviews_product_status_idx on reviews (product_slug, status);

alter table reviews enable row level security;
