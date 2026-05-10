-- Bucket для PNG скриншотов скана (воркер грузит с service_role).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'scan-screenshots',
  'scan-screenshots',
  true,
  10485760,
  array['image/png'::text]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Публичное чтение (отчёт на сайте по URL).
drop policy if exists "scan_screenshots_select_public" on storage.objects;
create policy "scan_screenshots_select_public"
on storage.objects for select
using (bucket_id = 'scan-screenshots');

-- Загрузка только с JWT service_role (Railway worker).
drop policy if exists "scan_screenshots_insert_service_role" on storage.objects;
create policy "scan_screenshots_insert_service_role"
on storage.objects for insert
with check (
  bucket_id = 'scan-screenshots'
  and coalesce((auth.jwt() ->> 'role'), '') = 'service_role'
);

drop policy if exists "scan_screenshots_update_service_role" on storage.objects;
create policy "scan_screenshots_update_service_role"
on storage.objects for update
using (
  bucket_id = 'scan-screenshots'
  and coalesce((auth.jwt() ->> 'role'), '') = 'service_role'
)
with check (
  bucket_id = 'scan-screenshots'
  and coalesce((auth.jwt() ->> 'role'), '') = 'service_role'
);
