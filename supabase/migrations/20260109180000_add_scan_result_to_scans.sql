-- Этап A: артефакт скана для отчёта и будущего AI (единый JSON в БД).
alter table public.scans
  add column if not exists scan_result jsonb;

comment on column public.scans.scan_result is
  'Structured scan payload (versioned JSON). Written by site-doctor-worker.';
