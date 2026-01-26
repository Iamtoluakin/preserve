# 🔧 Preserve App - Authentication Fix Guide

## Problem Diagnosis

Your app had a mismatch between:
1. **Supabase Auth** (using UUIDs for user IDs)
2. **Custom users table** (using SERIAL/integer IDs)

This caused sign-in failures because the login logic expected UUID-based users, but the database was set up with integer IDs.

## ✅ Fixes Applied

### 1. **Environment Variable Handling** (Fixed)
- Updated `/api/auth/login/route.ts` to use correct environment variable names
- Updated `/api/auth/signup/route.ts` to use correct environment variable names
- Added fallback logic to check both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_URL`

### 2. **Database Schema Migration** (Action Required)
- Created `database/migration-to-uuid.sql` to convert all tables from SERIAL to UUID
- This aligns your database with the UUID-based authentication system

### 3. **Server Restart** (Completed)
- Restarted Next.js dev server to load updated environment variables
- Server is now running at http://localhost:3000

---

## 🚀 Steps to Complete the Fix

### Step 1: Run Database Migration

1. Go to your Supabase dashboard: https://app.supabase.com/project/emafryejesczjbsdegpr
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `/Users/toluakintunde/Preserve/database/migration-to-uuid.sql`
5. Copy all the contents
6. Paste into the Supabase SQL Editor
7. Click **Run** (or press Cmd/Ctrl + Enter)

**⚠️ WARNING:** This migration will DROP all existing tables and recreate them with UUID support. Any existing data will be lost. If you have production data, backup first!

### Step 2: Test Sign Up

1. Open http://localhost:3000 in your browser
2. Click "Sign Up" or go to http://localhost:3000/signup
3. Fill out the form:
   - **First Name**: Test
   - **Last Name**: User
   - **Email**: test@example.com
   - **Password**: Test123!
   - **Organization Name**: Test Bank
   - **Organization Type**: Bank or Vendor
4. Click "Create Account"
5. You should see "Account created successfully!"

### Step 3: Test Sign In

1. Go to http://localhost:3000/login
2. Enter the credentials you just created:
   - **Email**: test@example.com
   - **Password**: Test123!
3. Click "Sign In"
4. You should be redirected to the dashboard at http://localhost:3000/dashboard

### Step 4: Verify Dashboard Works

1. After logging in, you should see the dashboard with:
   - Total Properties: 0
   - Pending Work Orders: 0
   - In Progress: 0
   - Completed: 0
2. The dashboard should display "No properties yet. Add some sample data!"

### Step 5: Add Sample Data (Optional)

If you want to see the dashboard with data:

1. Go to Supabase SQL Editor again
2. Open `/Users/toluakintunde/Preserve/database/sample-data.sql`
3. **BEFORE running**: Update the query to use your organization ID:
   ```sql
   -- Find your organization ID first
   SELECT id, name FROM organizations;
   ```
4. Copy the organization ID
5. Run the sample data script (it will auto-detect your organization)

---

## 🐛 Troubleshooting

### Issue: "Server configuration error"

**Cause:** Environment variables not loaded properly.

**Fix:**
1. Check `.env.local` file exists and has:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://emafryejesczjbsdegpr.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_QCbTrNWaiGnpXAyRts427A_R3Fv9olK
   ```
2. Restart the dev server:
   ```bash
   # Stop the server (Ctrl+C in the terminal)
   npm run dev
   ```

### Issue: "Invalid email or password"

**Possible causes:**
1. User doesn't exist in the database
2. Password hash doesn't match
3. Database schema hasn't been updated

**Fix:**
1. Make sure you ran the migration script (Step 1 above)
2. Create a new account via Sign Up
3. Try logging in again

### Issue: "Failed to create user account"

**Possible causes:**
1. Email already exists
2. Database schema not updated
3. Missing required fields

**Fix:**
1. Try a different email address
2. Check browser console for detailed error (F12 > Console tab)
3. Check terminal for server-side errors
4. Make sure migration was run successfully

### Issue: Database connection errors

**Possible causes:**
1. Supabase project is paused
2. Incorrect Supabase URL or keys
3. Network/firewall issues

**Fix:**
1. Go to Supabase dashboard and verify project is active
2. Check if you can access https://emafryejesczjbsdegpr.supabase.co
3. Regenerate API keys if needed (Project Settings > API)

### Issue: "Row Level Security" errors

**Cause:** RLS policies preventing access.

**Fix:**
The migration script creates basic RLS policies. If you get RLS errors:
1. Temporarily disable RLS for testing:
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
   ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
   ALTER TABLE work_orders DISABLE ROW LEVEL SECURITY;
   ```
2. Note: Service role key bypasses RLS, so API routes should work regardless

---

## 📝 What Changed

### Files Modified:
1. `/src/app/api/auth/login/route.ts` - Fixed environment variable handling
2. `/src/app/api/auth/signup/route.ts` - Fixed environment variable handling
3. `.env.local` - Already had correct values
4. Database schema - Needs migration to UUID (Step 1)

### Files Created:
1. `/database/migration-to-uuid.sql` - Database migration script
2. This guide (`AUTHENTICATION_FIX_GUIDE.md`)

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] Migration script ran without errors
- [ ] Can create a new account (Sign Up works)
- [ ] Can log in with created account
- [ ] Dashboard loads and shows statistics
- [ ] Can navigate to Properties page
- [ ] Can navigate to Work Orders page
- [ ] No console errors in browser (F12 > Console)
- [ ] No server errors in terminal

---

## 🎯 Next Steps After Fix

Once authentication is working:

1. **Add Properties**: Test adding a new property
2. **Create Work Orders**: Test creating work orders for properties
3. **Test All Flows**: Navigate through all pages
4. **Deploy to Vercel**: Update production environment variables
5. **Seed Production Database**: Run migration on production Supabase

---

## 📞 Need More Help?

If you're still experiencing issues:

1. **Check Browser Console**: Press F12 and look for errors in Console tab
2. **Check Network Tab**: See what API calls are failing
3. **Check Terminal**: Look for server-side error messages
4. **Check Supabase Logs**: Go to Supabase Dashboard > Logs

Common error patterns:
- `401 Unauthorized` = Authentication issue
- `403 Forbidden` = Permission/RLS issue  
- `500 Server Error` = Backend/database issue
- `Network Error` = Connection issue

---

## 🔐 Security Notes

- Service role key is used in API routes (server-side only)
- Anon key is used in client-side code (public-facing)
- Passwords are hashed with bcrypt (10 rounds)
- RLS policies protect data at database level
- Never commit `.env.local` to git (already in `.gitignore`)

---

**Happy coding! 🚀**
