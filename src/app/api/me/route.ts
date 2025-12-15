import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get auth header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');
    
    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch user profile with organization
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: profileError },
        { status: 500 }
      );
    }

    // Get properties count
    const { count: propertiesCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });

    // Get work orders count
    const { count: workOrdersCount } = await supabase
      .from('work_orders')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      user: profile,
      stats: {
        properties: propertiesCount || 0,
        workOrders: workOrdersCount || 0,
      },
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
