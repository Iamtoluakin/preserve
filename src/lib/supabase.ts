import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please check your .env.local or Vercel environment variables.');
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    }
  }
);

// Database types
export type Property = {
  id: string;
  address: string;
  city: string;
  county: string;
  state: string;
  zip: string;
  parcel_id?: string;
  property_type: string;
  acquisition_date?: string;
  bank_reference?: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
  organization_id: string;
};

export type WorkOrder = {
  id: string;
  property_id: string;
  service_type: string;
  priority: string;
  scheduled_date: string;
  description: string;
  urgency?: string;
  access_instructions?: string;
  status: string;
  assigned_to?: string;
  total_cost?: number;
  created_at: string;
  updated_at: string;
  organization_id: string;
};

export type ServiceItem = {
  id: string;
  work_order_id: string;
  service_name: string;
  service_type: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  frequency?: string;
  created_at: string;
};

// Service catalog with pricing
export const serviceCatalog = [
  {
    id: 'lawn_mowing',
    name: 'Lawn Mowing & Maintenance',
    category: 'Lawn Care',
    description: 'Regular lawn cutting, edging, and grass removal',
    basePrice: 100,
    unit: 'per visit',
    frequency: 'monthly',
    icon: 'grass',
    color: 'green'
  },
  {
    id: 'lawn_cleanup',
    name: 'Lawn Debris Cleanup',
    category: 'Lawn Care',
    description: 'Removal of leaves, branches, and yard waste',
    basePrice: 75,
    unit: 'per visit',
    frequency: 'as-needed',
    icon: 'trash',
    color: 'green'
  },
  {
    id: 'exterior_cleaning',
    name: 'Exterior Property Cleaning',
    category: 'Cleaning',
    description: 'Sweep walkways, remove cobwebs, clean gutters',
    basePrice: 200,
    unit: 'per visit',
    frequency: 'monthly',
    icon: 'broom',
    color: 'blue'
  },
  {
    id: 'pressure_washing',
    name: 'Pressure Washing',
    category: 'Cleaning',
    description: 'Driveway, walkways, siding, and exterior surfaces',
    basePrice: 300,
    unit: 'per visit',
    frequency: 'quarterly',
    icon: 'spray',
    color: 'blue'
  },
  {
    id: 'window_cleaning',
    name: 'Window Cleaning (Exterior)',
    category: 'Cleaning',
    description: 'Clean all exterior windows and glass doors',
    basePrice: 150,
    unit: 'per visit',
    frequency: 'quarterly',
    icon: 'window',
    color: 'blue'
  },
  {
    id: 'property_securing',
    name: 'Property Securing',
    category: 'Security',
    description: 'Install lockboxes, secure doors/windows, change locks',
    basePrice: 250,
    unit: 'one-time',
    frequency: 'as-needed',
    icon: 'lock',
    color: 'orange'
  },
  {
    id: 'board_up',
    name: 'Window/Door Board-Up',
    category: 'Security',
    description: 'Board up broken windows or damaged doors',
    basePrice: 150,
    unit: 'per opening',
    frequency: 'as-needed',
    icon: 'shield',
    color: 'orange'
  },
  {
    id: 'winterization',
    name: 'Winterization Service',
    category: 'Seasonal',
    description: 'Drain pipes, antifreeze in drains, HVAC shutdown',
    basePrice: 350,
    unit: 'one-time',
    frequency: 'seasonal',
    icon: 'snowflake',
    color: 'cyan'
  },
  {
    id: 'de_winterization',
    name: 'De-Winterization Service',
    category: 'Seasonal',
    description: 'Restore water, test systems, prepare for occupancy',
    basePrice: 300,
    unit: 'one-time',
    frequency: 'seasonal',
    icon: 'sun',
    color: 'yellow'
  },
  {
    id: 'hvac_check',
    name: 'HVAC System Check',
    category: 'Inspection',
    description: 'Inspect and test heating/cooling systems',
    basePrice: 125,
    unit: 'per visit',
    frequency: 'quarterly',
    icon: 'thermometer',
    color: 'purple'
  },
  {
    id: 'full_inspection',
    name: 'Full Property Inspection',
    category: 'Inspection',
    description: 'Complete interior/exterior inspection with photos',
    basePrice: 200,
    unit: 'per visit',
    frequency: 'monthly',
    icon: 'clipboard',
    color: 'purple'
  },
  {
    id: 'photo_documentation',
    name: 'Photo Documentation',
    category: 'Inspection',
    description: 'GPS-stamped photos of property condition',
    basePrice: 50,
    unit: 'per visit',
    frequency: 'monthly',
    icon: 'camera',
    color: 'purple'
  },
  {
    id: 'debris_removal',
    name: 'Debris & Trash Removal',
    category: 'Maintenance',
    description: 'Remove and haul away debris, furniture, trash',
    basePrice: 400,
    unit: 'per load',
    frequency: 'as-needed',
    icon: 'truck',
    color: 'red'
  },
  {
    id: 'minor_repairs',
    name: 'Minor Repairs',
    category: 'Maintenance',
    description: 'Small repairs, patching, touch-up painting',
    basePrice: 150,
    unit: 'per hour',
    frequency: 'as-needed',
    icon: 'wrench',
    color: 'gray'
  },
  {
    id: 'gutter_cleaning',
    name: 'Gutter Cleaning',
    category: 'Maintenance',
    description: 'Clean gutters and downspouts',
    basePrice: 125,
    unit: 'per visit',
    frequency: 'quarterly',
    icon: 'droplet',
    color: 'blue'
  },
  {
    id: 'pest_control',
    name: 'Pest Control Treatment',
    category: 'Maintenance',
    description: 'Pest inspection and treatment',
    basePrice: 175,
    unit: 'per visit',
    frequency: 'quarterly',
    icon: 'bug',
    color: 'green'
  },
  {
    id: 'emergency_response',
    name: 'Emergency Response',
    category: 'Emergency',
    description: '24/7 emergency response (water, break-in, etc.)',
    basePrice: 500,
    unit: 'per visit',
    frequency: 'as-needed',
    icon: 'alert',
    color: 'red'
  }
];

// Helper function to calculate monthly cost based on frequency
export function calculateMonthlyCost(basePrice: number, frequency: string): number {
  switch (frequency) {
    case 'weekly':
      return basePrice * 4;
    case 'bi-weekly':
      return basePrice * 2;
    case 'monthly':
      return basePrice;
    case 'quarterly':
      return basePrice / 3;
    case 'seasonal':
      return basePrice / 4;
    case 'yearly':
      return basePrice / 12;
    default:
      return basePrice;
  }
}
