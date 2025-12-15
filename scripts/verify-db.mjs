#!/usr/bin/env node

/**
 * Database Verification Script
 * Checks if Supabase is properly configured and tables are created
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  console.log('🔍 Verifying Supabase Connection...\n');

  // Test connection
  console.log('1️⃣ Testing connection...');
  try {
    const { error } = await supabase.from('organizations').select('count').limit(0);
    if (error) throw error;
    console.log('✅ Successfully connected to Supabase\n');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n💡 Make sure you have run the migration SQL in Supabase SQL Editor');
    process.exit(1);
  }

  // Check tables
  console.log('2️⃣ Checking database tables...');
  const tables = [
    'organizations',
    'users',
    'properties',
    'work_orders',
    'work_order_services',
    'services',
    'progress_updates',
    'photos',
    'invoices',
    'invoice_items',
  ];

  let allTablesExist = true;
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(0);
      if (error) {
        console.log(`❌ Table '${table}' not found`);
        allTablesExist = false;
      } else {
        console.log(`✅ Table '${table}' exists`);
      }
    } catch (error) {
      console.log(`❌ Error checking table '${table}'`);
      allTablesExist = false;
    }
  }

  if (!allTablesExist) {
    console.error('\n❌ Some tables are missing!');
    console.error('💡 Please run the migration SQL file in Supabase:');
    console.error('   database/migration-001-initial-schema.sql');
    process.exit(1);
  }

  console.log('\n3️⃣ Checking seed data...');
  
  // Check services
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('count');

  if (servicesError) {
    console.error('❌ Error checking services:', servicesError.message);
  } else if (!services || services.length === 0) {
    console.log('⚠️  No services found - seed data may not be loaded');
  } else {
    console.log('✅ Services table has data');
  }

  console.log('\n✅ Database verification complete!');
  console.log('\n🚀 Next steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Visit: http://localhost:3000/login');
  console.log('   3. Create your first account');
}

verifyDatabase().catch((error) => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
