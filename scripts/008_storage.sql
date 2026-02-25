-- Create storage buckets for images
insert into storage.buckets (id, name, public)
values ('kost-images', 'kost-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage policies for kost-images
create policy "Anyone can view kost images"
  on storage.objects for select
  using (bucket_id = 'kost-images');

create policy "Authenticated users can upload kost images"
  on storage.objects for insert
  with check (bucket_id = 'kost-images' and auth.role() = 'authenticated');

create policy "Users can update their own kost images"
  on storage.objects for update
  using (bucket_id = 'kost-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own kost images"
  on storage.objects for delete
  using (bucket_id = 'kost-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for avatars
create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
