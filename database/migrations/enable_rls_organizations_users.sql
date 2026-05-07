-- ============================================================
-- Migration: Enable RLS on public.organizations and public.users
-- Run in: https://app.supabase.com → SQL Editor → New Query
-- ============================================================

-- ─── public.organizations ────────────────────────────────────

-- Step 1: Add owner_id column if it doesn't already exist
alter table public.organizations
  add column if not exists owner_id uuid references auth.users(id) on delete set null;

-- Step 2: Enable RLS
alter table public.organizations enable row level security;

-- Drop old policies if they exist (safe re-run)
drop policy if exists "Members can view their organization" on public.organizations;
drop policy if exists "Admins can update their organization" on public.organizations;
drop policy if exists "Owners can delete their organization" on public.organizations;
drop policy if exists "Authenticated users can create organizations" on public.organizations;

-- Owner can read their own organization
create policy "Owners can view their organization"
  on public.organizations for select
  using (owner_id = auth.uid());

-- Owner can update their own organization
create policy "Owners can update their organization"
  on public.organizations for update
  using (owner_id = auth.uid());

-- Owner can delete their own organization
create policy "Owners can delete their organization"
  on public.organizations for delete
  using (owner_id = auth.uid());

-- Authenticated users can create an organization
create policy "Authenticated users can create organizations"
  on public.organizations for insert
  with check (auth.uid() is not null);


-- ─── public.users ────────────────────────────────────────────
-- NOTE: If public.users is a mirror/profile table of auth.users,
-- apply these policies. If it IS auth.users, skip — that table
-- is managed by Supabase and should not be in public schema.

-- Enable RLS
alter table public.users enable row level security;

-- Drop old policies if they exist (safe re-run)
drop policy if exists "Users can view own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;
drop policy if exists "Users can insert own profile" on public.users;

-- Users can only read their own row
create policy "Users can view own profile"
  on public.users for select
  using (id = auth.uid());

-- Users can only update their own row
create policy "Users can update own profile"
  on public.users for update
  using (id = auth.uid());

-- Users can insert their own profile row (e.g. on sign-up trigger)
create policy "Users can insert own profile"
  on public.users for insert
  with check (id = auth.uid());


-- ─── Verify RLS is enabled ───────────────────────────────────
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('organizations', 'users');
