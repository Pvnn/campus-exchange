import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { email, password, name, student_id, phone } = body

    // Validate required fields
    if (!email || !password || !name || !student_id) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, name, student_id' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.log('Auth error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Step 2: Create profile record in users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,  // Link to auth user
          email: authData.user.email,
          name,
          student_id,
          phone: phone || null,
        }
      ])

    if (profileError) {
      console.log('Profile error:', profileError)
      return NextResponse.json(
        { error: `Profile creation failed: ${profileError.message}` },
        { status: 500 }
      )
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
        message: 'Registration successful'
      },
      { status: 201 }
    )

  } catch (error) {
    console.log('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
