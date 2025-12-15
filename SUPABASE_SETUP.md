# Supabase Setup Guide

Follow these steps to set up your Supabase project for the Preserve platform.

## 📋 Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

## 🏗 Step 2: Create New Project

1. Click "New Project"
2. Fill in the details:
   - **Name**: `preserve-production` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (e.g., `us-east-1` for East Coast)
   - **Pricing Plan**: Start with Free tier
3. Click "Create new project"
4. Wait 2-3 minutes for project to initialize

## 🔑 Step 3: Get Your Credentials

1. Once project is ready, go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. You'll see:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)
4. **COPY THESE** - you'll need them in a moment

## 📝 Step 4: Add Credentials to Your Project

1. Open your project folder: `/Users/toluakintunde/Preserve`
2. Open (or create) `.env.local` file
3. Add these lines (replace with YOUR actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Save the file
5. **DO NOT commit this file to git** (it's already in .gitignore)

## ✅ Step 5: Verify Setup

Run this command to check your environment variables are loaded:

```bash
npm run dev
```

If you see the app running without errors, you're good!

## 🗄 Step 6: Create Database Tables (I'll do this for you)

Once you have your credentials added, I'll run the SQL script to create all the tables automatically.

---

## 🚨 Important Notes

- **Keep your credentials secret** - never commit `.env.local` to git
- **Save your database password** - you'll need it for direct database access
- **Free tier limits**: 
  - 500 MB database
  - 1 GB file storage
  - 2 GB bandwidth/month
  - 50,000 monthly active users
  - (More than enough to start!)

---

## 📞 Need Help?

If you get stuck:
1. Check Supabase status: https://status.supabase.com
2. Supabase docs: https://supabase.com/docs
3. Let me know and I'll help troubleshoot!

---

## ⏭ Next Steps (After Setup)

Once you've added your credentials to `.env.local`, tell me and I'll:
1. Create all database tables
2. Set up Row Level Security policies
3. Configure authentication
4. Migrate your data from localStorage

**Ready? Let's do this! 🎉**
