import { NextResponse } from 'next/server';
import { createServiceSupabaseClient, getAuthenticatedUser } from '@/lib/serverSupabase';
import { normalizeWorkflowStatus } from '@/lib/operations.js';

function fromDatabaseWorkOrder(order: Record<string, any>) {
  const totalCost = Number(order.total_cost || order.estimated_cost || order.actual_cost || 0);

  return {
    id: order.id,
    orderNumber: order.order_number || order.title || order.id,
    propertyId: order.property_id || null,
    propertyAddress: order.property_address || order.address || 'Property address not assigned',
    serviceType: order.service_type || order.service_category_id || order.title || 'Property service',
    status: normalizeWorkflowStatus(order.status),
    priority: order.priority || 'normal',
    scheduledDate: order.scheduled_date || null,
    billingFrequency: order.billing_frequency || 'one-time',
    totalCost,
    billingAmount: totalCost,
    description: order.description || order.notes || '',
    accessInstructions: order.access_instructions || '',
    createdAt: order.created_at || new Date().toISOString(),
    completedDate: order.completed_at || order.completed_date || null,
  };
}

export async function GET(request: Request) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error: queryError } = await supabase
      .from('work_orders')
      .select('*')
      .in('status', ['submitted', 'under-review', 'awaiting-assignment', 'assigned'])
      .order('created_at', { ascending: false })
      .limit(100);

    if (queryError) throw queryError;
    return NextResponse.json({ workOrders: (data || []).map(fromDatabaseWorkOrder) });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Could not load dispatch work orders.' }, { status: 500 });
  }
}
