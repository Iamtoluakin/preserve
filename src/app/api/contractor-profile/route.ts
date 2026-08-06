import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/serverSupabase';

function toDatabaseProfile(body: Record<string, unknown>, userId: string, email?: string | null) {
  return {
    user_id: userId,
    company_name: body.companyName || body.company_name || '',
    contact_name: body.contactName || body.contact_name || '',
    email: body.email || email || null,
    phone: body.phone || '',
    approval_status: body.approvalStatus || body.approval_status || 'submitted',
    service_categories: body.serviceCategories || body.service_categories || [],
    coverage_zip_codes: body.coverageZipCodes || body.coverage_zip_codes || [],
    coverage_radius_miles: body.coverageRadiusMiles || body.coverage_radius_miles || 25,
    insurance_status: body.insuranceStatus || body.insurance_status || 'submitted',
    licenses: body.licenses || [],
    available: body.available ?? true,
    notes: body.notes || null,
  };
}

function fromDatabaseProfile(profile: Record<string, any>) {
  return {
    id: profile.id || profile.user_id,
    userId: profile.user_id,
    companyName: profile.company_name || '',
    contactName: profile.contact_name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    approvalStatus: profile.approval_status || 'submitted',
    serviceCategories: profile.service_categories || [],
    coverageZipCodes: profile.coverage_zip_codes || [],
    coverageRadiusMiles: Number(profile.coverage_radius_miles || 25),
    insuranceStatus: profile.insurance_status || 'submitted',
    licenses: profile.licenses || [],
    available: profile.available !== false,
    qualityScore: Number(profile.quality_score || 0),
    onTimeRate: Number(profile.on_time_rate || 0),
    completionRate: Number(profile.completion_rate || 0),
    openJobCount: Number(profile.open_job_count || 0),
    complaintCount: Number(profile.complaint_count || 0),
    notes: profile.notes || '',
  };
}

export async function GET(request: Request) {
  const { supabase, user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  const { data, error: queryError } = await supabase
    .from('contractor_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (queryError) return NextResponse.json({ message: queryError.message }, { status: 500 });
  return NextResponse.json({ contractorProfile: data ? fromDatabaseProfile(data) : null });
}

export async function POST(request: Request) {
  const { supabase, user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  const body = await request.json();
  const profile = toDatabaseProfile(body, user.id, user.email);

  if (!profile.company_name || !profile.contact_name || !profile.phone) {
    return NextResponse.json({ message: 'Company, contact name, and phone are required.' }, { status: 400 });
  }

  const { data, error: upsertError } = await supabase
    .from('contractor_profiles')
    .upsert(profile, { onConflict: 'user_id' })
    .select('*')
    .single();

  if (upsertError) return NextResponse.json({ message: upsertError.message }, { status: 500 });

  await supabase
    .from('users')
    .upsert(
      {
        id: user.id,
        email: user.email,
        full_name: profile.contact_name,
        role: 'contractor',
      },
      { onConflict: 'id' }
    );

  return NextResponse.json({ contractorProfile: fromDatabaseProfile(data) }, { status: 201 });
}
