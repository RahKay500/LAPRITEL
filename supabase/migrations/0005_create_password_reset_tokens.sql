create table if not exists password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists password_reset_tokens_user_id_idx on password_reset_tokens (user_id);
create index if not exists password_reset_tokens_token_hash_idx on password_reset_tokens (token_hash);

alter table password_reset_tokens enable row level security;

-- All access happens through the backend using the service role key, which
-- bypasses RLS entirely. No public policies — these tokens are never read
-- directly by clients.
