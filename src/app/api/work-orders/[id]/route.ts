import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// GET single work order
export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('work_orders')
      .select(`
        *,
        property:properties(*),
        services:work_order_services(*, service:services(*)),
        progress_updates:progress_updates(*),
        created_by_user:users(first_name, last_name, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching work order:', error);
      return NextResponse.json(
        { error: 'Work order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      workOrder: data,
    });
  } catch (error) {
    console.error('Work order GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH update work order
export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Remove fields that shouldn't be updated directly
    const { id: _, wo_number, created_at, organization_id, created_by, ...updateData } = body;

    // Update timestamp fields based on status change
    if (updateData.status === 'accepted' && !updateData.accepted_date) {
      updateData.accepted_date = new Date().toISOString();
    }
    if (updateData.status === 'in_progress' && !updateData.started_date) {
      updateData.started_date = new Date().toISOString();
    }
    if (updateData.status === 'completed' && !updateData.completed_date) {
      updateData.completed_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('work_orders')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating work order:', error);
      return NextResponse.json(
        { error: 'Failed to update work order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      workOrder: data,
    });
  } catch (error) {
    console.error('Work order PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE work order
export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('work_orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting work order:', error);
      return NextResponse.json(
        { error: 'Failed to delete work order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Work order deleted successfully',
    });
  } catch (error) {
    console.error('Work order DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
