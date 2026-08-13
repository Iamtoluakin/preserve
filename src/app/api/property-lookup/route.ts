import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const street = searchParams.get('street');
  const city = searchParams.get('city');
  const state = searchParams.get('state') || 'NC';
  const zip = searchParams.get('zip') || '';

  if (!street || !city) return NextResponse.json({ error: 'street and city are required' }, { status: 400 });

  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 });

  const address = [street, city, state, zip].filter(Boolean).join(', ');

  try {
    const res = await fetch(
      `https://api.rentcast.io/v1/properties?address=${encodeURIComponent(address)}&limit=1`,
      { headers: { 'X-Api-Key': apiKey, 'Accept': 'application/json' } }
    );
    const json = await res.json();
    if (!res.ok) return NextResponse.json({ error: json.message || 'Lookup failed' }, { status: res.status });
    const properties = Array.isArray(json) ? json : json.properties ?? [];
    if (!properties.length) return NextResponse.json({ error: 'No property found' }, { status: 404 });
    const p = properties[0];
    return NextResponse.json({
      address: p.addressLine1 || street,
      city: p.city || city,
      state: p.state || state,
      zip: p.zipCode || zip,
      county: p.county || '',
      beds: p.bedrooms ?? null,
      baths: p.bathrooms ?? null,
      sqft: p.squareFootage ?? null,
      year_built: p.yearBuilt ?? null,
      property_type: p.propertyType ?? null,
      stories: p.stories ?? null,
      lot_size: p.lotSize ?? null,
      apn: p.apn ?? null,
      owner_name: p.ownerName ?? null,
      estimated_value: p.price ?? null,
    });
  } catch {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
