import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/serverSupabase';
import { normalizeWorkflowStatus } from '@/lib/operations.js';

function fromDatabaseWorkOrder(order: Record<string, any>) {
  const status = normalizeWorkflowStatus(order.status);
  const vendorStatus = status === 'assigned' || status === 'offered'
    ? 'new'
    : status === 'in-progress'
      ? 'in_progress'
      : status;

  return {
    id: order.id,
    client: order.client_name || order.customer_name || 'PreserveHQ customer',
    property: order.property_id || order.property_reference || 'Property',
    address: order.property_address || 'Property address not assigned',
    city: order.property_city || '',
    services: [order.service_type || 'Property service'],
    totalCost: Number(order.total_cost || 0),
    priority: order.priority || 'normal',
    status: vendorStatus,
    requestedDate: order.scheduled_date || order.created_at || '',
    acceptedDate: order.accepted_at || null,
    startedDate: order.started_at || null,
    completedDate: order.completed_at || order.completed_date || null,
    createdAt: order.created_at || '',
    notes: order.description || order.access_instructions || '',
    progressUpdates: [],
    photos: [],
  };
}

export async function GET(request: Request) {
  const { supabase, user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  const { data, error: queryError } = await supabase
    .from('work_orders')
    .select('*')
    .eq('assigned_to', user.id)
    .order('created_at', { ascending: false });

  if (queryError) return NextResponse.json({ message: queryError.message }, { status: 500 });
  return NextResponse.json({ workOrders: (data || []).map(fromDatabaseWorkOrder) });
}
