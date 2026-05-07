
-- ============================================================
-- Migration: Fix SECURITY DEFINER views
-- Run in: https://app.supabase.com → SQL Editor → New Query
-- Replaces both views with SECURITY INVOKER so RLS is enforced
-- on the calling user, not the view owner.
-- ============================================================

-- 1. Drop old views (they may have been auto-created by Supabase)
drop view if exists public.properties_summary;
drop view if exists public.work_orders_with_property;

-- 2. Recreate properties_summary as SECURITY INVOKER
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

-- 3. Recreate work_orders_with_property as SECURITY INVOKER
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
  p.zip             as property_zip,
  p.property_type,
  p.nickname        as property_nickname
from public.work_orders wo
left join public.properties p on p.id = wo.property_id;

grant select on public.work_orders_with_property to authenticated;

-- 4. Verify: both views should show security_invoker = true
select viewname, definition
from pg_views
where schemaname = 'public'
  and viewname in ('properties_summary', 'work_orders_with_property');
