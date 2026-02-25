-- =============================
-- Auto-create profile on signup
-- =============================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'User'),
    coalesce(new.raw_user_meta_data ->> 'phone', null),
    coalesce(new.raw_user_meta_data ->> 'role', 'penyewa')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =============================
-- Auto-update updated_at timestamp
-- =============================
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at();

create trigger kosts_updated_at
  before update on public.kosts
  for each row
  execute function public.update_updated_at();

create trigger bookings_updated_at
  before update on public.bookings
  for each row
  execute function public.update_updated_at();

-- =============================
-- Auto-update kost rating on new review
-- =============================
create or replace function public.update_kost_rating()
returns trigger
language plpgsql
security definer
as $$
declare
  avg_rating numeric(2,1);
  total_reviews int;
begin
  select coalesce(avg(rating)::numeric(2,1), 0), count(*)
  into avg_rating, total_reviews
  from public.reviews
  where kost_id = new.kost_id;

  update public.kosts
  set rating = avg_rating, review_count = total_reviews
  where id = new.kost_id;

  return new;
end;
$$;

create trigger reviews_update_kost_rating
  after insert on public.reviews
  for each row
  execute function public.update_kost_rating();
