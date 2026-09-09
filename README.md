# NexalField Website Project Enquiry

Web app for the NexalField website project enquiry, built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Getting Started

Install dependencies:

```bash
npm install
```

Copy the environment template and fill in your Supabase/Resend details (see
[Environment variables](#environment-variables) below):

```bash
cp .env.example .env.local
```

Run the SQL in `supabase/schema.sql` once, in your Supabase project's SQL
editor, to create the tables, RLS policies, and storage bucket.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the enquiry, or
[http://localhost:3000/admin](http://localhost:3000/admin/login) for the
admin dashboard.

## Scripts

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm run start` – run the production build locally
- `npm run lint` – run ESLint
- `npx tsc --noEmit` – type-check the project

## Environment variables

See `.env.example` for the full list with comments. Copy it to `.env.local`
(gitignored — never commit real values) and fill in:

| Variable | Where it's used | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server — safe to expose, protected by RLS | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server — safe to expose, protected by RLS | Yes |
| `RESEND_API_KEY` | Server only — admin notification email | No — sending is skipped (logged, not fatal) if unset |
| `EMAIL_FROM` | Server only — notification "from" address | No — falls back to Resend's shared test sender |
| `NOTIFICATION_EMAIL` | Server only — who receives new-enquiry alerts | No — sending is skipped if unset |
| `NEXT_PUBLIC_SITE_URL` | Used to build the "open in admin" link in notification emails | No — defaults to `http://localhost:3000` |

There is no `SUPABASE_SERVICE_ROLE_KEY` anywhere in this app by design — every
table and storage bucket is protected by Row Level Security instead, so
there's no bypass-everything credential that could leak.

**Adding these to Vercel:** Project Settings → Environment Variables, for
each of the variables above you're using. Vercel already deploys from `main`
— nothing about that setup needs to change.

## Database & storage setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com) (or use an
   existing one) and copy its URL + anon key into `.env.local`.
2. Run `supabase/schema.sql` in the SQL editor. It creates the `enquiries`
   and `admins` tables, Row Level Security policies, and the private
   `enquiry-uploads` storage bucket. It's idempotent — safe to re-run.
3. Add an admin: in the Supabase dashboard, Authentication → Users → **Add
   user** (this is admin-created, not public sign-up) with the admin's email
   and a password. Then run the `insert into public.admins ...` statement at
   the bottom of `supabase/schema.sql` (edit the email first) to grant that
   user dashboard access. Repeat for each admin.
4. Optional: sign up at [resend.com](https://resend.com) for a `RESEND_API_KEY`
   to enable the "new enquiry" notification email.

## Status

**Stage 3 (current):** the enquiry is a real, working system — submissions
are validated server-side and stored in Postgres, logo/photo uploads go to
private Supabase Storage, and NexalField gets an email alert per submission
(when `RESEND_API_KEY` is configured). `/admin` is a Supabase-authenticated
dashboard (search, filter, status management) with a per-enquiry detail view
organised by the same 7 sections as the public form. There is no live
Supabase project wired into *this* environment, so the backend paths were
verified by confirming every failure mode degrades gracefully (friendly
errors, no crashes, no leaked internals) rather than against a real
database — test the full round trip once your own project is connected.

The real NexalField logo is in place. The supplied master export lives at
`public/brand/nexalfield-logo-original.jpg`; `public/brand/nexalfield-logo.png`
and `public/brand/nexalfield-icon.png` are whitespace-trimmed crops of that
same file (no recolouring or redrawing) used by `src/components/Logo.tsx` via
`next/image`.

## Deployment

This project is intended to be deployed on [Vercel](https://vercel.com),
deploying from `main`. Add the environment variables listed above to the
Vercel project before deploying the backend-connected build.
