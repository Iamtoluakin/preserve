-- Migration: Convert SERIAL IDs to UUIDs for users table
-- Run this in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 1: Drop existing tables (if this is a fresh setup)
-- WARNING: This will delete all data. Skip if you have production data.
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS inspection_checklist_items CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS work_orders CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS maintenance_schedules CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Step 2: Recreate tables with UUID support

-- Organizations (Banks, Lenders, Asset Managers)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- 'bank', 'preservation_vendor', 'lender', 'asset_manager'
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip VARCHAR(10),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL, -- 'bank_admin', 'vendor_admin', 'field_tech', 'accountant'
    organization_id UUID REFERENCES organizations(id),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    county VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    parcel_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'pending', 'completed', 'on_hold', 'under_contract', 'sold'
    property_type VARCHAR(50), -- 'single_family', 'condo', 'multi_family', 'commercial', 'townhouse'
    acquisition_date DATE,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work Orders
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    organization_id UUID REFERENCES organizations(id),
    assigned_to UUID REFERENCES users(id),
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'assigned', 'in_progress', 'completed', 'cancelled'
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'emergency'
    scheduled_date DATE,
    completed_date DATE,
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inspections
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    work_order_id UUID REFERENCES work_orders(id),
    inspector_id UUID REFERENCES users(id),
    inspection_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'completed', -- 'scheduled', 'in_progress', 'completed'
    overall_condition VARCHAR(50), -- 'excellent', 'good', 'fair', 'poor'
    code_violations BOOLEAN DEFAULT false,
    violation_details TEXT,
    weather_conditions VARCHAR(100),
    temperature DECIMAL(5, 2),
    notes TEXT,
    report_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Photos
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID REFERENCES inspections(id),
    work_order_id UUID REFERENCES work_orders(id),
    property_id UUID REFERENCES properties(id),
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255),
    file_size INTEGER,
    caption TEXT,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    taken_at TIMESTAMP NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inspection Checklist Items
CREATE TABLE inspection_checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID REFERENCES inspections(id),
    category VARCHAR(100), -- 'exterior', 'lawn', 'security', 'structural', 'utilities'
    item VARCHAR(255) NOT NULL,
    status VARCHAR(50), -- 'good', 'needs_attention', 'critical', 'n/a'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recurring Maintenance Schedules
CREATE TABLE maintenance_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    service_type VARCHAR(100) NOT NULL, -- 'lawn_mowing', 'inspection', 'winterization_check'
    frequency VARCHAR(50), -- 'weekly', 'biweekly', 'monthly', 'quarterly'
    start_date DATE NOT NULL,
    end_date DATE,
    last_service_date DATE,
    next_service_date DATE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    work_order_id UUID REFERENCES work_orders(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'paid', 'overdue', 'cancelled'
    paid_date DATE,
    payment_method VARCHAR(50),
    notes TEXT,
    pdf_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Note: These are basic policies. You may need to adjust based on your requirements.

-- Users can view their own organization's data
CREATE POLICY "Users can view own organization data" ON organizations
    FOR SELECT USING (
        id IN (SELECT organization_id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')
    );

CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (
        email = current_setting('request.jwt.claims', true)::json->>'email'
        OR organization_id IN (SELECT organization_id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')
    );

CREATE POLICY "Users can view own organization properties" ON properties
    FOR SELECT USING (
        organization_id IN (SELECT organization_id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')
    );

CREATE POLICY "Users can view own organization work orders" ON work_orders
    FOR SELECT USING (
        organization_id IN (SELECT organization_id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')
    );

-- Grant service role full access (bypasses RLS)
-- This is already done by default in Supabase

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_properties_organization_id ON properties(organization_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_work_orders_property_id ON work_orders(property_id);
CREATE INDEX idx_work_orders_organization_id ON work_orders(organization_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_photos_work_order_id ON photos(work_order_id);
CREATE INDEX idx_photos_property_id ON photos(property_id);

-- Verify tables were created
SELECT 'Database migration complete!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
