import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const message = 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.';
  if (typeof window === 'undefined') {
    throw new Error(message);
  }
  console.error(message);
}

export const supabase = createClient(
  supabaseUrl || 'https://missing-supabase-url.invalid',
  supabaseAnonKey || 'missing-supabase-anon-key',
  {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
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
    basePrice: 65,
    unit: 'per visit',
    frequency: 'monthly',
    marketRange: {
      nc: '$40-$65/visit',
      tx: '$45-$75/visit',
    },
    icon: 'grass',
    color: 'green'
  },
  {
    id: 'lawn_cleanup',
    name: 'Lawn Debris Cleanup',
    category: 'Lawn Care',
    description: 'Removal of leaves, branches, and yard waste',
    basePrice: 150,
    unit: 'per visit',
    frequency: 'as-needed',
    marketRange: {
      nc: '$90-$250/visit',
      tx: '$100-$275/visit',
    },
    icon: 'trash',
    color: 'green'
  },
  {
    id: 'exterior_cleaning',
    name: 'Exterior Property Cleaning',
    category: 'Cleaning',
    description: 'Sweep walkways, remove cobwebs, clean gutters',
    basePrice: 225,
    unit: 'per visit',
    frequency: 'monthly',
    marketRange: {
      nc: '$150-$350/visit',
      tx: '$175-$400/visit',
    },
    icon: 'broom',
    color: 'blue'
  },
  {
    id: 'pressure_washing',
    name: 'Pressure Washing',
    category: 'Cleaning',
    description: 'Driveway, walkways, siding, and exterior surfaces',
    basePrice: 275,
    unit: 'per visit',
    frequency: 'quarterly',
    marketRange: {
      nc: '$135-$450/project',
      tx: '$250-$550/house wash',
    },
    icon: 'spray',
    color: 'blue'
  },
  {
    id: 'window_cleaning',
    name: 'Window Cleaning (Exterior)',
    category: 'Cleaning',
    description: 'Clean all exterior windows and glass doors',
    basePrice: 225,
    unit: 'per visit',
    frequency: 'quarterly',
    marketRange: {
      nc: '$5.50-$9.20/pane',
      tx: '$200-$600/home',
    },
    icon: 'window',
    color: 'blue'
  },
  {
    id: 'interior_house_cleaning',
    name: 'Interior House Cleaning',
    category: 'House Cleaning',
    description: 'Kitchen, bathrooms, floors, dusting, and surface sanitizing',
    basePrice: 180,
    unit: 'per visit',
    frequency: 'monthly',
    marketRange: {
      nc: '$100-$300/visit',
      tx: '$120-$280/visit',
    },
    icon: 'sparkles',
    color: 'teal'
  },
  {
    id: 'move_out_deep_clean',
    name: 'Move-Out Deep Clean',
    category: 'House Cleaning',
    description: 'Full interior clean after vacancy, foreclosure, or tenant turnover',
    basePrice: 500,
    unit: 'one-time',
    frequency: 'as-needed',
    marketRange: {
      nc: '$300-$900/clean',
      tx: '$150-$750/clean',
    },
    icon: 'home',
    color: 'teal'
  },
  {
    id: 'odor_sanitation',
    name: 'Odor & Sanitation Treatment',
    category: 'House Cleaning',
    description: 'Deodorizing and sanitizing for stale, smoke, pet, or vacancy odors',
    basePrice: 275,
    unit: 'per treatment',
    frequency: 'as-needed',
    marketRange: {
      nc: '$200-$600/treatment',
      tx: '$200-$600/treatment',
    },
    icon: 'spray',
    color: 'teal'
  },
  {
    id: 'property_securing',
    name: 'Property Securing',
    category: 'Security',
    description: 'Install lockboxes, secure doors/windows, change locks',
    basePrice: 225,
    unit: 'one-time',
    frequency: 'as-needed',
    marketRange: {
      nc: '$150-$350/job',
      tx: '$150-$400/job',
    },
    icon: 'lock',
    color: 'orange'
  },
  {
    id: 'board_up',
    name: 'Window/Door Board-Up',
    category: 'Security',
    description: 'Board up broken windows or damaged doors',
    basePrice: 200,
    unit: 'per opening',
    frequency: 'as-needed',
    marketRange: {
      nc: '$175-$280/opening',
      tx: '$175-$280/opening',
    },
    icon: 'shield',
    color: 'orange'
  },
  {
    id: 'winterization',
    name: 'Winterization Service',
    category: 'Seasonal',
    description: 'Drain pipes, antifreeze in drains, HVAC shutdown',
    basePrice: 300,
    unit: 'one-time',
    frequency: 'seasonal',
    marketRange: {
      nc: '$250-$450/season',
      tx: '$200-$400/season',
    },
    icon: 'snowflake',
    color: 'cyan'
  },
  {
    id: 'de_winterization',
    name: 'De-Winterization Service',
    category: 'Seasonal',
    description: 'Restore water, test systems, prepare for occupancy',
    basePrice: 225,
    unit: 'one-time',
    frequency: 'seasonal',
    marketRange: {
      nc: '$175-$350/season',
      tx: '$175-$325/season',
    },
    icon: 'sun',
    color: 'yellow'
  },
  {
    id: 'hvac_check',
    name: 'HVAC System Check',
    category: 'Inspection',
    description: 'Inspect and test heating/cooling systems',
    basePrice: 140,
    unit: 'per visit',
    frequency: 'quarterly',
    marketRange: {
      nc: '$120-$175/visit',
      tx: '$75-$250/visit',
    },
    icon: 'thermometer',
    color: 'purple'
  },
  {
    id: 'full_inspection',
    name: 'Full Property Inspection',
    category: 'Inspection',
    description: 'Complete interior/exterior inspection with photos',
    basePrice: 425,
    unit: 'per visit',
    frequency: 'monthly',
    marketRange: {
      nc: '$375-$725/inspection',
      tx: '$350-$600/inspection',
    },
    icon: 'clipboard',
    color: 'purple'
  },
  {
    id: 'photo_documentation',
    name: 'Photo Documentation',
    category: 'Inspection',
    description: 'GPS-stamped photos of property condition',
    basePrice: 75,
    unit: 'per visit',
    frequency: 'monthly',
    marketRange: {
      nc: '$50-$125/visit',
      tx: '$50-$125/visit',
    },
    icon: 'camera',
    color: 'purple'
  },
  {
    id: 'debris_removal',
    name: 'Debris & Trash Removal',
    category: 'Maintenance',
    description: 'Remove and haul away debris, furniture, trash',
    basePrice: 488,
    unit: 'per load',
    frequency: 'as-needed',
    marketRange: {
      nc: '$135-$738/load',
      tx: '$150-$700/load',
    },
    icon: 'truck',
    color: 'red'
  },
  {
    id: 'minor_repairs',
    name: 'Minor Repairs',
    category: 'Maintenance',
    description: 'Small repairs, patching, touch-up painting',
    basePrice: 125,
    unit: 'per hour',
    frequency: 'as-needed',
    marketRange: {
      nc: '$75-$150/hour',
      tx: '$75-$150/hour',
    },
    icon: 'wrench',
    color: 'gray'
  },
  {
    id: 'gutter_cleaning',
    name: 'Gutter Cleaning',
    category: 'Maintenance',
    description: 'Clean gutters and downspouts',
    basePrice: 175,
    unit: 'per visit',
    frequency: 'quarterly',
    marketRange: {
      nc: '$150-$450/cleaning',
      tx: '$150-$431/cleaning',
    },
    icon: 'droplet',
    color: 'blue'
  },
  {
    id: 'pest_control',
    name: 'Pest Control Treatment',
    category: 'Maintenance',
    description: 'Pest inspection and treatment',
    basePrice: 125,
    unit: 'per visit',
    frequency: 'quarterly',
    marketRange: {
      nc: '$75-$200/inspection',
      tx: '$75-$200/inspection',
    },
    icon: 'bug',
    color: 'green'
  },
  {
    id: 'emergency_response',
    name: 'Emergency Response',
    category: 'Emergency',
    description: '24/7 emergency response (water, break-in, etc.)',
    basePrice: 650,
    unit: 'per visit',
    frequency: 'as-needed',
    marketRange: {
      nc: '$500-$1,200/emergency',
      tx: '$500-$1,200/emergency',
    },
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
