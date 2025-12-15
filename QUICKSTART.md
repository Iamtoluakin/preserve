# 🚀 Quick Start Guide

Get your Preserve platform up and running in 30 minutes.

---

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ Git repository initialized
- ✅ Project dependencies installed (`npm install`)

---

## Step 1: Supabase Setup (10 minutes)

### A. Create Supabase Project

1. Go to https://supabase.com and sign up
2. Click "New Project"
3. Choose a name (e.g., "preserve-production")
4. Set a strong database password (save it!)
5. Select region (US East for North Carolina)
6. Wait 2-3 minutes for project to initialize

### B. Get Your Credentials

1. Go to **Project Settings** (gear icon)
2. Click **API** in the left menu
3. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...`

### C. Add to Environment File

1. Open `.env.local` in your project root
2. Add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

---

## Step 2: Database Migration (5 minutes)

### Run the SQL Migration

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `database/migration-001-initial-schema.sql` in your project
4. Copy the entire file
5. Paste into Supabase SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

**✅ Expected:** "Success. No rows returned"

---

## Step 3: Verify Setup (2 minutes)

Run the verification script:

```bash
npm run verify-db
```

**✅ Expected output:**

```
🔍 Verifying Supabase Connection...

1️⃣ Testing connection...
✅ Successfully connected to Supabase

2️⃣ Checking database tables...
✅ Table 'organizations' exists
✅ Table 'users' exists
... (all tables)

3️⃣ Checking seed data...
✅ Services table has data

✅ Database verification complete!
```

---

## Step 4: Start Development (1 minute)

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## Step 5: Create Your First Account (5 minutes)

### A. Sign Up

1. Go to http://localhost:3000/login
2. Click **"Create Account"** tab
3. Fill in the form:
   - Email: your@email.com
   - Password: (strong password)
   - First Name: John
   - Last Name: Doe
   - Account Type: **Bank/Lender** or **Preservation Vendor**
   - Organization Name: Your Company Name
4. Click **"Create Account"**

### B. Verify Success

- You should be automatically logged in
- Redirected to your dashboard
- See your name in the header

### C. Test Logout/Login

1. Click your profile and log out
2. Log back in with your credentials
3. Verify you're redirected to the correct dashboard

---

## Step 6: Test Basic Features (7 minutes)

### A. Create a Property (Bank/Lender Portal)

1. Go to **Properties** → **Add Property**
2. Fill in:
   - Address: 123 Main St
   - City: Charlotte
   - County: Mecklenburg
   - Zip: 28202
   - Property Type: Single Family
3. Click **"Add Property"**
4. Verify it appears in your properties list

### B. Create a Work Order

1. Go to **Work Orders** → **New Work Order**
2. Select the property you just created
3. Add services (lawn care, debris removal, etc.)
4. Set priority and scheduled date
5. Submit the work order
6. Verify it appears in work orders list

### C. Test Vendor Portal (Optional)

1. Sign up as a second user (vendor account)
2. Log in as vendor
3. View available work orders
4. Accept a work order
5. Add a progress update

---

## ✅ Success!

If you can:
- ✅ Sign up and log in
- ✅ Create properties
- ✅ Create work orders
- ✅ View your data

**You're ready to go!** 🎉

---

## 🔄 Next: Update Your Dashboard Pages

Now that the API is working, you need to update your existing pages to use the database instead of localStorage.

See **PHASE1_GUIDE.md** for detailed integration instructions.

---

## 🐛 Troubleshooting

### "Missing Supabase credentials"
- Check `.env.local` file exists and has correct values
- Restart dev server: `Ctrl+C`, then `npm run dev`

### "Table does not exist"
- Run the migration SQL in Supabase SQL Editor
- Check for errors in the Supabase dashboard

### "Cannot connect to Supabase"
- Verify your Supabase project is active
- Check your internet connection
- Verify the URL and key are correct

### Authentication not working
- Clear browser cookies and localStorage
- Try in incognito/private mode
- Check Supabase dashboard → Authentication → Users

---

## 📚 Documentation

- **PHASE1_GUIDE.md** - Detailed setup guide
- **PHASE1_CHECKLIST.md** - Implementation checklist  
- **API_DOCS.md** - Complete API reference
- **SUPABASE_SETUP.md** - Supabase configuration

---

## 🆘 Need Help?

1. Check the **Supabase dashboard logs**
2. Check **browser console** for errors
3. Review the **documentation** files
4. Check **Supabase documentation**: https://supabase.com/docs

---

**Total setup time: ~30 minutes**

Happy coding! 🚀
