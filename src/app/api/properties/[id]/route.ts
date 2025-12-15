import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// GET single property
export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        work_orders:work_orders(*),
        created_by_user:users(first_name, last_name, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      property: data,
    });
  } catch (error) {
    console.error('Property GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH update property
export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Remove fields that shouldn't be updated directly
    const { id: _, created_at, organization_id, created_by, ...updateData } = body;

    const { data, error } = await supabase
      .from('properties')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating property:', error);
      return NextResponse.json(
        { error: 'Failed to update property' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      property: data,
    });
  } catch (error) {
    console.error('Property PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE property
export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting property:', error);
      return NextResponse.json(
        { error: 'Failed to delete property' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Property DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
