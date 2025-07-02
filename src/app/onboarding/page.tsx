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
  const supabase = createClientComponentClient()

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.log('No session found in onboarding, redirecting to login')
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
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save preferences')
      }

      toast.success('Preferences saved successfully!')
      
      // Add a small delay to ensure the toast is visible
      setTimeout(() => {
        router.push('/match')
      }, 1000)
    } catch (error) {
      console.error('Onboarding error:', error)
      toast.error(error instanceof Error ? error.message : 'Error saving preferences')
    } finally {
      setIsSubmitting(false)
    }
  }

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