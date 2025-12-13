# Database Setup Guide

This guide will help you set up Supabase as the backend database for Preserve.

## What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- PostgreSQL database
- Real-time subscriptions
- Authentication
- Storage
- Auto-generated APIs

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

## Step 2: Create a New Project

1. Click "New Project"
2. Enter project details:
   - **Name**: `preserve` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to North Carolina (e.g., `us-east-1`)
3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

## Step 3: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 4: Configure Environment Variables

1. In your Preserve project folder, create a file named `.env.local`
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace with your actual values from Step 3

## Step 5: Run the Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire contents of `database/schema.sql`
4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned"

## Step 6: Verify Database Setup

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - `organizations`
   - `users`
   - `properties`
   - `work_orders`
   - `service_items`
   - `inspections`
   - `photos`
   - `invoices`
   - `notifications`

## Step 7: Enable Row Level Security (RLS)

The schema already includes RLS policies. To verify:

1. Go to **Authentication** → **Policies**
2. Check that policies are enabled for each table
3. This ensures data security

## Step 8: Test the Connection

1. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

2. Open your browser and check the console for any Supabase errors

3. Try adding a property or creating a work order

## Database Structure

### Main Tables

**organizations** - Banks and lenders
- Stores client information
- Links to users and properties

**users** - User accounts
- Role-based (bank_admin, vendor_admin, technician)
- Linked to organizations

**properties** - Foreclosed/REO properties
- Address, details, status
- Linked to organizations

**work_orders** - Service requests
- Links properties to services
- Status tracking, assignments

**service_items** - Individual services in a work order
- Service type, pricing, quantity
- Calculated totals

**inspections** - Property inspection records
- Photos, findings, compliance

**photos** - GPS-stamped photos
- Linked to inspections or work orders

**invoices** - Billing and payments
- Generated from completed work orders

**notifications** - System notifications
- Alerts for status changes, assignments

## Supabase Features You Can Use

### Real-time Updates
```typescript
const subscription = supabase
  .channel('work_orders')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'work_orders' },
    payload => console.log('New work order!', payload)
  )
  .subscribe();
```

### File Storage
```typescript
const { data, error } = await supabase.storage
  .from('property-photos')
  .upload('photo.jpg', file);
```

### Authentication
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});
```

## Cost

Supabase offers:
- **Free tier**: 500MB database, 1GB storage, 2GB bandwidth
- **Pro tier**: $25/month - 8GB database, 100GB storage, 250GB bandwidth
- Perfect for getting started!

## Deployment to Vercel

When deploying to Vercel:

1. Go to your Vercel project settings
2. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy your application

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)

## Security Best Practices

1. ✅ Never commit `.env.local` to Git (it's in `.gitignore`)
2. ✅ Use environment variables for all sensitive data
3. ✅ Enable Row Level Security (RLS) on all tables
4. ✅ Use the `anon` key for client-side code
5. ✅ Keep your `service_role` key secret (never expose to client)
6. ✅ Regularly backup your database
7. ✅ Monitor your Supabase usage dashboard

## Next Steps

Once database is set up, you can:
1. Enable user authentication
2. Connect forms to save real data
3. Build reporting and analytics
4. Add real-time notifications
5. Implement file upload for photos/documents
