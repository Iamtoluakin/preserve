import { NextResponse } from 'next/server';
import { createServiceSupabaseClient, getAuthenticatedUser } from '@/lib/serverSupabase';

function fromDatabaseProfile(profile: Record<string, any>) {
  return {
    id: profile.id || profile.user_id,
    userId: profile.user_id,
    companyName: profile.company_name || profile.business_name || '',
    contactName: profile.contact_name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    approvalStatus: profile.approval_status || profile.application_status || 'submitted',
    serviceCategories: profile.service_categories || profile.service_category_ids || [],
    coverageZipCodes: profile.coverage_zip_codes || [],
    coverageRadiusMiles: Number(profile.coverage_radius_miles || 25),
    insuranceStatus: profile.insurance_status || 'submitted',
    licenses: profile.licenses || [],
    available: profile.available !== false,
    qualityScore: Number(profile.quality_score || profile.internal_performance_score || 0),
    onTimeRate: Number(profile.on_time_rate || 0),
    completionRate: Number(profile.completion_rate || 0),
    openJobCount: Number(profile.open_job_count || 0),
    complaintCount: Number(profile.complaint_count || 0),
    notes: profile.notes || '',
  };
}

export async function GET(request: Request) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error: queryError } = await supabase
      .from('contractor_profiles')
      .select('*')
      .in('approval_status', ['approved'])
      .order('company_name', { ascending: true });

    if (queryError) throw queryError;
    return NextResponse.json({ contractors: (data || []).map(fromDatabaseProfile) });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Could not load contractors.' }, { status: 500 });
  }
}
