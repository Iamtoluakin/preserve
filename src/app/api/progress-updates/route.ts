import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all progress updates for a work order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workOrderId = searchParams.get('workOrderId');

    if (!workOrderId) {
      return NextResponse.json(
        { error: 'Work order ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('progress_updates')
      .select(`
        *,
        created_by_user:users(first_name, last_name, email)
      `)
      .eq('work_order_id', workOrderId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching progress updates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch progress updates' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      updates: data || [],
    });
  } catch (error) {
    console.error('Progress updates GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new progress update
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      workOrderId,
      userId,
      status,
      notes,
      percentComplete,
      estimatedCompletion,
    } = body;

    // Validate required fields
    if (!workOrderId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('progress_updates')
      .insert({
        work_order_id: workOrderId,
        created_by: userId,
        status,
        notes,
        percent_complete: percentComplete,
        estimated_completion: estimatedCompletion,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating progress update:', error);
      return NextResponse.json(
        { error: 'Failed to create progress update' },
        { status: 500 }
      );
    }

    // Update work order status if provided
    if (status) {
      await supabase
        .from('work_orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', workOrderId);
    }

    return NextResponse.json({
      success: true,
      update: data,
    });
  } catch (error) {
    console.error('Progress updates POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
