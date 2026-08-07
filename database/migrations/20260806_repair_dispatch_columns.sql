-- Repair script for partially-created contractor dispatch tables.
-- Run this if the main contractor dispatch migration failed with:
-- ERROR: 42703: column "contractor_id" does not exist

create extension if not exists pgcrypto;

do $$
begin
  create type public.work_assignment_status as enum (
    'offered',
    'assigned',
    'accepted',
    'declined',
    'expired',
    'cancelled'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.work_order_assignments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.work_order_assignments
  add column if not exists work_order_id uuid references public.work_orders(id) on delete cascade,
  add column if not exists contractor_id uuid references public.contractor_profiles(id) on delete cascade,
  add column if not exists assigned_by uuid references auth.users(id) on delete set null,
  add column if not exists status public.work_assignment_status not null default 'assigned',
  add column if not exists score numeric(5,2),
  add column if not exists score_breakdown jsonb not null default '{}'::jsonb,
  add column if not exists offered_at timestamptz,
  add column if not exists assigned_at timestamptz not null default now(),
  add column if not exists accepted_at timestamptz,
  add column if not exists declined_at timestamptz,
  add column if not exists expired_at timestamptz,
  add column if not exists notes text,
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.progress_updates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.progress_updates
  add column if not exists work_order_id uuid references public.work_orders(id) on delete cascade,
  add column if not exists contractor_id uuid references public.contractor_profiles(id) on delete set null,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists message text,
  add column if not exists status text,
  add column if not exists visible_to_customer boolean not null default true;

create table if not exists public.work_order_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.work_order_photos
  add column if not exists work_order_id uuid references public.work_orders(id) on delete cascade,
  add column if not exists contractor_id uuid references public.contractor_profiles(id) on delete set null,
  add column if not exists uploaded_by uuid references auth.users(id) on delete set null,
  add column if not exists storage_path text,
  add column if not exists public_url text,
  add column if not exists caption text,
  add column if not exists photo_type text not null default 'progress',
  add column if not exists latitude numeric(10,7),
  add column if not exists longitude numeric(10,7),
  add column if not exists taken_at timestamptz;
