import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServiceSupabaseClient } from '@/lib/serverSupabase';

function getFullName(metadata: Record<string, unknown> | undefined) {
  const value = metadata?.full_name;
  return typeof value === 'string' ? value : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const adminSupabase = createServiceSupabaseClient();
    const fullName = getFullName(authData.user.user_metadata);

    // Make login self-healing if the profile row was not created during signup.
    const { data: userData, error: userError } = await adminSupabase
      .from('users')
      .upsert(
        {
          id: authData.user.id,
          email: authData.user.email,
          full_name: fullName,
        },
        { onConflict: 'id' }
      )
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user profile:', userError);
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name,
      },
      session: authData.session,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
