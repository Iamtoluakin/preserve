import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, organizationName, organizationType } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !organizationName || !organizationType) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // 1. Create auth user in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
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

    // 2. Wait a moment for the trigger to create the user profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. Create organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert([
        {
          name: organizationName,
          type: organizationType,
        },
      ])
      .select()
      .single();

    if (orgError) {
      console.error('Organization creation error:', orgError);
      return NextResponse.json(
        { error: 'Failed to create organization' },
        { status: 500 }
      );
    }

    // 4. Update user profile with organization_id and names
    const { error: updateError } = await supabase
      .from('users')
      .update({
        organization_id: orgData.id,
        first_name: firstName,
        last_name: lastName,
      })
      .eq('id', authData.user.id);

    if (updateError) {
      console.error('User update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName,
        lastName,
        organizationId: orgData.id,
        organizationName: orgData.name,
        organizationType: orgData.type,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
