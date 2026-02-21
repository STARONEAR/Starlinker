'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatRelativeTime } from '@/lib/utils/format'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/Loading'
import { useRouter } from 'next/navigation'

interface Chat {
  id: string
  buyer_id: string
  seller_id: string
  product_id: string | null
  last_message: string | null
  last_message_at: string | null
  other_user: {
    full_name: string | null
    avatar_url: string | null
  }
}

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchChats()
  }, [user])

  const fetchChats = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        buyer:users!chats_buyer_id_fkey(full_name, avatar_url),
        seller:users!chats_seller_id_fkey(full_name, avatar_url)
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('last_message_at', { ascending: false, nullsFirst: false })

    if (!error && data) {
      const chatsWithOtherUser = data.map((chat: any) => ({
        ...chat,
        other_user: chat.buyer_id === user.id ? chat.seller : chat.buyer,
      }))
      setChats(chatsWithOtherUser)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<MessageCircle size={48} />}
          title="No conversations yet"
          description="Start chatting with sellers from product pages"
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="space-y-3">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chats/${chat.id}`}>
            <div className="glass-hover p-4 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-main/20 flex items-center justify-center flex-shrink-0">
                  {chat.other_user.avatar_url ? (
                    <img
                      src={chat.other_user.avatar_url}
                      alt={chat.other_user.full_name || 'User'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-main font-semibold">
                      {chat.other_user.full_name?.[0] || 'U'}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1">
                    {chat.other_user.full_name || 'User'}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {chat.last_message || 'No messages yet'}
                  </p>
                </div>

                {chat.last_message_at && (
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(chat.last_message_at)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
