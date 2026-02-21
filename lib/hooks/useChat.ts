'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

type Message = Database['public']['Tables']['messages']['Row']

export function useChat(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!chatId) {
      setLoading(false)
      return
    }

    fetchMessages()
    subscribeToMessages()
  }, [chatId])

  const fetchMessages = async () => {
    if (!chatId) return

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setMessages(data as Message[])
    }
    setLoading(false)
  }

  const subscribeToMessages = () => {
    if (!chatId) return

    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const sendMessage = async (content: string, attachmentUrl?: string) => {
    if (!chatId) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('messages').insert({
      chat_id: chatId,
      sender_id: user.id,
      content,
      attachment_url: attachmentUrl,
      is_read: false,
    } as any)

    if (error) {
      console.error('Send message error:', error)
      throw error
    }
  }

  const markAsRead = async (messageId: string) => {
    await (supabase
      .from('messages')
      .update as any)({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', messageId)
  }

  return { messages, loading, sendMessage, markAsRead }
}
