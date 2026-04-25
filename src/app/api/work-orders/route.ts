import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/serverSupabase';

function normalizeStatus(status: unknown) {
  return String(status || 'pending').toLowerCase().replace('_', '-');
}

function toDatabaseWorkOrder(body: Record<string, unknown>, userId: string) {
  return {
    user_id: userId,
    property_id: body.propertyId || body.property_id || null,
    order_number: body.orderNumber || body.order_number || null,
    property_address: body.propertyAddress || body.property_address || null,
    service_type: body.serviceType || body.service_type,
    priority: body.priority || 'normal',
    status: normalizeStatus(body.status),
    scheduled_date: body.scheduledDate || body.scheduled_date || null,
    billing_frequency: body.billingFrequency || body.billing_frequency || 'one-time',
    total_cost: body.totalCost || body.total_cost || 0,
    description: body.description || null,
  };
}

export async function GET(request: Request) {
  const { supabase, user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  const { data, error: queryError } = await supabase
    .from('work_orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (queryError) return NextResponse.json({ message: queryError.message }, { status: 500 });
  return NextResponse.json({ workOrders: data });
}

export async function POST(request: Request) {
  const { supabase, user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  const body = await request.json();
  if (!body.serviceType && !body.service_type) {
    return NextResponse.json({ message: 'serviceType is required.' }, { status: 400 });
  }

  const { data, error: insertError } = await supabase
    .from('work_orders')
    .insert(toDatabaseWorkOrder(body, user.id))
    .select('*')
    .single();

  if (insertError) return NextResponse.json({ message: insertError.message }, { status: 500 });
  return NextResponse.json({ workOrder: data }, { status: 201 });
}
