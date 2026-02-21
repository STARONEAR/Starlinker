'use client'

import { useEffect, useRef } from 'react'
import { formatRelativeTime } from '@/lib/utils/format'
import { Database } from '@/types/database'

type Message = Database['public']['Tables']['messages']['Row']

interface ChatWindowProps {
  messages: Message[]
  currentUserId: string
}

export function ChatWindow({ messages, currentUserId }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isOwn = message.sender_id === currentUserId
        
        return (
          <div
            key={message.id}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                isOwn
                  ? 'bg-primary-main text-white'
                  : 'glass text-gray-100'
              }`}
            >
              {message.attachment_url && (
                <img
                  src={message.attachment_url}
                  alt="Attachment"
                  className="rounded-lg mb-2 max-w-full"
                />
              )}
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  isOwn ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {formatRelativeTime(message.created_at)}
              </p>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
