-- ============================================================
-- Migration: Ensure user_id exists on properties & work_orders,
--            then recreate views as SECURITY INVOKER.
-- Run in: https://app.supabase.com → SQL Editor → New Query
-- ============================================================

-- ─── 1. Add user_id to properties if missing ────────────────
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'properties'
      and column_name  = 'user_id'
  ) then
    alter table public.properties
      add column user_id uuid references auth.users(id) on delete cascade;

    -- Backfill: assign existing rows to the first admin user (optional)
    -- update public.properties set user_id = '<your-user-uuid>' where user_id is null;

    alter table public.properties
      alter column user_id set not null;
  end if;
end $$;

-- ─── 2. Add user_id to work_orders if missing ───────────────
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'work_orders'
      and column_name  = 'user_id'
  ) then
    alter table public.work_orders
      add column user_id uuid references auth.users(id) on delete cascade;

    alter table public.work_orders
      alter column user_id set not null;
  end if;
end $$;

-- ─── 3. Ensure RLS is enabled ───────────────────────────────
alter table public.properties  enable row level security;
alter table public.work_orders enable row level security;

-- ─── 4. Recreate RLS policies (idempotent) ──────────────────
drop policy if exists "Users manage own properties"  on public.properties;
create policy "Users manage own properties"
  on public.properties for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own work orders" on public.work_orders;
create policy "Users manage own work orders"
  on public.work_orders for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── 5. Drop old views ──────────────────────────────────────
drop view if exists public.properties_summary cascade;
drop view if exists public.work_orders_with_property cascade;

-- ─── 6. Recreate properties_summary (SECURITY INVOKER) ──────
create view public.properties_summary
  with (security_invoker = true)
as
select
  p.id,
  p.user_id,
  p.address,
  p.city,
  p.county,
  p.state,
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

grant select on public.properties_summary to authenticated;

-- ─── 7. Recreate work_orders_with_property (SECURITY INVOKER) ─
create view public.work_orders_with_property
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
  p.address      as property_full_address,
  p.city         as property_city,
  p.county       as property_county,
  p.state        as property_state,
  p.zip          as property_zip,
  p.property_type,
  p.nickname     as property_nickname
from public.work_orders wo
left join public.properties p on p.id = wo.property_id;

grant select on public.work_orders_with_property to authenticated;

-- ─── 8. Verify ──────────────────────────────────────────────
-- Check columns exist
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('properties', 'work_orders')
  and column_name = 'user_id';

-- Check views are SECURITY INVOKER
select viewname, definition
from pg_views
where schemaname = 'public'
  and viewname in ('properties_summary', 'work_orders_with_property');
