'use client'

import React, { useEffect, useState } from 'react'
import { Message, Creator } from '@/types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ChatInterface({ params }: { params: { matchId: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [otherCreator, setOtherCreator] = useState<Creator | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          console.error('Session error:', sessionError)
          router.push('/auth/login')
          return
        }

        // Get current user's creator profile
        const { data: currentCreator, error: creatorError } = await supabase
          .from('creators')
          .select('id')
          .eq('auth_id', session.user.id)
          .single()

        if (creatorError || !currentCreator) {
          console.error('Creator error:', creatorError)
          setError('Error loading your profile')
          return
        }

        // Get the match details
        const { data: match, error: matchError } = await supabase
          .from('matches')
          .select('creator_id_1, creator_id_2')
          .eq('id', params.matchId)
          .single()

        if (matchError) {
          console.error('Match error:', matchError)
          setError('Error loading match details')
          return
        }

        // Get the other creator's details
        const otherCreatorId = match.creator_id_1 === currentCreator.id 
          ? match.creator_id_2 
          : match.creator_id_1

        const { data: otherCreatorData, error: otherCreatorError } = await supabase
          .from('creators')
          .select('*')
          .eq('id', otherCreatorId)
          .single()

        if (otherCreatorError) {
          console.error('Other creator error:', otherCreatorError)
          setError('Error loading match profile')
          return
        }

        setOtherCreator(otherCreatorData)

        // Get messages
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('match_id', params.matchId)
          .order('created_at', { ascending: true })

        if (messagesError) {
          console.error('Messages error:', messagesError)
          setError('Error loading messages')
          return
        }

        setMessages(messages || [])

        // Subscribe to new messages
        const channel = supabase
          .channel('messages')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `match_id=eq.${params.matchId}`
          }, (payload) => {
            setMessages(prev => [...prev, payload.new as Message])
          })
          .subscribe()

        return () => {
          channel.unsubscribe()
        }
      } catch (error) {
        console.error('Error in fetchData:', error)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, params.matchId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in to send messages')
        return
      }

      const { data: creator } = await supabase
        .from('creators')
        .select('id')
        .eq('auth_id', session.user.id)
        .single()

      if (!creator) {
        toast.error('Could not find your profile')
        return
      }

      const { error: sendError } = await supabase
        .from('messages')
        .insert({
          match_id: params.matchId,
          sender_id: creator.id,
          content: newMessage
        })

      if (sendError) {
        console.error('Send error:', sendError)
        toast.error('Failed to send message')
        return
      }

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Loading chat...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/match')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Return to Matches
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Chat with {otherCreator?.name || 'Creator'}
            </h2>
            <p className="text-sm text-gray-500">Start planning your collaboration!</p>
          </div>

          {/* Messages */}
          <div className="h-[600px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === otherCreator?.id ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-sm rounded-lg p-4 ${
                      message.sender_id === otherCreator?.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender_id === otherCreator?.id
                          ? 'text-gray-500'
                          : 'text-purple-200'
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 