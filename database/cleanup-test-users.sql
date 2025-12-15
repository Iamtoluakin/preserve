-- Cleanup script for test users
-- Run this in Supabase SQL Editor to remove test users and start fresh

-- Delete test users from public.users table
DELETE FROM public.users WHERE email LIKE '%test%' OR email LIKE '%example%';

-- Delete test organizations (optional - comment out if you want to keep them)
DELETE FROM public.organizations WHERE contact_email LIKE '%test%' OR contact_email LIKE '%example%';

-- Delete auth users (this will cascade to public.users due to foreign key)
-- Note: You may need to do this manually in Supabase Auth UI if this doesn't work
DELETE FROM auth.users WHERE email LIKE '%test%' OR email LIKE '%example%';

-- Success message
SELECT 'Test data cleaned up!' as status;

-- Show remaining users (should be empty or only real users)
SELECT id, email, first_name, last_name, role FROM public.users;
