-- Create rooms table
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  kost_id uuid not null references public.kosts(id) on delete cascade,
  name text not null,
  price_monthly bigint not null,
  facilities text[] default '{}',
  is_available boolean default true,
  created_at timestamptz default now()
);

alter table public.rooms enable row level security;
