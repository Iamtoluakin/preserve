-- Disable RLS on users table to allow signup
-- Run this in Supabase SQL Editor

-- Remove all existing policies on users
DROP POLICY IF EXISTS "Allow user creation during signup" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Disable RLS on users (we'll secure at API level)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Success!
SELECT 'Users table RLS disabled - signup should work now!' as status;
