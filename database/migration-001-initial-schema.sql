-- Preserve Platform Database Schema
-- Run this in Supabase SQL Editor after project setup

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ORGANIZATIONS TABLE
-- Banks, lenders, asset managers, and preservation companies
-- =====================================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'bank', 'lender', 'asset_manager', 'preservation_vendor'
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip VARCHAR(10),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USERS TABLE  
-- Integrated with Supabase Auth
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL, -- 'bank_admin', 'vendor_admin', 'field_tech', 'accountant'
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PROPERTIES TABLE
-- REO/foreclosed properties being managed
-- =====================================================
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    county VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL DEFAULT 'NC',
    zip VARCHAR(10) NOT NULL,
    parcel_id VARCHAR(100),
    property_type VARCHAR(50) NOT NULL, -- 'single_family', 'multi_family', 'condo', 'townhouse', 'commercial'
    acquisition_date DATE,
    bank_reference VARCHAR(100),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'pending', 'completed', 'on_hold'
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Index for faster queries
CREATE INDEX idx_properties_organization ON properties(organization_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);

-- =====================================================
-- WORK ORDERS TABLE
-- Service requests from banks to preservation vendors
-- =====================================================
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wo_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'WO-2025-0001'
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES organizations(id) ON DELETE SET NULL, -- Vendor organization
    priority VARCHAR(20) NOT NULL DEFAULT 'normal', -- 'low', 'normal', 'high', 'emergency'
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'accepted', 'in_progress', 'completed', 'declined', 'cancelled'
    scheduled_date DATE,
    accepted_date TIMESTAMP WITH TIME ZONE,
    started_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    description TEXT,
    access_instructions TEXT,
    total_cost DECIMAL(10, 2) DEFAULT 0.00,
    billing_frequency VARCHAR(20) DEFAULT 'one-time', -- 'one-time', 'weekly', 'monthly', 'quarterly', 'yearly'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Index for faster queries
CREATE INDEX idx_work_orders_property ON work_orders(property_id);
CREATE INDEX idx_work_orders_organization ON work_orders(organization_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_assigned_to ON work_orders(assigned_to);

-- Function to generate work order numbers
CREATE OR REPLACE FUNCTION generate_wo_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    seq_num INT;
    new_wo_number TEXT;
BEGIN
    year_part := TO_CHAR(NOW(), 'YYYY');
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(wo_number FROM 9) AS INT)), 0) + 1
    INTO seq_num
    FROM work_orders
    WHERE wo_number LIKE 'WO-' || year_part || '-%';
    
    -- Generate the new work order number
    new_wo_number := 'WO-' || year_part || '-' || LPAD(seq_num::TEXT, 4, '0');
    
    NEW.wo_number := new_wo_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate work order numbers
CREATE TRIGGER trigger_generate_wo_number
    BEFORE INSERT ON work_orders
    FOR EACH ROW
    WHEN (NEW.wo_number IS NULL OR NEW.wo_number = '')
    EXECUTE FUNCTION generate_wo_number();

-- =====================================================
-- SERVICE ITEMS TABLE
-- Individual services within a work order
-- =====================================================
CREATE TABLE service_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    service_id VARCHAR(50) NOT NULL, -- e.g., 'lawn_mowing', 'winterization'
    service_name VARCHAR(255) NOT NULL,
    service_category VARCHAR(50), -- 'lawn_care', 'cleaning', 'security', etc.
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    frequency VARCHAR(50), -- 'monthly', 'quarterly', 'as-needed', etc.
    unit VARCHAR(50), -- 'per visit', 'per opening', 'per load', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_service_items_work_order ON service_items(work_order_id);

-- =====================================================
-- PROGRESS UPDATES TABLE
-- Track work order progress and client communication
-- =====================================================
CREATE TABLE progress_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'accepted', 'in_progress', 'completed', etc.
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_progress_updates_work_order ON progress_updates(work_order_id);

-- =====================================================
-- PHOTOS TABLE
-- GPS-stamped photo documentation
-- =====================================================
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL, -- Supabase Storage path
    file_name VARCHAR(255) NOT NULL,
    file_size INT, -- bytes
    mime_type VARCHAR(50),
    caption TEXT,
    photo_type VARCHAR(50), -- 'before', 'during', 'after', 'inspection'
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    gps_timestamp TIMESTAMP WITH TIME ZONE,
    taken_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_photos_work_order ON photos(work_order_id);
CREATE INDEX idx_photos_property ON photos(property_id);

