'use client'

import React, { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Creator } from '@/types'

export default function Match() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const { data: creators, error } = await supabase
          .from('creators')
          .select('*')
          .neq('auth_id', session.user.id)
          .limit(10)

        if (error) throw error
        setCreators(creators || [])
      } catch (error) {
        console.error('Error fetching creators:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCreators()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">Loading potential matches...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Your Potential Matches</h2>
          <p className="mt-4 text-lg text-gray-600">
            Here are some creators we think you'd work well with!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <div
              key={creator.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  {creator.avatarUrl ? (
                    <img
                      src={creator.avatarUrl}
                      alt={creator.name}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-xl font-medium text-purple-600">
                        {creator.name[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{creator.name}</h3>
                    <p className="text-sm text-gray-500">{creator.skillLevel}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {creator.contentNiches.map((niche) => (
                      <span
                        key={niche}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {niche}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-600 line-clamp-3">{creator.bio}</p>

                <div className="mt-6">
                  <button
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {creators.length === 0 && (
          <div className="text-center mt-12">
            <h3 className="text-lg font-medium text-gray-900">No matches found yet</h3>
            <p className="mt-2 text-gray-600">Check back soon as more creators join the platform!</p>
          </div>
        )}
      </div>
    </div>
  )
} 