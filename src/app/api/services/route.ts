import { NextResponse } from 'next/server';
import { serviceCatalog } from '@/lib/supabase';

export async function GET() {
  return NextResponse.json({ services: serviceCatalog });
}
