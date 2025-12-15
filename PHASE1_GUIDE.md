# Phase 1 Implementation Guide
## Database Integration & Authentication

This guide will help you complete Phase 1 of the development roadmap.

---

## ✅ What's Been Implemented

### API Routes Created:
- ✅ `/api/auth/login` - User login
- ✅ `/api/auth/signup` - User registration with organization creation
- ✅ `/api/auth/logout` - User logout
- ✅ `/api/auth/session` - Session verification
- ✅ `/api/properties` - List and create properties
- ✅ `/api/properties/[id]` - Get, update, delete property
- ✅ `/api/work-orders` - List and create work orders
- ✅ `/api/work-orders/[id]` - Get, update, delete work order
- ✅ `/api/progress-updates` - Work order progress tracking
- ✅ `/api/services` - Service catalog

### Components Created:
- ✅ `AuthProvider` - React context for authentication
- ✅ `ProtectedRoute` - Route protection wrapper
- ✅ `RoleBasedRoute` - Role-specific route protection
- ✅ Middleware for route handling

### Database:
- ✅ SQL migration script ready (`database/migration-001-initial-schema.sql`)
- ✅ Supabase client configured
- ✅ TypeScript types defined

---

## 🚀 Setup Steps

### 1. Verify Your Supabase Credentials

Check that your `.env.local` file has the correct values:

```bash
cat .env.local
```

Should show:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

If not, follow `SUPABASE_SETUP.md` to get your credentials.

---

### 2. Run the Database Migration

1. Open Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the entire contents of `database/migration-001-initial-schema.sql`
6. Click **Run** (or press Cmd/Ctrl + Enter)

**Expected output:**
```
Success. No rows returned.
```

This creates:
- All tables (organizations, users, properties, work_orders, etc.)
- Row Level Security (RLS) policies
- Indexes for performance
- Seed data (17 preservation services)

---

### 3. Verify Database Setup

Run the verification script:

```bash
npm run verify-db
```

Or manually with Node:

```bash
node scripts/verify-db.mjs
```

**Expected output:**
```
🔍 Verifying Supabase Connection...

1️⃣ Testing connection...
✅ Successfully connected to Supabase

2️⃣ Checking database tables...
✅ Table 'organizations' exists
✅ Table 'users' exists
✅ Table 'properties' exists
✅ Table 'work_orders' exists
... (all tables)

3️⃣ Checking seed data...
✅ Services table has data

✅ Database verification complete!
```

---

### 4. Start the Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🔐 Testing Authentication

### Create Your First Account:

1. Go to http://localhost:3000/login
2. Click "Create Account" tab
3. Fill in the form:
   - **Email:** your@email.com
   - **Password:** (strong password)
   - **First Name:** Your name
   - **Last Name:** Your last name
   - **Account Type:** Select "Bank/Lender" or "Preservation Vendor"
   - **Organization Name:** Your company name

4. Click "Create Account"

### What Happens:
1. User account created in Supabase Auth
2. Organization record created
3. User profile created and linked to organization
4. Automatic login
5. Redirect to appropriate dashboard

---

## 🎯 Testing API Endpoints

You can test the API using curl or a tool like Postman:

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

### Create Property:
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "your-org-id",
    "userId": "your-user-id",
    "address": "123 Main St",
    "city": "Charlotte",
    "county": "Mecklenburg",
    "state": "NC",
    "zip": "28202",
    "propertyType": "single_family"
  }'
```

### Get All Properties:
```bash
curl http://localhost:3000/api/properties?organizationId=your-org-id
```

---

## 📝 Next Steps - Integrating with Existing Pages

Now that the API is ready, you need to update your existing dashboard pages to use the API instead of localStorage.

### Update Client Dashboard:

1. **`src/app/dashboard/properties/page.tsx`:**
   - Replace localStorage with API calls to `/api/properties`
   - Use `useAuth()` hook to get organization ID
   - Fetch properties on mount with `useEffect`

2. **`src/app/dashboard/work-orders/new/page.tsx`:**
   - Replace localStorage with API calls to `/api/work-orders`
   - Fetch services from `/api/services`
   - Submit work order to API

### Update Vendor Dashboard:

1. **`src/app/vendor/work-orders/page.tsx`:**
   - Fetch work orders from API
   - Filter by organization ID

2. **`src/app/vendor/work-orders/[id]/page.tsx`:**
   - Fetch work order details from API
   - Submit progress updates to `/api/progress-updates`

---

## 🔒 Protected Routes

Wrap your dashboard pages with `ProtectedRoute`:

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {/* Your dashboard content */}
    </ProtectedRoute>
  );
}
```

For role-specific pages:

```tsx
import { RoleBasedRoute } from '@/components/ProtectedRoute';

export default function VendorPage() {
  return (
    <RoleBasedRoute allowedRoles={['vendor_admin', 'field_tech']}>
      {/* Vendor-only content */}
    </RoleBasedRoute>
  );
}
```

---

## 🐛 Troubleshooting

### Error: "Missing Supabase credentials"
- Check `.env.local` file exists
- Verify values are correct (no quotes, no extra spaces)
- Restart dev server after changing .env.local

### Error: "Table does not exist"
- Run the migration SQL in Supabase SQL Editor
- Check for SQL errors in Supabase dashboard
- Make sure you selected the correct project

### Error: "Row Level Security policy violation"
- RLS policies are included in migration
- Make sure you're logged in when making requests
- Check Supabase dashboard → Authentication → Policies

### Authentication Not Working:
- Check browser console for errors
- Verify Supabase URL and key in .env.local
- Clear browser localStorage and cookies
- Try incognito/private mode

---

## 📊 Database Schema Reference

### Main Tables:
- **organizations** - Banks, lenders, vendors
- **users** - User accounts (linked to Supabase Auth)
- **properties** - REO properties being managed
- **work_orders** - Service requests
- **work_order_services** - Services included in each work order
- **services** - Service catalog (17 services pre-loaded)
- **progress_updates** - Work order status updates
- **photos** - Photo documentation (Phase 2)
- **invoices** - Billing (Phase 3)

### Key Relationships:
```
organizations → users (many users per org)
organizations → properties (many properties per org)
properties → work_orders (many WOs per property)
work_orders → work_order_services (many services per WO)
work_orders → progress_updates (many updates per WO)
```

---

## 🎉 Success Criteria

Phase 1 is complete when:
- ✅ Users can sign up and log in
- ✅ Organizations are created automatically
- ✅ Properties can be created, viewed, updated
- ✅ Work orders can be created and assigned
- ✅ Services are loaded from database
- ✅ Progress updates can be added
- ✅ Authentication persists across sessions
- ✅ Role-based access works

---

## 🚀 Moving to Phase 2

Once Phase 1 is stable, you can start Phase 2:
- Photo upload with GPS stamping
- Photo viewer/gallery
- Photo storage in Supabase Storage
- Metadata extraction (EXIF data)

See `WEBAPP_ROADMAP.md` for details.

---

## 📞 Need Help?

If you run into issues:
1. Check the Supabase logs in the dashboard
2. Check browser console for errors
3. Check terminal for server errors
4. Review the migration SQL for any failed queries
5. Make sure your Supabase project is on a paid plan if you need more resources

---

**Happy coding! 🎨**
