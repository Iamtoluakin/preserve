import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, role, organizationName, organizationType } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create organization first if needed (for new banks/vendors)
    let organizationId = null;
    if (organizationName && organizationType) {
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organizationName,
          type: organizationType,
          contact_email: email,
        })
        .select()
        .single();

      if (orgError) {
        console.error('Error creating organization:', orgError);
        return NextResponse.json(
          { error: 'Failed to create organization' },
          { status: 500 }
        );
      }
      organizationId = orgData.id;
    }

    // Sign up the user with Supabase Auth
    // The database trigger will automatically create the user profile
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Wait a moment for the trigger to create the user profile
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update user profile with organization_id if we created one
    // The trigger creates the basic profile, now we add the organization
    if (organizationId) {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          organization_id: organizationId,
        })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error('Error updating user organization:', updateError);
        // Don't fail the signup for this - user can be assigned later
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role,
        organizationId,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
