-- Fix RLS policies to allow organization creation during signup
-- Run this in Supabase SQL Editor

-- Allow users to create organizations (for signup)
CREATE POLICY "Users can create organizations during signup" ON organizations
    FOR INSERT WITH CHECK (true);

-- Allow users to read organizations they belong to
CREATE POLICY "Users can view their organization" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id FROM users WHERE id = auth.uid()
        )
    );

-- Allow users to update their organization
CREATE POLICY "Users can update their organization" ON organizations
    FOR UPDATE USING (
        id IN (
            SELECT organization_id FROM users WHERE id = auth.uid()
        )
    );

-- Fix the users table policies to allow user creation during signup
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Allow user creation (for signup)
CREATE POLICY "Allow user creation during signup" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Success!
SELECT 'RLS policies updated for signup!' as status;
