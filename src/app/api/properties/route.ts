import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/serverSupabase';

function toDatabaseProperty(body: Record<string, unknown>, userId: string) {
  return {
    user_id: userId,
    address: body.address,
    city: body.city,
    county: body.county || null,
    state: body.state || 'NC',
    service_area: body.serviceArea || body.service_area || null,
    zip: body.zip,
    parcel_id: body.parcelId || body.parcel_id || null,
    property_type: body.propertyType || body.property_type || 'single_family',
    nickname: body.nickname || null,
    notes: body.notes || null,
    status: body.status || 'Active',
  };
}

export async function GET(request: Request) {
  const { supabase, user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  const { data, error: queryError } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (queryError) return NextResponse.json({ message: queryError.message }, { status: 500 });
  return NextResponse.json({ properties: data });
}

export async function POST(request: Request) {
  const { supabase, user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  const body = await request.json();
  if (!body.address || !body.city || !body.zip) {
    return NextResponse.json({ message: 'address, city, and zip are required.' }, { status: 400 });
  }

  const { data, error: insertError } = await supabase
    .from('properties')
    .insert(toDatabaseProperty(body, user.id))
    .select('*')
    .single();

  if (insertError) return NextResponse.json({ message: insertError.message }, { status: 500 });
  return NextResponse.json({ property: data }, { status: 201 });
}
