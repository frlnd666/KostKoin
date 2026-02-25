-- Create bookings table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  kost_id uuid not null references public.kosts(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  renter_id uuid not null references public.profiles(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  check_in date not null,
  duration_months int not null default 1,
  total_price bigint not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.bookings enable row level security;
