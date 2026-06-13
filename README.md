# Messy Desk

A playful shared space for couples — hide messages in a messy desk, invite your partner when you're ready, and let them hunt at their own pace.

## Stack

- **Next.js 16** (App Router) + React 19 + Tailwind CSS 4
- **Supabase** — Auth, Postgres, Storage
- **Framer Motion**, **@dnd-kit**, **TanStack Query**, **Tiptap**

## Setup

1. Create a [Supabase](https://supabase.com) project.

2. Run migrations in order via the Supabase SQL editor:
   - [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)
   - [`supabase/migrations/002_partner_invites.sql`](supabase/migrations/002_partner_invites.sql)
   - [`supabase/migrations/003_repair_user_setup.sql`](supabase/migrations/003_repair_user_setup.sql) **← run this if desk/signup doesn't work**

3. Add environment variables in **Vercel → Project Settings → Environment Variables** (see [`.env.local.example`](.env.local.example) for names only — it is not loaded by the app):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g. `https://your-app.vercel.app`) |

For local development, run `vercel link` then `vercel dev` — env vars are injected from your Vercel project (no local env file required).

In Supabase **Authentication → URL Configuration**, set:
- **Site URL**: `http://localhost:3000` (or your production URL)
- **Redirect URLs**: `http://localhost:3000/auth/callback`

Email confirmation must be enabled under **Authentication → Providers → Email**.

4. Install and run (requires [Vercel CLI](https://vercel.com/docs/cli)):

```bash
npm install
vercel link
vercel dev
```

5. Open [http://localhost:3000](http://localhost:3000).

## How it works

1. **You sign up** — create your desk, add hidden messages, publish when ready.
2. **Copy your invite link** from the dashboard — send it to your partner (email, text, etc.).
3. **Partner signs up** via your link — they join your space and can hunt your desk async.
4. **No realtime required** — play on your own schedules.

## Features

- **Dual desks** — each partner designs their own messy desk with up to 8 hunt items
- **Partner invite links** — solo setup first; partner joins via unique URL/code
- **Scavenger hunt** — pick 3 targets; partner explores and unlocks items
- **Shared space** — journal, record player, flora vase, haptic photo frame (async, not live-synced)
- **Dashboard & room** — overview cards and unified room view

## Project structure

```
src/
├── app/           # Routes (auth, dashboard, room, desk editor, settings)
├── components/    # UI, desk, hunt, shared space, journal, audio
├── lib/           # Supabase clients, hooks, item registry
└── types/         # TypeScript types
supabase/migrations/
```

## Deploy (Vercel)

### 1. Supabase

Run all migrations in the Supabase SQL editor (see Setup above).

In **Authentication → URL Configuration**:

| Setting | Value |
|---|---|
| **Site URL** | `https://your-app.vercel.app` |
| **Redirect URLs** | `https://your-app.vercel.app/auth/callback` |
| | `http://localhost:3000/auth/callback` (local dev) |

Keep email confirmation enabled under **Authentication → Providers → Email**.

### 2. Vercel project

Environment variables are read from Vercel at build and runtime — no env files are used in production.

1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Next.js** (auto-detected).
3. Add environment variables for **Production** (and Preview if you want branch deploys):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` (your production domain) |

4. Deploy. The build runs `next build` and fails early if Supabase env vars are missing.

### 3. After first deploy

- Update Supabase **Site URL** and **Redirect URLs** to match your real Vercel URL (or custom domain).
- Sign up on production and confirm email links land on `/auth/callback`.
- Share partner invite links from the dashboard — they use the live domain automatically.

**Do not** add `SUPABASE_SERVICE_ROLE_KEY` to Vercel; it is server-only and not used by this app.
