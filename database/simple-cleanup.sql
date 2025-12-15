-- SIMPLE CLEANUP - Run this first
-- This will delete all test/existing users so you can start fresh

-- Step 1: Delete from public.users first (to avoid foreign key issues)
DELETE FROM public.users;

-- Step 2: Delete test organizations
DELETE FROM public.organizations;

-- Step 3: Verify everything is clean
SELECT 'Cleanup complete!' as status;
SELECT COUNT(*) as remaining_users FROM public.users;
SELECT COUNT(*) as remaining_orgs FROM public.organizations;
