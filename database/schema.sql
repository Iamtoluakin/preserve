-- ============================================================
-- Preserve SaaS — Supabase Database Schema
-- Run this in: https://app.supabase.com → SQL Editor → New Query
-- ============================================================

-- ─── ORGANIZATIONS ─────────────────────────────────────────────
create table if not exists public.organizations (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid references auth.users(id) on delete set null,
  name       text not null,
  created_at timestamptz default now()
);

alter table public.organizations enable row level security;

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

-- ─── USERS (profile table) ──────────────────────────────────────
create table if not exists public.users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  created_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Users can view own profile"
  on public.users for select using (id = auth.uid());

create policy "Users can update own profile"
  on public.users for update using (id = auth.uid());

create policy "Users can insert own profile"
  on public.users for insert with check (id = auth.uid());

-- ─── PROPERTIES ────────────────────────────────────────────────
create table if not exists public.properties (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  address      text not null,
  city         text not null,
  county       text,
  state        text not null default 'NC',
  service_area text,
  zip          text not null,
  parcel_id    text,
  property_type text not null default 'single_family',
  nickname     text,
  notes        text,
  status       text not null default 'Active',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.properties enable row level security;

create policy "Users manage own properties"
  on public.properties for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── WORK ORDERS ───────────────────────────────────────────────
create table if not exists public.work_orders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  property_id     uuid references public.properties(id) on delete set null,
  order_number    text,
  property_address text,
  service_type    text not null,
  priority        text not null default 'normal',
  status          text not null default 'pending',
  scheduled_date  date,
  billing_frequency text default 'one-time',
  total_cost      numeric(10,2) default 0,
  description     text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.work_orders enable row level security;

create policy "Users manage own work orders"
  on public.work_orders for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── AUTH PROFILE SYNC ────────────────────────────────────────
-- Creates an app profile row whenever Supabase Auth creates a user.
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

-- ─── AUTO-UPDATE updated_at ─────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger properties_updated_at
  before update on public.properties
  for each row execute function public.handle_updated_at();

create trigger work_orders_updated_at
  before update on public.work_orders
  for each row execute function public.handle_updated_at();

-- ─── VIEWS (SECURITY INVOKER — respects RLS of the calling user) ───
-- Drop any old SECURITY DEFINER versions first
drop view if exists public.properties_summary;
drop view if exists public.work_orders_with_property;

-- properties_summary: per-user property overview
create or replace view public.properties_summary
  with (security_invoker = true)
as
select
  p.id,
  p.user_id,
  p.address,
  p.city,
  p.county,
  p.state,
  p.service_area,
  p.zip,
  p.property_type,
  p.nickname,
  p.status,
  p.created_at,
  count(wo.id)                                           as total_work_orders,
  count(wo.id) filter (where wo.status = 'pending')     as pending_orders,
  count(wo.id) filter (where wo.status = 'in-progress') as active_orders,
  count(wo.id) filter (where wo.status = 'completed')   as completed_orders,
  max(wo.scheduled_date)                                 as next_scheduled_date
from public.properties p
left join public.work_orders wo on wo.property_id = p.id
group by p.id;

-- Grant read access to authenticated users
grant select on public.properties_summary to authenticated;

-- work_orders_with_property: work orders joined with their property
create or replace view public.work_orders_with_property
  with (security_invoker = true)
as
select
  wo.id,
  wo.user_id,
  wo.order_number,
  wo.property_id,
  wo.property_address,
  wo.service_type,
  wo.priority,
  wo.status,
  wo.scheduled_date,
  wo.billing_frequency,
  wo.total_cost,
  wo.description,
  wo.created_at,
  wo.updated_at,
  p.address         as property_full_address,
  p.city            as property_city,
  p.county          as property_county,
  p.state           as property_state,
  p.service_area    as property_service_area,
  p.zip             as property_zip,
  p.property_type,
  p.nickname        as property_nickname
from public.work_orders wo
left join public.properties p on p.id = wo.property_id;

-- Grant read access to authenticated users
grant select on public.work_orders_with_property to authenticated;
