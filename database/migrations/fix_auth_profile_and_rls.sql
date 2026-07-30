-- Repair Preserve auth/profile setup without dropping app data.
-- Run in Supabase SQL Editor.

create extension if not exists pgcrypto;

-- Organizations are optional in the current app, but keep the table valid.
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

alter table public.organizations
  add column if not exists owner_id uuid references auth.users(id) on delete set null;

alter table public.organizations enable row level security;

drop policy if exists "Members can view their organization" on public.organizations;
drop policy if exists "Admins can update their organization" on public.organizations;
drop policy if exists "Owners can view their organization" on public.organizations;
drop policy if exists "Owners can update their organization" on public.organizations;
drop policy if exists "Owners can delete their organization" on public.organizations;
drop policy if exists "Authenticated users can create organizations" on public.organizations;

create policy "Owners can view their organization"
  on public.organizations for select
  using (owner_id = auth.uid());

create policy "Owners can update their organization"
  on public.organizations for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "Owners can delete their organization"
  on public.organizations for delete
  using (owner_id = auth.uid());

create policy "Authenticated users can create organizations"
  on public.organizations for insert
  with check (owner_id = auth.uid());

-- App profile table mirrors Supabase Auth users.
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now()
);

alter table public.users
  add column if not exists email text,
  add column if not exists full_name text,
  add column if not exists created_at timestamptz default now();

alter table public.users enable row level security;

drop policy if exists "Users can view own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;
drop policy if exists "Users can insert own profile" on public.users;

create policy "Users can view own profile"
  on public.users for select
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.users for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Users can insert own profile"
  on public.users for insert
  with check (id = auth.uid());

-- Keep core app tables owned by the signed-in user.
alter table if exists public.properties
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table if exists public.properties
  add column if not exists service_area text;

alter table if exists public.work_orders
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table if exists public.properties enable row level security;
alter table if exists public.work_orders enable row level security;

drop policy if exists "Users manage own properties" on public.properties;
drop policy if exists "Users manage own work orders" on public.work_orders;

create policy "Users manage own properties"
  on public.properties for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own work orders"
  on public.work_orders for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create/update profile rows automatically when Auth users are created.
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, ''), public.users.full_name);

  return new;
end;
$$ language plpgsql;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

grant select, insert, update on public.users to authenticated;
grant select, insert, update, delete on public.properties to authenticated;
grant select, insert, update, delete on public.work_orders to authenticated;
