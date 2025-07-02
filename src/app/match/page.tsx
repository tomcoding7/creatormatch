import React from 'react'
import { motion } from 'framer-motion'
import { Creator } from '@/types'

export default function MatchInterface() {
  // This would be fetched from your Supabase database
  const mockCreator: Creator = {
    id: '1',
    name: 'Sarah Chen',
    age: 24,
    gender: 'Female',
    location: 'San Francisco, CA',
    contentNiches: ['Tech', 'Education'],
    skillLevel: 'Intermediate',
    platforms: ['YouTube', 'TikTok'],
    goals: ['Collaboration', 'Learning'],
    timezone: 'PST',
    languages: ['English', 'Mandarin'],
    vibes: ['Educational', 'Professional'],
    bio: 'Tech educator passionate about making complex topics simple and fun. Looking to collaborate on tutorial series and educational content.',
    avatarUrl: 'https://example.com/avatar.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const suggestedCollabs = [
    'Create a "Day in the Life of a Tech Creator" series',
    'Collaborative coding tutorial series',
    'Tech tips and tricks compilation',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Creator Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{mockCreator.name}</h2>
                <p className="text-gray-500">
                  {mockCreator.age} • {mockCreator.location} • {mockCreator.timezone}
                </p>
              </div>
              {mockCreator.avatarUrl && (
                <img
                  src={mockCreator.avatarUrl}
                  alt={mockCreator.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900">About</h3>
              <p className="mt-2 text-gray-600">{mockCreator.bio}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Content</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mockCreator.contentNiches.map((niche) => (
                    <span
                      key={niche}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                    >
                      {niche}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">Platforms</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mockCreator.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900">Collab Ideas</h3>
              <div className="mt-2 space-y-3">
                {suggestedCollabs.map((idea, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg text-gray-700"
                  >
                    {idea}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                className="px-6 py-3 bg-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                onClick={() => {/* Handle skip */}}
              >
                Skip
              </button>
              <button
                className="px-6 py-3 bg-purple-600 rounded-full text-white font-medium hover:bg-purple-700 transition-colors"
                onClick={() => {/* Handle match */}}
              >
                Let's Collab!
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 