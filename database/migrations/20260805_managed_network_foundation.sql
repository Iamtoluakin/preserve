-- PreserveHQ managed-network foundation
-- Adds role, contractor, service category, assignment, audit, communication,
-- and property-history structures without removing existing tables.

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
  create type public.work_order_lifecycle_status as enum (
    'draft',
    'submitted',
    'under-review',
    'awaiting-assignment',
    'offered',
    'assigned',
    'accepted',
    'scheduled',
    'in-progress',
    'awaiting-bid-approval',
    'awaiting-quality-review',
    'awaiting-customer-approval',
    'completed',
    'invoiced',
    'paid',
    'cancelled',
    'disputed'
  );
exception when duplicate_object then null;
end $$;

alter table public.users
  add column if not exists role public.preserve_user_role not null default 'customer',
  add column if not exists organization_id uuid references public.organizations(id) on delete set null;

create table if not exists public.service_categories (
  id text primary key,
  name text not null,
  description text,
  requires_photos boolean not null default true,
  requires_check_in boolean not null default true,
  default_priority text not null default 'normal',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.service_categories enable row level security;

create policy "Authenticated users can view active service categories"
  on public.service_categories for select
  using (active = true);

create table if not exists public.contractor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  business_name text not null,
  contact_name text,
  application_status public.contractor_application_status not null default 'draft',
  service_category_ids text[] not null default '{}',
  coverage_radius_miles integer not null default 25,
  base_city text,
  base_state text,
  insurance_status text not null default 'unverified',
  license_status text not null default 'unverified',
  payout_status text not null default 'not-configured',
  internal_performance_score numeric(5,2) not null default 0,
  acceptance_rate numeric(5,2) not null default 0,
  on_time_rate numeric(5,2) not null default 0,
  completion_rate numeric(5,2) not null default 0,
  quality_score numeric(5,2) not null default 0,
  rework_rate numeric(5,2) not null default 0,
  complaint_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contractor_profiles enable row level security;

create policy "Contractors can view own contractor profile"
  on public.contractor_profiles for select
  using (user_id = auth.uid());

create policy "Contractors can update own draft contractor profile"
  on public.contractor_profiles for update
  using (user_id = auth.uid() and application_status in ('draft', 'submitted'))
  with check (user_id = auth.uid());

create policy "Contractors can create own contractor profile"
  on public.contractor_profiles for insert
  with check (user_id = auth.uid());

alter table public.work_orders
  add column if not exists service_category_id text references public.service_categories(id),
  add column if not exists assigned_contractor_id uuid references public.contractor_profiles(id) on delete set null,
  add column if not exists accepted_at timestamptz,
  add column if not exists started_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists quality_reviewed_at timestamptz,
  add column if not exists customer_approved_at timestamptz,
  add column if not exists invoiced_at timestamptz,
  add column if not exists paid_at timestamptz,
  add column if not exists access_instructions text,
  add column if not exists preferred_completion_date date;

alter table public.work_orders
  alter column status set default 'submitted';

create table if not exists public.work_order_status_events (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  actor_id uuid references auth.users(id) on delete set null,
  actor_role public.preserve_user_role not null default 'customer',
  note text,
  created_at timestamptz not null default now()
);

alter table public.work_order_status_events enable row level security;

create policy "Customers can view status events for own work orders"
  on public.work_order_status_events for select
  using (
    exists (
      select 1 from public.work_orders wo
      where wo.id = work_order_id
        and wo.user_id = auth.uid()
    )
  );

create table if not exists public.work_order_messages (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  sender_role public.preserve_user_role not null,
  visibility text not null default 'customer-admin',
  body text not null,
  attachment_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.work_order_messages enable row level security;

create policy "Customers can view customer-visible work order messages"
  on public.work_order_messages for select
  using (
    visibility in ('customer-admin', 'all')
    and exists (
      select 1 from public.work_orders wo
      where wo.id = work_order_id
        and wo.user_id = auth.uid()
    )
  );

create table if not exists public.property_timeline_events (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  work_order_id uuid references public.work_orders(id) on delete set null,
  event_type text not null,
  title text not null,
  body text,
  actor_id uuid references auth.users(id) on delete set null,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

alter table public.property_timeline_events enable row level security;

create policy "Customers can view own property timeline"
  on public.property_timeline_events for select
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_id
        and p.user_id = auth.uid()
    )
  );

create table if not exists public.job_assignments (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  contractor_id uuid not null references public.contractor_profiles(id) on delete cascade,
  assignment_type text not null default 'manual',
  offered_at timestamptz,
  accepted_at timestamptz,
  declined_at timestamptz,
  assigned_by uuid references auth.users(id) on delete set null,
  score numeric(5,2),
  score_breakdown jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.job_assignments enable row level security;

create policy "Contractors can view own job assignments"
  on public.job_assignments for select
  using (
    exists (
      select 1 from public.contractor_profiles cp
      where cp.id = contractor_id
        and cp.user_id = auth.uid()
    )
  );

insert into public.service_categories (id, name, description, default_priority)
values
  ('inspection', 'Property inspections', 'Interior, exterior, photo, vacancy, and utility inspections.', 'normal'),
  ('lawn-maintenance', 'Lawn maintenance', 'Mowing, edging, grounds care, and recurring yard work.', 'normal'),
  ('trash-out', 'Trash-outs and debris removal', 'Debris removal, trash-outs, hauling, and property cleanup.', 'high'),
  ('securing', 'Lock changes, rekeying, board-ups, and securing', 'Lock changes, rekeying, board-ups, tarping, and vacant property securing.', 'high'),
  ('winterization', 'Winterization and de-winterization', 'Seasonal plumbing and utility protection workflows.', 'normal'),
  ('turnover-cleaning', 'Rental turns and cleaning', 'Move-out cleaning, rental turns, and make-ready services.', 'normal'),
  ('minor-repairs', 'Minor repairs', 'Small repair, patching, maintenance, and handyman work.', 'normal'),
  ('emergency', 'Emergency property services', 'Urgent water, break-in, storm, tarping, and safety response.', 'emergency')
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  default_priority = excluded.default_priority,
  updated_at = now();

drop trigger if exists service_categories_updated_at on public.service_categories;
create trigger service_categories_updated_at
  before update on public.service_categories
  for each row execute function public.handle_updated_at();

drop trigger if exists contractor_profiles_updated_at on public.contractor_profiles;
create trigger contractor_profiles_updated_at
  before update on public.contractor_profiles
  for each row execute function public.handle_updated_at();
