import React from 'react'
import { Message } from '@/types'

export default function ChatInterface({ params }: { params: { matchId: string } }) {
  // This would be fetched from your Supabase database
  const mockMessages: Message[] = [
    {
      id: '1',
      matchId: params.matchId,
      senderId: 'user1',
      content: 'Hey! I loved your content about tech tutorials. Would you be interested in collaborating on a series about web development?',
      createdAt: '2024-01-01T10:00:00Z',
    },
    {
      id: '2',
      matchId: params.matchId,
      senderId: 'user2',
      content: 'Thanks! That sounds great! I've been wanting to create more web dev content. What specific topics did you have in mind?',
      createdAt: '2024-01-01T10:05:00Z',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-900">Chat with Your Match</h2>
            <p className="text-sm text-gray-500">Start planning your collaboration!</p>
          </div>

          {/* Messages */}
          <div className="h-[600px] overflow-y-auto p-4 space-y-4">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === 'user1' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-sm rounded-lg p-4 ${
                    message.senderId === 'user1'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === 'user1'
                        ? 'text-purple-200'
                        : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <form className="flex space-x-4">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
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