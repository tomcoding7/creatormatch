import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { answers } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Update the creator's profile with onboarding answers
    const { error: updateError } = await supabase
      .from('creators')
      .update({
        onboarding_completed: true,
        preferences: answers
      })
      .eq('auth_id', session.user.id)

    if (updateError) throw updateError

    return NextResponse.json({ message: 'Preferences saved successfully' })

  } catch (error) {
    return NextResponse.json(
      { error: 'Error saving preferences' },
      { status: 500 }
    )
  }
} 