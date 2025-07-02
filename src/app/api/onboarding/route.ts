import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { answers } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    console.log('Starting onboarding update...')

    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.json(
        { error: 'Authentication error. Please try logging in again.' },
        { status: 401 }
      )
    }
    if (!session) {
      console.log('No session found')
      return NextResponse.json(
        { error: 'Please log in to continue.' },
        { status: 401 }
      )
    }

    console.log('User authenticated:', session.user.id)

    // First verify the creator exists
    const { data: creator, error: creatorError } = await supabase
      .from('creators')
      .select('id, onboarding_completed')
      .eq('auth_id', session.user.id)
      .single()

    if (creatorError) {
      console.error('Error fetching creator:', creatorError)
      return NextResponse.json(
        { error: 'Could not find your profile. Please try signing up again.' },
        { status: 404 }
      )
    }

    if (!creator) {
      console.error('No creator profile found for user:', session.user.id)
      return NextResponse.json(
        { error: 'Profile not found. Please complete signup first.' },
        { status: 404 }
      )
    }

    console.log('Found creator profile:', creator.id)

    // Update the creator's profile with onboarding answers and mark as completed
    const { error: updateError } = await supabase
      .from('creators')
      .update({
        onboarding_completed: true,
        preferences: answers
      })
      .eq('id', creator.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return NextResponse.json(
        { error: 'Failed to save your preferences. Please try again.' },
        { status: 500 }
      )
    }

    console.log('Successfully updated creator profile')

    return NextResponse.json({ 
      message: 'Preferences saved successfully',
      redirect: '/match'
    })

  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
} 