'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { 
  ContentNiche, 
  Platform, 
  SkillLevel, 
  Goal, 
  Vibe,
  ResourceType,
  CONTENT_NICHES,
  PLATFORMS,
  SKILL_LEVELS,
  GOALS,
  VIBES,
  TIMEZONES,
  RESOURCES
} from '@/types'

export default function SignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        name: formData.get('name'),
        age: parseInt(formData.get('age') as string),
        gender: formData.get('gender'),
        location: formData.get('location'),
        contentNiches: formData.getAll('contentNiches'),
        skillLevel: formData.get('skillLevel'),
        platforms: formData.getAll('platforms'),
        goals: formData.getAll('goals'),
        timezone: formData.get('timezone'),
        languages: formData.get('languages')?.toString().split(',').map(l => l.trim()),
        vibes: formData.getAll('vibes'),
        bio: formData.get('bio'),
        desiredResources: formData.getAll('desiredResources'),
        youtube: formData.get('youtube'),
        tiktok: formData.get('tiktok'),
        instagram: formData.get('instagram'),
        twitter: formData.get('twitter'),
        discord: formData.get('discord'),
      }

      // Validate required fields
      if (!data.contentNiches.length) {
        throw new Error('Please select at least one content niche')
      }
      if (!data.platforms.length) {
        throw new Error('Please select at least one platform')
      }
      if (!data.goals.length) {
        throw new Error('Please select at least one goal')
      }
      if (!data.vibes.length) {
        throw new Error('Please select at least one vibe')
      }
      if (!data.languages?.length) {
        throw new Error('Please enter at least one language')
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        // Handle rate limiting specifically
        if (response.status === 429) {
          throw new Error('Too many signup attempts. Please wait a minute before trying again.')
        }
        // Handle other errors
        throw new Error(result.error || 'Failed to create account')
      }

      toast.success('Account created successfully!')
      router.push('/onboarding')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating account. Please try again.'
      setError(message)
      toast.error(message)
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Your Creator Profile</h2>
          <p className="mt-2 text-gray-600">Join our community of content creators and find your perfect match!</p>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Authentication Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Account Information</h3>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  min="13"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location (Optional)
              </label>
              <input
                type="text"
                name="location"
                id="location"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Content Creation */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Content Creation</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Content Niches (Select all that apply)</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {CONTENT_NICHES.map((niche) => (
                  <label key={niche} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="contentNiches"
                      value={niche}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{niche}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700">Skill Level</label>
              <select
                id="skillLevel"
                name="skillLevel"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              >
                <option value="">Select skill level</option>
                {SKILL_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Platforms (Select all that apply)</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {PLATFORMS.map((platform) => (
                  <label key={platform} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="platforms"
                      value={platform}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{platform}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Goals and Preferences */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Goals and Preferences</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">Goals (Select all that apply)</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {GOALS.map((goal) => (
                  <label key={goal} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="goals"
                      value={goal}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
              <select
                id="timezone"
                name="timezone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              >
                <option value="">Select timezone</option>
                {TIMEZONES.map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="languages" className="block text-sm font-medium text-gray-700">Languages</label>
              <input
                type="text"
                name="languages"
                id="languages"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="e.g., English, Spanish"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Vibe (Select all that apply)</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {VIBES.map((vibe) => (
                  <label key={vibe} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="vibes"
                      value={vibe}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{vibe}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Tell potential collaborators about yourself..."
                required
              />
            </div>
          </div>

          {/* Social Links Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Social Links</h3>
            <p className="text-sm text-gray-600">Add your social media handles (optional)</p>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                  YouTube
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    youtube.com/
                  </span>
                  <input
                    type="text"
                    name="youtube"
                    id="youtube"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    placeholder="channel"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700">
                  TikTok
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    name="tiktok"
                    id="tiktok"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                  Instagram
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    name="instagram"
                    id="instagram"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                  Twitter/X
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    name="twitter"
                    id="twitter"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="discord" className="block text-sm font-medium text-gray-700">
                  Discord
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="discord"
                    id="discord"
                    className="block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    placeholder="username#0000"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 