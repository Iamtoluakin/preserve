-- ============================================================
-- Preserve SaaS — Supabase Database Schema
-- Run this in: https://app.supabase.com → SQL Editor → New Query
-- ============================================================

-- ─── PROPERTIES ────────────────────────────────────────────────
create table if not exists public.properties (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  address      text not null,
  city         text not null,
  county       text,
  state        text not null default 'NC',
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
  on public.properties for all using (auth.uid() = user_id);

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
  on public.work_orders for all using (auth.uid() = user_id);

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
