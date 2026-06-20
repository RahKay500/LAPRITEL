create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- All writes happen through the backend using the service role key, which
-- bypasses RLS entirely. No public policies are defined since these
-- messages are only ever read by staff via the service role.
