import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabase
      .from('services')
      .select('*')
      .eq('active', true);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('name');

    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json(
        { error: 'Failed to fetch services' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      services: data || [],
    });
  } catch (error) {
    console.error('Services GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
