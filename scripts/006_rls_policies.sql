-- =============================
-- PROFILES RLS
-- =============================
create policy "Anyone can view profiles"
  on public.profiles for select
  using (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- =============================
-- KOSTS RLS
-- =============================
create policy "Anyone can view active kosts"
  on public.kosts for select
  using (is_active = true);

create policy "Owners can view all their kosts"
  on public.kosts for select
  using (auth.uid() = owner_id);

create policy "Owners can insert kosts"
  on public.kosts for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their kosts"
  on public.kosts for update
  using (auth.uid() = owner_id);

create policy "Owners can delete their kosts"
  on public.kosts for delete
  using (auth.uid() = owner_id);

-- =============================
-- ROOMS RLS
-- =============================
create policy "Anyone can view rooms"
  on public.rooms for select
  using (true);

create policy "Owners can insert rooms for their kosts"
  on public.rooms for insert
  with check (
    exists (
      select 1 from public.kosts
      where kosts.id = kost_id and kosts.owner_id = auth.uid()
    )
  );

create policy "Owners can update rooms for their kosts"
  on public.rooms for update
  using (
    exists (
      select 1 from public.kosts
      where kosts.id = kost_id and kosts.owner_id = auth.uid()
    )
  );

create policy "Owners can delete rooms for their kosts"
  on public.rooms for delete
  using (
    exists (
      select 1 from public.kosts
      where kosts.id = kost_id and kosts.owner_id = auth.uid()
    )
  );

-- =============================
-- BOOKINGS RLS
-- =============================
create policy "Renters can view their bookings"
  on public.bookings for select
  using (auth.uid() = renter_id);

create policy "Owners can view bookings for their kosts"
  on public.bookings for select
  using (auth.uid() = owner_id);

create policy "Renters can create bookings"
  on public.bookings for insert
  with check (auth.uid() = renter_id);

create policy "Owners can update booking status"
  on public.bookings for update
  using (auth.uid() = owner_id);

create policy "Renters can cancel their pending bookings"
  on public.bookings for update
  using (auth.uid() = renter_id and status = 'pending');

-- =============================
-- REVIEWS RLS
-- =============================
create policy "Anyone can view reviews"
  on public.reviews for select
  using (true);

create policy "Renters can create reviews"
  on public.reviews for insert
  with check (auth.uid() = renter_id);
