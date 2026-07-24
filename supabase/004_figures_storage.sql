-- Figures move from base64-in-jsonb (projects.figures) to real Supabase
-- Storage: every edit used to re-send every figure's full base64 payload on
-- every save, which made high-res photos impractical. Now only a small
-- storage path/URL is stored in projects.figures; the image bytes live in
-- this bucket instead. Run after 002_auth_and_membership.sql (needs
-- public.is_project_member()).
--
-- Objects are uploaded under "<project_id>/<file>", so policies can check
-- membership via the first path segment. The bucket is public: figure
-- bytes were already visible to anyone with project access before this
-- change, and a stable public URL is required so images already embedded
-- in saved manuscript HTML keep loading without needing periodic
-- signed-URL refresh.

insert into storage.buckets (id, name, public)
values ('figures', 'figures', true)
on conflict (id) do nothing;

create policy "members can view figures"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'figures' and public.is_project_member((storage.foldername(name))[1]::uuid));

create policy "members can upload figures"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'figures' and public.is_project_member((storage.foldername(name))[1]::uuid));

create policy "members can delete figures"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'figures' and public.is_project_member((storage.foldername(name))[1]::uuid));
