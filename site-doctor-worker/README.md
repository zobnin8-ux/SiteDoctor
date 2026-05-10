# Site Doctor Worker

Background worker for Site Doctor.
Listens to Supabase Realtime for new scans and processes them.

## Local development

1. Create `.env` file in this directory with:

   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
   ```

2. `npm install`
3. `npm run dev`

## Environment variables

- `SUPABASE_URL` — Supabase project URL (without `/rest/v1/`)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service_role key (secret!)

## Deploy

Deploys to Railway with Root Directory = `site-doctor-worker`.
