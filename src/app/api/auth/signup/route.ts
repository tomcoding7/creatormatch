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
      // Handle rate limiting error specifically
      if (authError.status === 429) {
        return NextResponse.json(
          { 
            error: 'Too many signup attempts. Please wait a minute before trying again.',
            isRateLimit: true
          },
          { status: 429 }
        )
      }
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
      // Let the database handle the default social_links structure
    }

    console.log('Creating creator profile:', creatorData)

    const { error: profileError } = await supabase
      .from('creators')
      .insert([creatorData])

    if (profileError) {
      console.error('Profile Error:', profileError)
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      )
    }

    // After creating the profile, update social links if provided
    if (requestData.youtube || requestData.tiktok || requestData.instagram || requestData.twitter || requestData.discord) {
      const socialLinks = {
        youtube: requestData.youtube ? `https://youtube.com/${requestData.youtube}` : null,
        tiktok: requestData.tiktok ? `https://tiktok.com/@${requestData.tiktok}` : null,
        instagram: requestData.instagram ? `https://instagram.com/${requestData.instagram}` : null,
        twitter: requestData.twitter ? `https://twitter.com/${requestData.twitter}` : null,
        discord: requestData.discord || null
      }

      const { error: updateError } = await supabase
        .from('creators')
        .update({ social_links: socialLinks })
        .eq('auth_id', authData.user.id)

      if (updateError) {
        console.error('Error updating social links:', updateError)
        // Don't fail the signup if social links update fails
      }
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