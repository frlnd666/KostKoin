-- Create kosts table
create table if not exists public.kosts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  address text not null,
  city text not null,
  price_monthly bigint not null,
  type text not null default 'campur' check (type in ('putra', 'putri', 'campur')),
  facilities text[] default '{}',
  rules text[] default '{}',
  images text[] default '{}',
  total_rooms int not null default 1,
  available_rooms int not null default 1,
  rating numeric(2,1) default 0,
  review_count int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.kosts enable row level security;
