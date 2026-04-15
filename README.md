# nvite.id

Cinematic wedding invitation builder and public invitation platform.

## Overview

This app lets users:

- Sign up and manage an account
- Create/edit invitation projects from a dashboard
- Save drafts and publish invitations to public slug URLs (`/:slug`)
- Manage RSVP submissions
- Preview templates at dedicated routes (`/templates/lumiere`, etc.)
- View/update plan details from profile and plan pages

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Supabase (Auth, Postgres, Storage)
- React Router

## Environment Variables

Copy `.env.example` to `.env` and set:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key
```

You can also use `VITE_SUPABASE_PUBLISHABLE_KEY` as fallback.

## Local Development

Prerequisites:

- Node.js 20+
- npm

Install and run:

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

Type-check only:

```bash
npm run lint
```

## Database and Migrations

Migrations live in `supabase/migrations`:

- `001_initial_schema.sql` - core tables, RLS, triggers
- `002_seed_claire.sql` - legacy seed/demo data
- `003_fix_handle_new_user_search_path.sql` - signup trigger hardening

Apply migrations to linked project:

```bash
npx supabase db push --linked
```

If you use Supabase SQL Editor directly, run the SQL files in order.

## Routing Notes

- Public invitation URL: `/:slug`
- Template demo URL: `/templates/:templateSlug`
- Legacy redirect: `/claire` -> `/templates/lumiere`
- Dashboard (protected): `/dashboard`
- Profile (protected): `/dashboard/profile`
- Plan selection (protected): `/dashboard/plans`

## Deployment

This project includes `vercel.json` rewrite config for SPA routing:

- all non-API routes are rewritten to `index.html`

If deploying to Vercel, ensure env vars are set in project settings.

## Security and Access Model

- Invitations are owner-scoped in dashboard queries
- Public can read only `is_published = true` invitations
- RSVP insert is public, read/delete is owner-restricted
- Profiles are user-scoped via RLS

## License

Private/internal project.
