# Site Doctor Worker

Background worker for Site Doctor.
Listens to Supabase Realtime for new scans and processes them.

## Local development

1. Create `.env` file in this directory with:

   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...   # legacy service_role JWT
   ANTHROPIC_API_KEY=sk-ant-api03-... # опционально: без ключа AI шаг пропускается
   ANTHROPIC_MODEL=claude-sonnet-4-5  # опционально
   ```

2. `npm install`
3. `npx playwright install chromium` (скачивает браузер для локального запуска)
4. `npm run dev`

## Environment variables

- `SUPABASE_URL` — Supabase project URL (without `/rest/v1/`)
- `SUPABASE_SERVICE_ROLE_KEY` — ключ **`service_role`** из вкладки **Legacy anon, service_role API keys** в Supabase (JWT вида `eyJ…`, три части через точку). Новые ключи **`sb_secret_…`** для PostgREST часто дают **`PGRST301`** — их сюда не кладите.
- `SCAN_SCREENSHOTS_BUCKET` (optional) — имя bucket в Supabase Storage, по умолчанию **`scan-screenshots`**.
- `ANTHROPIC_API_KEY` (optional) — ключ Anthropic. Если не задан, после Playwright в **`scan_result`** пишется **`version: 2`** с **`ai_failed: true`** и эвристический отчёт на фронте.
- `ANTHROPIC_MODEL` (optional) — ID модели Claude, по умолчанию **`claude-sonnet-4-5`**.

## Deploy (Railway)

- **Root Directory:** `site-doctor-worker`
- В корне воркера есть **`Dockerfile`** — Railway собирает **Docker**-образ с Chromium (рекомендуется).
- Переменные: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, при необходимости AI — `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`.

Файл `nixpacks.toml` оставлен как запасной вариант без браузера; для текущего скана с Playwright нужен именно **Docker**.

## Database (этап A)

В таблице **`scans`** должна быть колонка **`scan_result`** (`jsonb`). Выполни миграцию в **Supabase → SQL → New query** (файл в репозитории):

`supabase/migrations/20260109180000_add_scan_result_to_scans.sql`

Без неё воркер не сможет записать JSON и PostgREST вернёт ошибку на `update` с неизвестной колонкой.

## Скриншоты (Storage)

Один раз выполни в **Supabase → SQL** миграцию:

`supabase/migrations/20260110120000_scan_screenshots_storage.sql`

Она создаёт публичный bucket **`scan-screenshots`**, чтение для всех, запись только с **`service_role`**. Воркер кладёт PNG по путям `{scan_id}/desktop.png` и `{scan_id}/mobile.png`, публичные URL пишет в **`scans.desktop_screenshot_url`** / **`mobile_screenshot_url`** и в **`scan_result`**.

Если загрузка упадёт по правам — проверь политики **Storage** для bucket или JWT воркера.

## AI-анализ (scan_result v2)

После успешного скана воркер помимо эвристик вызывает Claude (vision: desktop + mobile PNG). В JSON сохраняется **`version: 2`**, поля **`ai_failed`**, **`ai_error`**, при успехе — **`ai_analysis`**. Старые записи с **`version: 1`** по-прежнему отображаются эвристическим отчётом.
