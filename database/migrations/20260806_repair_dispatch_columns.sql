-- Repair script for partially-created contractor dispatch tables.
-- Run this if the main contractor dispatch migration failed with:
-- ERROR: 42703: column "contractor_id" does not exist

create extension if not exists pgcrypto;

do $$
begin
  create type public.preserve_user_role as enum ('customer', 'contractor', 'admin');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.contractor_application_status as enum (
    'draft',
    'submitted',
    'under-review',
    'approved',
    'rejected',
    'suspended'
  );
exception when duplicate_object then null;
end $$;

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

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'users'
  ) then
    alter table public.users
      add column if not exists role public.preserve_user_role not null default 'customer';
  end if;
end $$;

create table if not exists public.contractor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contractor_profiles
  add column if not exists company_name text,
  add column if not exists business_name text,
  add column if not exists contact_name text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists approval_status public.contractor_application_status not null default 'submitted',
  add column if not exists application_status public.contractor_application_status not null default 'submitted',
  add column if not exists service_categories text[] not null default '{}',
  add column if not exists service_category_ids text[] not null default '{}',
  add column if not exists coverage_zip_codes text[] not null default '{}',
  add column if not exists coverage_radius_miles integer not null default 25,
  add column if not exists insurance_status text not null default 'submitted',
  add column if not exists license_status text not null default 'unverified',
  add column if not exists licenses text[] not null default '{}',
  add column if not exists available boolean not null default true,
  add column if not exists quality_score numeric(5,2) not null default 0,
  add column if not exists on_time_rate numeric(5,2) not null default 0,
  add column if not exists completion_rate numeric(5,2) not null default 0,
  add column if not exists open_job_count integer not null default 0,
  add column if not exists complaint_count integer not null default 0,
  add column if not exists notes text;

alter table public.contractor_profiles enable row level security;

alter table public.work_orders
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists assigned_to uuid references auth.users(id) on delete set null,
  add column if not exists assigned_contractor_id uuid references public.contractor_profiles(id) on delete set null,
  add column if not exists accepted_at timestamptz,
  add column if not exists started_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists completed_date timestamptz,
  add column if not exists access_instructions text,
  add column if not exists customer_approved_at timestamptz,
  add column if not exists quality_reviewed_at timestamptz;

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
