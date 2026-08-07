import { NextResponse } from 'next/server';
import { createServiceSupabaseClient, getAuthenticatedUser } from '@/lib/serverSupabase';

export async function POST(request: Request) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const workOrderId = String(body.workOrderId || '');
  const contractorId = String(body.contractorId || '');
  const score = Number(body.score || 0);
  const scoreBreakdown = body.scoreBreakdown && typeof body.scoreBreakdown === 'object' ? body.scoreBreakdown : {};

  if (!workOrderId || !contractorId) {
    return NextResponse.json({ message: 'workOrderId and contractorId are required.' }, { status: 400 });
  }

  try {
    const supabase = createServiceSupabaseClient();

    const { data: contractor, error: contractorError } = await supabase
      .from('contractor_profiles')
      .select('id,user_id,company_name,business_name,contact_name')
      .eq('id', contractorId)
      .single();

    if (contractorError) throw contractorError;

    await supabase
      .from('work_order_assignments')
      .delete()
      .eq('work_order_id', workOrderId)
      .in('status', ['offered', 'assigned']);

    const { data: assignment, error: assignmentError } = await supabase
      .from('work_order_assignments')
      .insert({
        work_order_id: workOrderId,
        contractor_id: contractorId,
        assigned_by: user.id,
        status: 'assigned',
        score,
        score_breakdown: scoreBreakdown,
        assigned_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (assignmentError) throw assignmentError;

    const { error: workOrderError } = await supabase
      .from('work_orders')
      .update({
        assigned_to: contractor.user_id,
        assigned_contractor_id: contractor.id,
        status: 'assigned',
      })
      .eq('id', workOrderId);

    if (workOrderError) throw workOrderError;

    return NextResponse.json({
      assignment: {
        id: assignment.id,
        workOrderId: assignment.work_order_id,
        contractorId: assignment.contractor_id,
        contractorName: contractor.contact_name || '',
        companyName: contractor.company_name || contractor.business_name || '',
        score: Number(assignment.score || 0),
        assignedAt: assignment.assigned_at || assignment.created_at,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Could not assign work order.' }, { status: 500 });
  }
}
