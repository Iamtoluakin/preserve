-- PreserveHQ contractor dispatch workflow
-- Run this in the Supabase SQL editor after the existing base schema.
-- It is intentionally additive/idempotent so it can sit on top of older Preserve schemas.

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

update public.contractor_profiles
set
  company_name = coalesce(company_name, business_name),
  business_name = coalesce(business_name, company_name),
  approval_status = coalesce(approval_status, application_status),
  application_status = coalesce(application_status, approval_status),
  service_categories = case
    when cardinality(service_categories) = 0 then service_category_ids
    else service_categories
  end,
  service_category_ids = case
    when cardinality(service_category_ids) = 0 then service_categories
    else service_category_ids
  end;

alter table public.contractor_profiles enable row level security;

drop policy if exists "Contractors can view own contractor profile" on public.contractor_profiles;
create policy "Contractors can view own contractor profile"
  on public.contractor_profiles for select
  using (user_id = auth.uid());

drop policy if exists "Contractors can create own contractor profile" on public.contractor_profiles;
create policy "Contractors can create own contractor profile"
  on public.contractor_profiles for insert
  with check (user_id = auth.uid());

drop policy if exists "Contractors can update own contractor profile" on public.contractor_profiles;
create policy "Contractors can update own contractor profile"
  on public.contractor_profiles for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Admins can manage contractor profiles" on public.contractor_profiles;
create policy "Admins can manage contractor profiles"
  on public.contractor_profiles for all
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
    )
  );

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
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  contractor_id uuid not null references public.contractor_profiles(id) on delete cascade,
  assigned_by uuid references auth.users(id) on delete set null,
  status public.work_assignment_status not null default 'assigned',
  score numeric(5,2),
  score_breakdown jsonb not null default '{}'::jsonb,
  offered_at timestamptz,
  assigned_at timestamptz not null default now(),
  accepted_at timestamptz,
  declined_at timestamptz,
  expired_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (work_order_id, contractor_id)
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
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_work_order_assignments_work_order_id
  on public.work_order_assignments(work_order_id);

create index if not exists idx_work_order_assignments_contractor_id
  on public.work_order_assignments(contractor_id);

create index if not exists idx_work_order_assignments_status
  on public.work_order_assignments(status);

alter table public.work_order_assignments enable row level security;

drop policy if exists "Contractors can view assigned work" on public.work_order_assignments;
create policy "Contractors can view assigned work"
  on public.work_order_assignments for select
  using (
    exists (
      select 1 from public.contractor_profiles cp
      where cp.id = contractor_id
        and cp.user_id = auth.uid()
    )
  );

drop policy if exists "Contractors can update own assignment response" on public.work_order_assignments;
create policy "Contractors can update own assignment response"
  on public.work_order_assignments for update
  using (
    exists (
      select 1 from public.contractor_profiles cp
      where cp.id = contractor_id
        and cp.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.contractor_profiles cp
      where cp.id = contractor_id
        and cp.user_id = auth.uid()
    )
  );

drop policy if exists "Admins can manage assignments" on public.work_order_assignments;
create policy "Admins can manage assignments"
  on public.work_order_assignments for all
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
    )
  );

create table if not exists public.progress_updates (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  contractor_id uuid references public.contractor_profiles(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  message text not null,
  status text,
  visible_to_customer boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.progress_updates
  add column if not exists work_order_id uuid references public.work_orders(id) on delete cascade,
  add column if not exists contractor_id uuid references public.contractor_profiles(id) on delete set null,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists message text,
  add column if not exists status text,
  add column if not exists visible_to_customer boolean not null default true,
  add column if not exists created_at timestamptz not null default now();

create index if not exists idx_progress_updates_work_order_id
  on public.progress_updates(work_order_id);

create index if not exists idx_progress_updates_contractor_id
  on public.progress_updates(contractor_id);

alter table public.progress_updates enable row level security;

drop policy if exists "Customers can view progress for own work orders" on public.progress_updates;
create policy "Customers can view progress for own work orders"
  on public.progress_updates for select
  using (
    visible_to_customer = true
    and exists (
      select 1 from public.work_orders wo
      where wo.id = work_order_id
        and wo.user_id = auth.uid()
    )
  );

drop policy if exists "Contractors can manage progress for assigned work" on public.progress_updates;
create policy "Contractors can manage progress for assigned work"
  on public.progress_updates for all
  using (
    exists (
      select 1
      from public.contractor_profiles cp
      join public.work_order_assignments woa on woa.contractor_id = cp.id
      where cp.user_id = auth.uid()
        and woa.work_order_id = progress_updates.work_order_id
    )
  )
  with check (
    exists (
      select 1
      from public.contractor_profiles cp
      join public.work_order_assignments woa on woa.contractor_id = cp.id
      where cp.user_id = auth.uid()
        and woa.work_order_id = progress_updates.work_order_id
    )
  );

drop policy if exists "Admins can manage progress updates" on public.progress_updates;
create policy "Admins can manage progress updates"
  on public.progress_updates for all
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
    )
  );