-- =====================================================
-- INVOICES TABLE
-- Billing and payment tracking
-- =====================================================
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    work_order_id UUID REFERENCES work_orders(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, -- Bill to
    vendor_id UUID REFERENCES organizations(id) ON DELETE SET NULL, -- Bill from
    amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'paid', 'overdue', 'cancelled'
    due_date DATE,
    paid_date DATE,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invoices_organization ON invoices(organization_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- =====================================================
-- SUBSCRIPTIONS TABLE
-- Recurring service contracts
-- =====================================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL,
    billing_frequency VARCHAR(20) NOT NULL, -- 'weekly', 'monthly', 'quarterly', 'yearly'
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'expired', 'cancelled'
    start_date DATE NOT NULL,
    end_date DATE,
    next_billing_date DATE,
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_organization ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- =====================================================
-- COMPLIANCE RECORDS TABLE
-- Municipal code compliance tracking
-- =====================================================
CREATE TABLE compliance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    work_order_id UUID REFERENCES work_orders(id) ON DELETE SET NULL,
    compliance_type VARCHAR(50) NOT NULL, -- 'vacant_property_registration', 'code_violation', 'inspection'
    municipality VARCHAR(100) NOT NULL,
    registration_number VARCHAR(100),
    status VARCHAR(50) NOT NULL, -- 'compliant', 'non_compliant', 'pending'
    violation_description TEXT,
    resolution_notes TEXT,
    compliance_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_compliance_property ON compliance_records(property_id);
CREATE INDEX idx_compliance_status ON compliance_records(status);

-- =====================================================
-- ACTIVITY LOG TABLE
-- Audit trail for all system changes
-- =====================================================
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
    entity_type VARCHAR(50) NOT NULL, -- 'property', 'work_order', 'invoice', etc.
    entity_id UUID,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);

-- =====================================================
-- UPDATE TIMESTAMP FUNCTION
-- Automatically update updated_at column
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at trigger to relevant tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_records_updated_at BEFORE UPDATE ON compliance_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Secure data access based on user roles
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Users can view properties in their organization
CREATE POLICY "Users can view organization properties" ON properties
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM users WHERE id = auth.uid()
        )
    );

-- Users can create properties for their organization
CREATE POLICY "Users can create organization properties" ON properties
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM users WHERE id = auth.uid()
        )
    );

-- Similar policies for work_orders
CREATE POLICY "Users can view organization work orders" ON work_orders
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM users WHERE id = auth.uid()
        )
        OR
        assigned_to IN (
            SELECT organization_id FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can create work orders" ON work_orders
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM users WHERE id = auth.uid()
        )
    );

-- Service items accessible if work order is accessible
CREATE POLICY "Users can view service items" ON service_items
    FOR SELECT USING (
        work_order_id IN (
            SELECT id FROM work_orders WHERE 
                organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
                OR assigned_to IN (SELECT organization_id FROM users WHERE id = auth.uid())
        )
    );

-- =====================================================
-- SEED DATA
-- Initial test data for development
-- =====================================================

-- Insert a test preservation company
INSERT INTO organizations (id, name, type, city, state, contact_email, contact_phone)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Preserve Property Services', 'preservation_vendor', 'Raleigh', 'NC', 'info@preserve-nc.com', '(919) 555-0100'),
    ('00000000-0000-0000-0000-000000000002', 'First National Bank', 'bank', 'Charlotte', 'NC', 'reo@firstnational.com', '(704) 555-0200');

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for work orders with property details
CREATE VIEW work_orders_with_property AS
SELECT 
    wo.*,
    p.address,
    p.city,
    p.county,
    p.state,
    p.zip,
    p.property_type,
    org.name as client_name,
    vendor.name as vendor_name
FROM work_orders wo
JOIN properties p ON wo.property_id = p.id
JOIN organizations org ON wo.organization_id = org.id
LEFT JOIN organizations vendor ON wo.assigned_to = vendor.id;

-- View for active properties with work order counts
CREATE VIEW properties_summary AS
SELECT 
    p.*,
    org.name as organization_name,
    COUNT(DISTINCT wo.id) as total_work_orders,
    COUNT(DISTINCT CASE WHEN wo.status = 'in_progress' THEN wo.id END) as active_work_orders
FROM properties p
JOIN organizations org ON p.organization_id = org.id
LEFT JOIN work_orders wo ON p.id = wo.property_id
GROUP BY p.id, org.name;

-- =====================================================
-- SUCCESS!
-- =====================================================
-- Database schema created successfully!
-- Next steps:
-- 1. Set up authentication in your app
-- 2. Create your first user
-- 3. Start adding properties and work orders
-- =====================================================
