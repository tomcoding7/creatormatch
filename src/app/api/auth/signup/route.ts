import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const requestData = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    console.log('Starting signup process...')

    // Validate required fields
    if (!requestData.email || !requestData.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: requestData.email,
      password: requestData.password,
      options: {
        data: {
          name: requestData.name,
        },
      },
    })

    if (authError) {
      console.error('Auth Error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      console.error('No user data returned')
      return NextResponse.json(
        { error: 'No user data returned' },
        { status: 400 }
      )
    }

    console.log('Auth user created:', authData.user.id)

    // Wait a moment for the auth to propagate
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Then, create the creator profile
    const creatorData = {
      auth_id: authData.user.id,
      name: requestData.name,
      age: requestData.age,
      gender: requestData.gender,
      location: requestData.location || null,
      content_niches: requestData.contentNiches || [],
      skill_level: requestData.skillLevel,
      platforms: requestData.platforms || [],
      goals: requestData.goals || [],
      timezone: requestData.timezone,
      languages: requestData.languages || [],
      vibes: requestData.vibes || [],
      bio: requestData.bio || '',
    }

    console.log('Creating creator profile:', creatorData)

    const { error: profileError } = await supabase
      .from('creators')
      .insert([creatorData])

    if (profileError) {
      console.error('Profile Error:', profileError)
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      )
    }

    console.log('Profile created successfully')

    return NextResponse.json({
      message: 'Successfully created profile',
      userId: authData.user.id
    })

  } catch (error) {
    console.error('Signup Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating user' },
      { status: 500 }
    )
  }
} 