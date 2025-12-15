-- COMPLETE CLEANUP AND FIX
-- Run this entire script in Supabase SQL Editor

-- ============================================
-- STEP 1: Clean up ALL existing data
-- ============================================

-- Delete from dependent tables first
DELETE FROM public.photos;
DELETE FROM public.progress_updates;
DELETE FROM public.invoice_items;
DELETE FROM public.invoices;
DELETE FROM public.work_order_services;
DELETE FROM public.work_orders;
DELETE FROM public.properties;
DELETE FROM public.users;
DELETE FROM public.organizations;

SELECT 'All data cleaned up!' as status;

-- ============================================
-- STEP 2: Recreate the trigger with better error handling
-- ============================================

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  -- Check if user already exists
  SELECT EXISTS(SELECT 1 FROM public.users WHERE id = NEW.id) INTO user_exists;
  
  -- Only insert if user doesn't exist
  IF NOT user_exists THEN
    INSERT INTO public.users (
      id,
      email,
      first_name,
      last_name,
      role,
      active
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'role', 'field_tech'),
      true
    );
  ELSE
    -- If exists, update it
    UPDATE public.users SET
      email = NEW.email,
      first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', first_name),
      last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', last_name),
      role = COALESCE(NEW.raw_user_meta_data->>'role', role),
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the auth user creation
  RAISE WARNING 'Failed to create/update user profile: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

SELECT 'Trigger recreated with improved error handling!' as status;

-- ============================================
-- STEP 3: Verify the setup
-- ============================================

SELECT 'Setup complete! Try signing up now.' as final_status;
SELECT COUNT(*) as user_count FROM public.users;
SELECT COUNT(*) as org_count FROM public.organizations;
