create table if not exists featured_customers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  quote text not null,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table featured_customers enable row level security;

-- Same pattern as the other tables: reads and writes go through the backend
-- using the service role key, which bypasses RLS. No public policies needed.