create table if not exists public.work_order_photos (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  contractor_id uuid references public.contractor_profiles(id) on delete set null,
  uploaded_by uuid references auth.users(id) on delete set null,
  storage_path text not null,
  public_url text,
  caption text,
  photo_type text not null default 'progress',
  latitude numeric(10,7),
  longitude numeric(10,7),
  taken_at timestamptz,
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
  add column if not exists taken_at timestamptz,
  add column if not exists created_at timestamptz not null default now();

create index if not exists idx_work_order_photos_work_order_id
  on public.work_order_photos(work_order_id);

create index if not exists idx_work_order_photos_contractor_id
  on public.work_order_photos(contractor_id);

alter table public.work_order_photos enable row level security;

drop policy if exists "Customers can view photos for own work orders" on public.work_order_photos;
create policy "Customers can view photos for own work orders"
  on public.work_order_photos for select
  using (
    exists (
      select 1 from public.work_orders wo
      where wo.id = work_order_id
        and wo.user_id = auth.uid()
    )
  );

drop policy if exists "Contractors can manage photos for assigned work" on public.work_order_photos;
create policy "Contractors can manage photos for assigned work"
  on public.work_order_photos for all
  using (
    exists (
      select 1
      from public.contractor_profiles cp
      join public.work_order_assignments woa on woa.contractor_id = cp.id
      where cp.user_id = auth.uid()
        and woa.work_order_id = work_order_photos.work_order_id
    )
  )
  with check (
    exists (
      select 1
      from public.contractor_profiles cp
      join public.work_order_assignments woa on woa.contractor_id = cp.id
      where cp.user_id = auth.uid()
        and woa.work_order_id = work_order_photos.work_order_id
    )
  );

drop policy if exists "Admins can manage work order photos" on public.work_order_photos;
create policy "Admins can manage work order photos"
  on public.work_order_photos for all
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.role = 'admin'
    )
  );

create index if not exists idx_contractor_profiles_user_id
  on public.contractor_profiles(user_id);

create index if not exists idx_contractor_profiles_approval_status
  on public.contractor_profiles(approval_status);

create index if not exists idx_work_orders_assigned_to
  on public.work_orders(assigned_to);

create index if not exists idx_work_orders_assigned_contractor_id
  on public.work_orders(assigned_contractor_id);

create or replace function public.sync_work_order_assignment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status in ('assigned', 'accepted') then
    update public.work_orders
    set
      assigned_contractor_id = new.contractor_id,
      assigned_to = cp.user_id,
      status = case
        when new.status = 'accepted' then 'accepted'
        else 'assigned'
      end,
      accepted_at = case
        when new.status = 'accepted' then coalesce(new.accepted_at, now())
        else accepted_at
      end
    from public.contractor_profiles cp
    where public.work_orders.id = new.work_order_id
      and cp.id = new.contractor_id;
  end if;

  return new;
end;
$$;

drop trigger if exists sync_work_order_assignment_trigger on public.work_order_assignments;
create trigger sync_work_order_assignment_trigger
  after insert or update of status, contractor_id, accepted_at
  on public.work_order_assignments
  for each row execute function public.sync_work_order_assignment();

do $$
begin
  if exists (
    select 1
    from information_schema.routines
    where routine_schema = 'public'
      and routine_name = 'handle_updated_at'
  ) then
    drop trigger if exists contractor_profiles_updated_at on public.contractor_profiles;
    create trigger contractor_profiles_updated_at
      before update on public.contractor_profiles
      for each row execute function public.handle_updated_at();

    drop trigger if exists work_order_assignments_updated_at on public.work_order_assignments;
    create trigger work_order_assignments_updated_at
      before update on public.work_order_assignments
      for each row execute function public.handle_updated_at();
  end if;
end $$;

grant select, insert, update on public.contractor_profiles to authenticated;
grant select, insert, update on public.work_order_assignments to authenticated;
grant select, insert, update, delete on public.progress_updates to authenticated;
grant select, insert, update, delete on public.work_order_photos to authenticated;
