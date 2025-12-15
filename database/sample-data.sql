-- Add Sample Data for Testing
-- Run this in Supabase SQL Editor after you've signed up

-- Note: Replace YOUR_USER_ID and YOUR_ORG_ID with actual values from your test-data page

-- First, let's check what we have
SELECT 'Current users:' as info;
SELECT id, email, first_name, last_name, organization_id FROM users;

SELECT 'Current organizations:' as info;
SELECT id, name, type FROM organizations;

-- Sample Properties
-- Update the organization_id to match your actual organization
INSERT INTO properties (
  address,
  city,
  county,
  state,
  zip,
  status,
  property_type,
  organization_id,
  lat,
  lng
) VALUES 
(
  '123 Main St',
  'Charlotte',
  'Mecklenburg',
  'NC',
  '28201',
  'active',
  'single_family',
  (SELECT id FROM organizations LIMIT 1),
  35.2271,
  -80.8431
),
(
  '456 Oak Avenue',
  'Raleigh',
  'Wake',
  'NC',
  '27601',
  'active',
  'condo',
  (SELECT id FROM organizations LIMIT 1),
  35.7796,
  -78.6382
),
(
  '789 Elm Street',
  'Durham',
  'Durham',
  'NC',
  '27701',
  'under_contract',
  'single_family',
  (SELECT id FROM organizations LIMIT 1),
  35.9940,
  -78.8986
),
(
  '321 Pine Road',
  'Greensboro',
  'Guilford',
  'NC',
  '27401',
  'active',
  'townhouse',
  (SELECT id FROM organizations LIMIT 1),
  36.0726,
  -79.7920
),
(
  '654 Maple Drive',
  'Winston-Salem',
  'Forsyth',
  'NC',
  '27101',
  'sold',
  'single_family',
  (SELECT id FROM organizations LIMIT 1),
  36.0999,
  -80.2442
);

SELECT 'Sample properties created!' as status;
SELECT COUNT(*) as property_count FROM properties;

-- Sample Work Orders
-- This will create work orders for the properties we just added
INSERT INTO work_orders (
  property_id,
  organization_id,
  description,
  status,
  priority,
  assigned_to,
  scheduled_date,
  total_cost
)
SELECT 
  p.id,
  p.organization_id,
  'Complete initial property inspection and document current condition',
  'new',
  'high',
  (SELECT id FROM organizations LIMIT 1),
  (NOW() + INTERVAL '7 days')::DATE,
  250.00
FROM properties p
WHERE p.address = '123 Main St';

INSERT INTO work_orders (
  property_id,
  organization_id,
  description,
  status,
  priority,
  assigned_to,
  scheduled_date,
  started_date,
  total_cost
)
SELECT 
  p.id,
  p.organization_id,
  'Mow lawn and trim hedges',
  'in_progress',
  'normal',
  (SELECT id FROM organizations LIMIT 1),
  (NOW() + INTERVAL '3 days')::DATE,
  NOW(),
  150.00
FROM properties p
WHERE p.address = '456 Oak Avenue';

INSERT INTO work_orders (
  property_id,
  organization_id,
  description,
  status,
  priority,
  assigned_to,
  scheduled_date,
  completed_date,
  total_cost
)
SELECT 
  p.id,
  p.organization_id,
  'Change all exterior door locks',
  'completed',
  'high',
  (SELECT id FROM organizations LIMIT 1),
  (NOW() - INTERVAL '2 days')::DATE,
  NOW() - INTERVAL '1 day',
  300.00
FROM properties p
WHERE p.address = '789 Elm Street';

SELECT 'Sample work orders created!' as status;
SELECT COUNT(*) as work_order_count FROM work_orders;

-- Summary
SELECT '=== SUMMARY ===' as info;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_organizations FROM organizations;
SELECT COUNT(*) as total_properties FROM properties;
SELECT COUNT(*) as total_work_orders FROM work_orders;

SELECT 'Sample data created successfully! Refresh your dashboard.' as final_status;
