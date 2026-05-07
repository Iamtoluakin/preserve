-- ============================================================
-- Migration: Enable RLS on public.organizations and public.users
-- Run in: https://app.supabase.com → SQL Editor → New Query
-- ============================================================

-- ─── public.organizations ────────────────────────────────────

-- Enable RLS
alter table public.organizations enable row level security;

-- Members can read their own organization
create policy "Members can view their organization"
  on public.organizations for select
  using (
    id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
    )
  );

-- Only org owners/admins can update their organization
create policy "Admins can update their organization"
  on public.organizations for update
  using (
    id in (
      select organization_id from public.organization_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- Only org owners can delete their organization
create policy "Owners can delete their organization"
  on public.organizations for delete
  using (
    id in (
      select organization_id from public.organization_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

-- Any authenticated user can create an organization (they become owner)
create policy "Authenticated users can create organizations"
  on public.organizations for insert
  with check (auth.uid() is not null);


-- ─── public.users ────────────────────────────────────────────
-- NOTE: If public.users is a mirror/profile table of auth.users,
-- apply these policies. If it IS auth.users, skip — that table
-- is managed by Supabase and should not be in public schema.

-- Enable RLS
alter table public.users enable row level security;

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
