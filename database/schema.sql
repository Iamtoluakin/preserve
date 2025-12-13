-- Preserve Property Preservation Database Schema
-- PostgreSQL Schema for Property Management System

-- Users and Authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL, -- 'bank_admin', 'vendor_admin', 'field_tech', 'accountant'
    organization_id INTEGER,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organizations (Banks, Lenders, Asset Managers)
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- 'bank', 'lender', 'asset_manager'
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

-- Properties
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    county VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    parcel_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'pending', 'completed', 'on_hold'
    property_type VARCHAR(50), -- 'single_family', 'condo', 'multi_family', 'commercial'
    acquisition_date DATE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work Orders
CREATE TABLE work_orders (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    assigned_to INTEGER REFERENCES users(id),
    work_order_type VARCHAR(100) NOT NULL, -- 'lawn_maintenance', 'securing', 'winterization', 'inspection', 'repair', 'debris_removal'
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'emergency'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'assigned', 'in_progress', 'completed', 'cancelled'
    scheduled_date DATE,
    completed_date DATE,
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    description TEXT,
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inspections
CREATE TABLE inspections (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    work_order_id INTEGER REFERENCES work_orders(id),
    inspector_id INTEGER REFERENCES users(id),
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
    id SERIAL PRIMARY KEY,
    inspection_id INTEGER REFERENCES inspections(id),
    work_order_id INTEGER REFERENCES work_orders(id),
    property_id INTEGER REFERENCES properties(id),
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255),
    file_size INTEGER,
    caption TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    taken_at TIMESTAMP NOT NULL,
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inspection Checklist Items
CREATE TABLE inspection_checklist_items (
    id SERIAL PRIMARY KEY,
    inspection_id INTEGER REFERENCES inspections(id),
    category VARCHAR(100), -- 'exterior', 'lawn', 'security', 'structural', 'utilities'
    item VARCHAR(255) NOT NULL,
    status VARCHAR(50), -- 'good', 'needs_attention', 'critical', 'n/a'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recurring Maintenance Schedules
CREATE TABLE maintenance_schedules (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
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
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    work_order_id INTEGER REFERENCES work_orders(id),
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

-- Vacant Property Registrations (Municipal Compliance)
CREATE TABLE property_registrations (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    municipality VARCHAR(100) NOT NULL,
    registration_number VARCHAR(100),
    registration_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'pending_renewal'
    renewal_reminder_sent BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Log
CREATE TABLE activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    entity_type VARCHAR(50), -- 'property', 'work_order', 'inspection', 'invoice'
    entity_id INTEGER,
    action VARCHAR(100) NOT NULL, -- 'created', 'updated', 'deleted', 'completed', 'assigned'
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50), -- 'work_order', 'inspection_due', 'invoice', 'code_violation', 'renewal_reminder'
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(500),
    read BOOLEAN DEFAULT false,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_properties_organization ON properties(organization_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_work_orders_property ON work_orders(property_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_inspections_property ON inspections(property_id);
CREATE INDEX idx_photos_inspection ON photos(inspection_id);
CREATE INDEX idx_photos_property ON photos(property_id);
CREATE INDEX idx_invoices_organization ON invoices(organization_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Add foreign key constraint for organization_id in users
ALTER TABLE users ADD CONSTRAINT fk_users_organization FOREIGN KEY (organization_id) REFERENCES organizations(id);
