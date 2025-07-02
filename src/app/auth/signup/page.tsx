import React from 'react'
import { ContentNiche, Platform, SkillLevel, Goal, Vibe } from '@/types'

export default function SignUp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Your Creator Profile</h2>
          <p className="mt-2 text-gray-600">Join our community of content creators and find your perfect match!</p>
        </div>

        <form className="space-y-6" action="#" method="POST">
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
                {Object.values(ContentNiche).map((niche) => (
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
                {Object.values(SkillLevel).map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Platforms (Select all that apply)</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.values(Platform).map((platform) => (
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
                {Object.values(Goal).map((goal) => (
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
                {/* Add timezone options dynamically */}
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
                {Object.values(Vibe).map((vibe) => (
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

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 