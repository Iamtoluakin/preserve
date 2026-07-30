import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/serverSupabase';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function toPropertyUpdate(body: Record<string, unknown>) {
  const update: Record<string, unknown> = {};

  if ('address' in body) update.address = body.address;
  if ('city' in body) update.city = body.city;
  if ('county' in body) update.county = body.county || null;
  if ('state' in body) update.state = body.state;
  if ('serviceArea' in body || 'service_area' in body) update.service_area = body.serviceArea || body.service_area || null;
  if ('zip' in body) update.zip = body.zip;
  if ('parcelId' in body || 'parcel_id' in body) update.parcel_id = body.parcelId || body.parcel_id || null;
  if ('propertyType' in body || 'property_type' in body) update.property_type = body.propertyType || body.property_type;
  if ('nickname' in body) update.nickname = body.nickname || null;
  if ('notes' in body) update.notes = body.notes || null;
  if ('status' in body) update.status = body.status;

  return update;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { supabase, user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  const { data, error: queryError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (queryError) return NextResponse.json({ message: queryError.message }, { status: 404 });
  return NextResponse.json({ property: data });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { supabase, user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  const body = await request.json();
  const update = toPropertyUpdate(body);
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ message: 'No supported fields to update.' }, { status: 400 });
  }

  const { data, error: updateError } = await supabase
    .from('properties')
    .update(update)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (updateError) return NextResponse.json({ message: updateError.message }, { status: 500 });
  return NextResponse.json({ property: data });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { supabase, user, error } = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ message: error }, { status: 401 });

  const { error: deleteError } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (deleteError) return NextResponse.json({ message: deleteError.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
