# PreserveHQ Managed Network Roadmap

## Current Architecture

PreserveHQ is a Next.js App Router application using React, Tailwind utilities, Supabase Auth, and Supabase tables for users, properties, and work orders. The current dashboard experience also uses `localStorage` helpers in `src/lib/localData.ts` for property and work-order workflows. Routes are grouped around the homepage, login, customer dashboard, properties, work orders, inspections, settings, vendor dashboard, and API routes under `src/app/api`.

Authentication is Supabase-based, with a lightweight `preserve-auth` middleware cookie protecting `/dashboard/:path*` and `/vendor/:path*`. The current database schema has organizations, user profiles, properties, work orders, profile sync triggers, and property/work-order summary views.

## Existing Support For The Direction

- Properties are already a core entity in UI and database.
- Customers can add properties and create work orders.
- Work orders already include service type, priority, date, cost, description, and access instructions in local workflows.
- Vendor routes exist as early contractor-facing surfaces.
- Service catalog data exists in `src/lib/supabase.ts`.
- Supabase RLS already limits customer property and work-order data by owner.

## Gaps And Conflicts

- Roles are not formalized beyond authenticated user assumptions.
- Work-order status was previously a loose four-state field.
- Contractor onboarding, approval, assignment, performance, and payout models were missing.
- Service categories were hard-coded in application data instead of configurable records.
- There was no audit trail for status changes.
- There was no property timeline table for permanent operational history.
- Communication and internal notes were not centralized around jobs.
- Admin/dispatcher operations were not modeled.
- Contractor visibility rules were not codified.

## Phased Roadmap

### Foundation

- Formalize roles: customer, contractor, admin.
- Add managed-network work-order lifecycle statuses and legal transitions.
- Add configurable service categories.
- Add contractor profiles/application status.
- Add status audit events and property timeline events.
- Add role-scoped permission helpers and tests.

### Customer Experience

- Convert service request creation from generic work-order creation into a structured request flow.
- Add photo/document upload slots, preferred completion date, access instructions, and approval states.
- Add property timeline views with requests, photos, invoices, receipts, notes, and history.
- Add recurring service management.

### Contractor Experience

- Add contractor application and verification UI.
- Replace generic vendor screens with assigned/offered jobs only.
- Add mobile-first guided job workflow: check-in, checklist, before photos, after photos, notes, completion submit.
- Add offline draft/upload queue support.

### Dispatch And Administration

- Add admin routes for unassigned requests, contractor review, assignment, job monitoring, disputes, and reassignment.
- Add deterministic contractor recommendations using category, distance, availability, insurance, license, score, workload, and history.
- Add internal notes and PreserveHQ-to-contractor messaging.

### Quality Control

- Add required evidence rules per service category.
- Add quality review states and photo review.
- Track rework, missing documentation, late arrivals, late completions, disputes, and customer satisfaction.

### Payments

- Add provider-independent invoice, fee, markup, refund, dispute, and payout tables.
- Keep Stripe/QuickBooks adapters modular and optional until providers are selected.

### Automation And Intelligence

- Add scoring refinements after sufficient operational data exists.
- Add risk flags for late jobs, missing photos, repeated disputes, and overloaded contractors.
- Add assisted scoping and recommended requirements per service category.

## Proposed Data Model

- `users`: profile plus `role` and optional organization.
- `properties`: customer-owned property records.
- `service_categories`: configurable service catalog and requirements.
- `work_orders`: customer requests and jobs with lifecycle status, category, assignment, dates, and instructions.
- `work_order_status_events`: timestamped audit trail for every lifecycle change.
- `work_order_messages`: customer/admin/contractor/internal communication attached to jobs.
- `property_timeline_events`: permanent operational history per property.
- `contractor_profiles`: contractor onboarding, verification, service coverage, performance, and payout readiness.
- `job_assignments`: assignment/offering records with deterministic match score and breakdown.

Later phases should add `job_photos`, `job_checklists`, `bids`, `change_orders`, `invoices`, `payments`, `payouts`, `disputes`, and `recurring_services`.

## Permission Model

- Customers can manage their own properties and service requests.
- Customers can view customer-visible job messages, status events, invoices, photos, and property history for their own properties.
- Contractors can view only their own profile and assigned/offered jobs.
- Contractors cannot view unrelated customer properties or contractor performance data.
- Admins and dispatchers can review customers, contractors, assignments, quality, disputes, and financial summaries.
- Internal contractor performance scores are admin-visible by default.

## Existing Files To Modify

- `src/lib/localData.ts`
- `src/app/api/work-orders/route.ts`
- `src/app/api/work-orders/[id]/route.ts`
- Customer work-order dashboards and detail routes as statuses are adopted.
- Vendor routes when contractor workflows are upgraded.
- Supabase migrations in `database/migrations`.

## New Files Or Modules Required

- `src/lib/operations.js`: shared role, lifecycle, permission, and matching rules.
- `src/lib/operations.d.ts`: TypeScript declarations for the domain module.
- `database/migrations/20260805_managed_network_foundation.sql`: additive managed-network schema.
- `tests/operations.test.mjs`: authorization, lifecycle, and matching tests.

## First Phase Implemented

- Added shared PreserveHQ role constants.
- Added managed work-order lifecycle statuses and legal transition validation.
- Added configurable service-category definitions.
- Added deterministic contractor matching helpers.
- Added role-scoped work-order access helpers.
- Normalized legacy work-order status aliases into the new lifecycle.
- Updated work-order API creation and updates to use lifecycle normalization.
- Added PATCH validation for illegal work-order status transitions.
- Added an additive Supabase migration for roles, contractor profiles, categories, assignments, messages, status events, and property history.
- Added executable Node tests for core workflow and authorization rules.
