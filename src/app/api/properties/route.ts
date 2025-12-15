import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all properties for an organization
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        work_orders:work_orders(count)
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      return NextResponse.json(
        { error: 'Failed to fetch properties' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      properties: data || [],
    });
  } catch (error) {
    console.error('Properties GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      organizationId,
      userId,
      address,
      city,
      county,
      state = 'NC',
      zip,
      parcelId,
      propertyType,
      acquisitionDate,
      bankReference,
      notes,
    } = body;

    // Validate required fields
    if (!organizationId || !address || !city || !county || !zip || !propertyType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('properties')
      .insert({
        organization_id: organizationId,
        created_by: userId,
        address,
        city,
        county,
        state,
        zip,
        parcel_id: parcelId,
        property_type: propertyType,
        acquisition_date: acquisitionDate,
        bank_reference: bankReference,
        notes,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating property:', error);
      return NextResponse.json(
        { error: 'Failed to create property' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      property: data,
    });
  } catch (error) {
    console.error('Properties POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
