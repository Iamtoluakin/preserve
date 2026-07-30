import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServiceSupabaseClient } from '@/lib/serverSupabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, fullName, firstName, lastName } = body;
    const displayName =
      name ||
      fullName ||
      [firstName, lastName].filter(Boolean).join(' ').trim() ||
      null;

    // Validate required fields
    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // 1. Create auth user in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: displayName },
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // 2. Create the app profile row with service-role access. This works whether
    // email confirmation is enabled or disabled.
    const adminSupabase = createServiceSupabaseClient();
    const { data: userData, error: profileError } = await adminSupabase
      .from('users')
      .upsert(
        {
          id: authData.user.id,
          email: authData.user.email,
          full_name: displayName,
        },
        { onConflict: 'id' }
      )
      .select('*')
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json(
        { error: 'Account was created, but the profile could not be saved' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name,
      },
      session: authData.session,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
