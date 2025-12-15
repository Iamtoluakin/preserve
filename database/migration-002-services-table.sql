-- Additional tables for services and work order services
-- Run this in Supabase SQL Editor

-- =====================================================
-- SERVICES TABLE
-- Service catalog (lawn care, maintenance, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'lawn_mowing'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'lawn_care', 'cleaning', 'security', etc.
    base_price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50), -- 'per visit', 'per opening', 'per load', etc.
    frequency VARCHAR(50), -- 'monthly', 'quarterly', 'as-needed', etc.
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- WORK ORDER SERVICES TABLE
-- Many-to-many relationship between work orders and services
-- =====================================================
CREATE TABLE IF NOT EXISTS work_order_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    billing_frequency VARCHAR(20) DEFAULT 'one-time',
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_work_order_services_wo ON work_order_services(work_order_id);
CREATE INDEX IF NOT EXISTS idx_work_order_services_service ON work_order_services(service_id);

-- =====================================================
-- SEED DATA - Service Catalog
-- =====================================================
INSERT INTO services (service_id, name, description, category, base_price, unit, frequency) VALUES
('lawn_mowing', 'Lawn Mowing & Maintenance', 'Regular lawn cutting, edging, and grass removal', 'lawn_care', 100.00, 'per visit', 'monthly'),
('lawn_cleanup', 'Lawn Debris Cleanup', 'Removal of leaves, branches, and yard waste', 'lawn_care', 75.00, 'per visit', 'as-needed'),
('exterior_cleaning', 'Exterior Property Cleaning', 'Sweep walkways, remove cobwebs, clean gutters', 'cleaning', 200.00, 'per visit', 'monthly'),
('pressure_washing', 'Pressure Washing', 'Driveway, walkways, siding, and exterior surfaces', 'cleaning', 300.00, 'per visit', 'quarterly'),
('window_cleaning', 'Window Cleaning (Exterior)', 'Clean all exterior windows and glass doors', 'cleaning', 150.00, 'per visit', 'quarterly'),
('property_securing', 'Property Securing', 'Install lockboxes, secure doors/windows, change locks', 'security', 250.00, 'one-time', 'as-needed'),
('board_up', 'Window/Door Board-Up', 'Board up broken windows or damaged doors', 'security', 150.00, 'per opening', 'as-needed'),
('winterization', 'Winterization Service', 'Drain pipes, antifreeze in drains, HVAC shutdown', 'seasonal', 350.00, 'one-time', 'seasonal'),
('de_winterization', 'De-Winterization Service', 'Restore water, test systems, prepare for occupancy', 'seasonal', 300.00, 'one-time', 'seasonal'),
('hvac_check', 'HVAC System Check', 'Inspect and test heating/cooling systems', 'inspection', 125.00, 'per visit', 'quarterly'),
('full_inspection', 'Full Property Inspection', 'Complete interior/exterior inspection with photos', 'inspection', 200.00, 'per visit', 'monthly'),
('photo_documentation', 'Photo Documentation', 'GPS-stamped photos of property condition', 'inspection', 50.00, 'per visit', 'monthly'),
('debris_removal', 'Debris & Trash Removal', 'Remove and haul away debris, furniture, trash', 'maintenance', 400.00, 'per load', 'as-needed'),
('minor_repairs', 'Minor Repairs', 'Small repairs, patching, touch-up painting', 'maintenance', 150.00, 'per hour', 'as-needed'),
('gutter_cleaning', 'Gutter Cleaning', 'Clean gutters and downspouts', 'maintenance', 125.00, 'per visit', 'quarterly'),
('pest_control', 'Pest Control Treatment', 'Pest inspection and treatment', 'maintenance', 175.00, 'per visit', 'quarterly'),
('emergency_response', 'Emergency Response', '24/7 emergency response (water, break-in, etc.)', 'emergency', 500.00, 'per visit', 'as-needed')
ON CONFLICT (service_id) DO NOTHING;

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_services ENABLE ROW LEVEL SECURITY;

-- Services are readable by all authenticated users
CREATE POLICY "Services are viewable by authenticated users" ON services
    FOR SELECT USING (auth.role() = 'authenticated');

-- Work order services accessible if work order is accessible
CREATE POLICY "Users can view work order services" ON work_order_services
    FOR SELECT USING (
        work_order_id IN (
            SELECT id FROM work_orders WHERE 
                organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
                OR assigned_to IN (SELECT organization_id FROM users WHERE id = auth.uid())
        )
    );

CREATE POLICY "Users can create work order services" ON work_order_services
    FOR INSERT WITH CHECK (
        work_order_id IN (
            SELECT id FROM work_orders WHERE 
                organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
        )
    );

-- Success!
SELECT 'Services table created and seeded with 17 services!' as status;
