import { NextResponse } from 'next/server';

const AUTH_COOKIE = 'preserve-auth';

export async function POST(request: Request) {
  const { accessToken } = await request.json().catch(() => ({ accessToken: null }));

  if (!accessToken || typeof accessToken !== 'string') {
    return NextResponse.json({ message: 'Missing access token.' }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}
