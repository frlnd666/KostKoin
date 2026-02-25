-- Create reviews table
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  kost_id uuid not null references public.kosts(id) on delete cascade,
  renter_id uuid not null references public.profiles(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;
