alter table orders
  add column if not exists recipient_name text,
  add column if not exists recipient_phone text;
