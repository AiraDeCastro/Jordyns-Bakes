-- Storage access rules for the "order-references" bucket (Milestone 4).
-- The bucket itself was created via the Storage API (private, 5MB limit,
-- image types only) — this just adds who can upload/view files in it.
-- Run once in the Supabase SQL Editor.

create policy "Anyone can upload order reference images"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'order-references');

create policy "Admin can view order reference images"
on storage.objects for select
to authenticated
using (bucket_id = 'order-references');
