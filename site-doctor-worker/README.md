# Site Doctor Worker

Background worker for Site Doctor.
Listens to Supabase Realtime for new scans and processes them.

## Local development

1. Create `.env` file in this directory with:

   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...   # legacy service_role JWT
   ```

2. `npm install`
3. `npx playwright install chromium` (скачивает браузер для локального запуска)
4. `npm run dev`

## Environment variables

- `SUPABASE_URL` — Supabase project URL (without `/rest/v1/`)
- `SUPABASE_SERVICE_ROLE_KEY` — ключ **`service_role`** из вкладки **Legacy anon, service_role API keys** в Supabase (JWT вида `eyJ…`, три части через точку). Новые ключи **`sb_secret_…`** для PostgREST часто дают **`PGRST301`** — их сюда не кладите.

## Deploy (Railway)

- **Root Directory:** `site-doctor-worker`
- В корне воркера есть **`Dockerfile`** — Railway собирает **Docker**-образ с Chromium (рекомендуется).
- Переменные: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

Файл `nixpacks.toml` оставлен как запасной вариант без браузера; для текущего скана с Playwright нужен именно **Docker**.

## Database (этап A)

В таблице **`scans`** должна быть колонка **`scan_result`** (`jsonb`). Выполни миграцию в **Supabase → SQL → New query** (файл в репозитории):

`supabase/migrations/20260109180000_add_scan_result_to_scans.sql`

Без неё воркер не сможет записать JSON и PostgREST вернёт ошибку на `update` с неизвестной колонкой.
