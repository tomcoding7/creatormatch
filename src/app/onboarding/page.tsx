'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Question {
  id: number
  text: string
  options: string[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "What's your biggest challenge as a content creator?",
    options: [
      "Finding consistent motivation",
      "Technical skills and editing",
      "Growing my audience",
      "Monetization strategies",
      "Time management"
    ]
  },
  {
    id: 2,
    text: "How do you prefer to collaborate with others?",
    options: [
      "Regular video calls and check-ins",
      "Async communication (messages, email)",
      "In-person meetups when possible",
      "Project management tools",
      "Social media interactions"
    ]
  },
  {
    id: 3,
    text: "What's your ideal collaboration frequency?",
    options: [
      "Daily check-ins",
      "Weekly sessions",
      "Monthly projects",
      "Quarterly collabs",
      "Ad-hoc when inspiration strikes"
    ]
  },
  {
    id: 4,
    text: "What resources would help you most?",
    options: [
      "Mentorship from experienced creators",
      "Access to better equipment/tools",
      "Networking opportunities",
      "Educational content/tutorials",
      "Accountability partnerships"
    ]
  }
]

export default function Onboarding() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError('Authentication error. Please try logging in again.')
          router.push('/auth/login')
          return
        }

        if (!session) {
          console.log('No session found in onboarding, redirecting to login')
          router.push('/auth/login')
          return
        }

        // Verify creator profile exists
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select('onboarding_completed')
          .eq('auth_id', session.user.id)
          .single()

        if (creatorError || !creator) {
          console.error('Creator profile error:', creatorError)
          setError('Profile not found. Please complete signup first.')
          router.push('/auth/signup')
          return
        }

        if (creator.onboarding_completed) {
          console.log('Onboarding already completed, redirecting to match')
          router.push('/match')
          return
        }

      } catch (error) {
        console.error('Session check error:', error)
        setError('Error checking login status')
        router.push('/auth/login')
      }
    }
    checkSession()
  }, [supabase, router])

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answer
    }))

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Automatically submit when the last question is answered
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      console.log('Submitting onboarding answers:', answers)

      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      })

      const data = await response.json()
      console.log('Onboarding response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save preferences')
      }

      // Show success message
      toast.success('Preferences saved successfully!', {
        duration: 2000, // Show for 2 seconds
      })
      
      // Check if the API response includes a redirect URL
      if (data.redirect) {
        // Wait for the toast to be visible before redirecting
        await new Promise(resolve => setTimeout(resolve, 1000))
        router.push(data.redirect)
      } else {
        // Fallback to /match if no redirect URL is provided
        await new Promise(resolve => setTimeout(resolve, 1000))
        router.push('/match')
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      const message = error instanceof Error ? error.message : 'Error saving preferences'
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Saving your preferences...</h2>
            <p className="text-gray-600">Please wait while we update your profile.</p>
          </div>
        </div>
      </div>
    )
  }

  // Main quiz UI
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="mb-8">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                  Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-purple-600">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {currentQuestion < questions.length ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              {questions[currentQuestion].text}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-4 text-left border rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors duration-200"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Thanks for completing the quiz!
            </h2>
            <p className="text-gray-600">
              We'll use your answers to find better matches for you.
            </p>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Find Matches'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 