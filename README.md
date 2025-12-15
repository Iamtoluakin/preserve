# Preserve - REO Property Preservation Platform

A comprehensive B2B property preservation management platform for banks, lenders, asset managers, and preservation contractors serving the REO/foreclosed property market in North Carolina.

## 🏢 Business Overview

Preserve provides **professional property preservation services** for bank-owned and foreclosed homes (REO properties) in North Carolina, including:

- **Routine Maintenance**: Lawn mowing, grounds keeping, landscaping upkeep
- **Property Securing**: Lock changes, boarding windows/doors, lockbox installation
- **Winterization Services**: Plumbing winterization, HVAC shutdown, de-winterization
- **Inspections**: GPS-stamped photo documentation, compliance reporting
- **Preservation Services**: Trash-out, debris removal, minor repairs, painting
- **Compliance**: Municipal code compliance, vacant property registration support

## 💼 Target Market

**Clients (Banks & Asset Managers):**
- Regional and national banks (Wells Fargo, Bank of America, Truist, etc.)
- Mortgage servicers (Ocwen, Mr. Cooper, Nationstar)
- Asset management companies
- REO agents and auction marketplaces
- HUD/government REO properties

**Geographic Focus:** North Carolina (with expansion capability)

## 🎯 Platform Features

### For Banks & Lenders (Client Portal)
- Property management with detailed tracking
- Multi-service work order creation
- Subscription billing (weekly, monthly, quarterly, yearly)
- GPS-stamped photo documentation
- Compliance tracking and reporting
- Automated invoicing

### For Preservation Contractors (Management Portal)
- Work order intake (accept/decline)
- Real-time progress updates
- Photo upload with GPS stamping
- Team/crew assignment
- Job completion tracking

## 🛠 Tech Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- Vercel hosting

## 📊 Industry Resources

### Data Sources
- ATTOM (foreclosure/REO data)
- Auction.com
- HUD Homes
- County court records

### NC Requirements
- LLC formation
- Landscape contractor license
- General liability insurance
- Workers' compensation
- Vacant property registration compliance

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

1. Create a Supabase project at https://supabase.com
2. Copy your credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Run the database migration in Supabase SQL Editor:
   - Open `database/migration-001-initial-schema.sql`
   - Copy and paste into Supabase SQL Editor
   - Run the query

### 3. Verify Setup
```bash
npm run verify-db
```

### 4. Start Development
```bash
npm run dev
```

Visit http://localhost:3000/login and create your first account!

**See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.**

---

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 30 minutes
- **[PHASE1_GUIDE.md](PHASE1_GUIDE.md)** - Complete Phase 1 implementation guide
- **[PHASE1_CHECKLIST.md](PHASE1_CHECKLIST.md)** - Track your progress
- **[API_DOCS.md](API_DOCS.md)** - API reference and examples
- **[WEBAPP_ROADMAP.md](WEBAPP_ROADMAP.md)** - Full development roadmap
- **[BUSINESS_RESOURCES.md](BUSINESS_RESOURCES.md)** - Industry resources and compliance
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Supabase configuration

---

## 🎯 Current Status

**✅ Phase 1: Database & Authentication** - COMPLETE
- User authentication with Supabase Auth
- Organization management (multi-tenant)
- Property CRUD operations
- Work order system with multi-service support
- Progress tracking
- Role-based access control
- Complete API layer with 10 endpoints

**🔄 Next: Integrate API with Dashboard Pages**
- Update existing pages to use API instead of localStorage
- Add loading states and error handling
- Implement protected routes

**🚀 Phase 2: Photo Documentation** - Coming Soon
- Photo upload with GPS stamping
- Photo gallery and viewer
- Supabase Storage integration

See [WEBAPP_ROADMAP.md](WEBAPP_ROADMAP.md) for complete development plan.

---

**Built with ❤️ for the REO property preservation industry**
