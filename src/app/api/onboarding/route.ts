import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Define the questions and their meanings for better data structure
const QUESTION_MAPPINGS = {
  1: 'biggest_challenge',
  2: 'collaboration_style',
  3: 'collaboration_frequency',
  4: 'desired_resources'
} as const

// Define types for better type safety
type QuestionId = keyof typeof QUESTION_MAPPINGS
type Answers = Record<QuestionId, string>

export async function POST(request: Request) {
  try {
    const { answers } = (await request.json()) as { answers: Answers }
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

    // Process answers into a flattened structure
    const processedAnswers = Object.entries(answers).reduce<Record<string, string>>((acc, [questionId, answer]) => {
      const key = QUESTION_MAPPINGS[Number(questionId) as QuestionId]
      if (key) {
        acc[key] = answer
      }
      return acc
    }, {})

    // Try updating with a simpler preferences object first
    const { error: updateError } = await supabase
      .from('creators')
      .update({
        onboarding_completed: true,
        preferences: {
          biggest_challenge: processedAnswers.biggest_challenge || null,
          collaboration_style: processedAnswers.collaboration_style || null,
          collaboration_frequency: processedAnswers.collaboration_frequency || null,
          desired_resources: processedAnswers.desired_resources || null
        }
      })
      .eq('id', creator.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      
      // If that fails, try updating without preferences first
      const { error: fallbackError } = await supabase
        .from('creators')
        .update({
          onboarding_completed: true
        })
        .eq('id', creator.id)

      if (fallbackError) {
        console.error('Fallback update error:', fallbackError)
        return NextResponse.json(
          { error: 'Failed to save your preferences. Please try again.' },
          { status: 500 }
        )
      }

      // Then try to update preferences separately
      const { error: preferencesError } = await supabase
        .from('creators')
        .update({
          preferences: {
            biggest_challenge: processedAnswers.biggest_challenge || null,
            collaboration_style: processedAnswers.collaboration_style || null,
            collaboration_frequency: processedAnswers.collaboration_frequency || null,
            desired_resources: processedAnswers.desired_resources || null
          }
        })
        .eq('id', creator.id)

      if (preferencesError) {
        console.error('Preferences update error:', preferencesError)
        // Continue anyway since onboarding is marked as completed
      }
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