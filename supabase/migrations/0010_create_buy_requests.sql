create table if not exists buy_requests (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  items jsonb not null,
  requester jsonb not null,
  status text not null default 'open' check (status in ('open', 'paid')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table buy_requests enable row level security;
