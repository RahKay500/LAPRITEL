alter table product_variants
  add column if not exists ready_to_ship boolean not null default false;
