'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useChat } from '@/lib/hooks/useChat'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { MessageInput } from '@/components/chat/MessageInput'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/Loading'
import { createClient } from '@/lib/supabase/client'

export default function ChatPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const { messages, loading, sendMessage } = useChat(params.id)
  const [otherUser, setOtherUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchChatInfo()
  }, [user, params.id])

  const fetchChatInfo = async () => {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        buyer:users!chats_buyer_id_fkey(full_name, avatar_url),
        seller:users!chats_seller_id_fkey(full_name, avatar_url)
      `)
      .eq('id', params.id)
      .single()

    if (!error && data) {
      const chat = data as any
      setOtherUser(
        chat.buyer_id === user?.id ? chat.seller : chat.buyer
      )
    }
  }

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="glass border-b border-surface-glass-border p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Link href="/chats">
            <button className="p-2 hover:bg-surface-glass-hover rounded-lg transition-colors">
              <ArrowLeft size={24} />
            </button>
          </Link>

          {otherUser && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-main/20 flex items-center justify-center">
                {otherUser.avatar_url ? (
                  <img
                    src={otherUser.avatar_url}
                    alt={otherUser.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary-main font-semibold">
                    {otherUser.full_name?.[0] || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h2 className="font-semibold">{otherUser.full_name || 'User'}</h2>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow messages={messages} currentUserId={user.id} />
      </div>

      {/* Input */}
      <MessageInput onSend={sendMessage} />
    </div>
  )
}
