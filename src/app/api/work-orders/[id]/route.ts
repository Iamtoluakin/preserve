import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/serverSupabase';
import { canTransitionWorkOrder, normalizeWorkflowStatus } from '@/lib/operations.js';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function toWorkOrderUpdate(body: Record<string, unknown>) {
  const update: Record<string, unknown> = {};

  if ('status' in body) update.status = normalizeWorkflowStatus(body.status || 'submitted');
  if ('priority' in body) update.priority = body.priority;
  if ('scheduledDate' in body || 'scheduled_date' in body) update.scheduled_date = body.scheduledDate || body.scheduled_date;
  if ('description' in body) update.description = body.description;
  if ('totalCost' in body || 'total_cost' in body) update.total_cost = body.totalCost || body.total_cost;
  if ('billingFrequency' in body || 'billing_frequency' in body) update.billing_frequency = body.billingFrequency || body.billing_frequency;

  return update;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { supabase, user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  const { data, error: queryError } = await supabase
    .from('work_orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (queryError) return NextResponse.json({ message: queryError.message }, { status: 404 });
  return NextResponse.json({ workOrder: data });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { supabase, user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  const body = await request.json();
  const update = toWorkOrderUpdate(body);
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ message: 'No supported fields to update.' }, { status: 400 });
  }

  if (typeof update.status === 'string') {
    const { data: existing, error: existingError } = await supabase
      .from('work_orders')
      .select('status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (existingError) return NextResponse.json({ message: existingError.message }, { status: 404 });

    if (!canTransitionWorkOrder(existing.status, update.status)) {
      return NextResponse.json(
        { message: `Illegal work order transition: ${existing.status} -> ${update.status}` },
        { status: 400 }
      );
    }
  }

  const { data, error: updateError } = await supabase
    .from('work_orders')
    .update(update)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (updateError) return NextResponse.json({ message: updateError.message }, { status: 500 });
  return NextResponse.json({ workOrder: data });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { supabase, user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  const { error: deleteError } = await supabase
    .from('work_orders')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (deleteError) return NextResponse.json({ message: deleteError.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
