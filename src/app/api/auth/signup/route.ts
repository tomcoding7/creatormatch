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

    // Check if a user with this email exists but is not confirmed
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users.find(u => u.email === requestData.email)
    
    if (existingUser) {
      // If user exists but isn't confirmed, delete them and their profile
      if (!existingUser.email_confirmed_at) {
        console.log('Found unconfirmed user, cleaning up...')
        
        // Delete their creator profile if it exists
        await supabase
          .from('creators')
          .delete()
          .eq('auth_id', existingUser.id)
        
        // Delete the unconfirmed auth user
        await supabase.auth.admin.deleteUser(existingUser.id)
      } else {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 }
        )
      }
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
      
      if (profileError.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'This email is already registered. Please check your email for the confirmation link or try logging in.' },
          { status: 400 }
        )
      }
      
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
      message: 'Successfully created profile. Please check your email to confirm your account.',
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