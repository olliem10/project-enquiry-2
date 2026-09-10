-- NexalField enquiry system — Stage 3 schema.
--
-- Run this once in the Supabase SQL editor for your project
-- (https://app.supabase.com/project/_/sql/new). It is safe to re-run:
-- every statement is idempotent (create-if-not-exists / drop-then-create
-- for policies).
--
-- This script does not delete or modify any existing data. Review it
-- before running if you already have objects with these names.

-- ---------------------------------------------------------------------
-- Enquiries
-- ---------------------------------------------------------------------

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  status text not null default 'new' check (status in ('new', 'in_progress', 'completed')),
  business_name text not null,
  contact_name text not null,
  email text not null,
  answers jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx on public.enquiries (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists enquiries_set_updated_at on public.enquiries;
create trigger enquiries_set_updated_at
  before update on public.enquiries
  for each row
  execute function public.set_updated_at();

alter table public.enquiries enable row level security;

drop policy if exists "public can submit enquiries" on public.enquiries;
create policy "public can submit enquiries"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (status = 'new');

drop policy if exists "admins can read enquiries" on public.enquiries;
create policy "admins can read enquiries"
  on public.enquiries
  for select
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admins can update enquiries" on public.enquiries;
create policy "admins can update enquiries"
  on public.enquiries
  for update
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- ---------------------------------------------------------------------
-- Admins allow-list
--
-- Membership here is what actually grants dashboard access (both in the
-- app and at the database level via RLS) — nothing about Supabase Auth
-- sign-up alone grants access. Add admins with the INSERT statement in
-- the "Add an admin" section at the bottom of this file.
-- ---------------------------------------------------------------------

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "admins can read own admin row" on public.admins;
create policy "admins can read own admin row"
  on public.admins
  for select
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- Storage — enquiry file uploads
--
-- Private bucket: public users can upload (insert) but never list or
-- read back files. Only authenticated admins (checked against the
-- admins table above) can read/download, via short-lived signed URLs
-- generated server-side — never a permanent public URL.
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('enquiry-uploads', 'enquiry-uploads', false)
on conflict (id) do nothing;

drop policy if exists "public can upload enquiry files" on storage.objects;
create policy "public can upload enquiry files"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'enquiry-uploads');

drop policy if exists "admins can read enquiry files" on storage.objects;
create policy "admins can read enquiry files"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'enquiry-uploads'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

-- ---------------------------------------------------------------------
-- Add an admin
--
-- 1. In the Supabase dashboard: Authentication -> Users -> "Add user"
--    (NOT a public sign-up flow) and create a user with the admin's
--    email and a password of your choice. Do this for each admin.
-- 2. Then run the statement below (edit the email) to grant that user
--    dashboard access. Re-run it once per admin you add.
-- ---------------------------------------------------------------------

insert into public.admins (user_id, email)
select id, email
from auth.users
where email = 'olliemicklefield@gmail.com'
on conflict (user_id) do nothing;
