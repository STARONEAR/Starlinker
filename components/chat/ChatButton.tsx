'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ChatButtonProps {
  productId: string
  sellerId: string
}

export function ChatButton({ productId, sellerId }: ChatButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChat = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      if (user.id === sellerId) {
        alert('You cannot chat with yourself')
        return
      }

      // Check if chat exists
      const { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .eq('product_id', productId)
        .single()

      if (existingChat) {
        router.push(`/chats/${(existingChat as any).id}`)
        return
      }

      // Create new chat
      const { data: newChatData, error } = await supabase
        .from('chats')
        .insert({
          buyer_id: user.id,
          seller_id: sellerId,
          product_id: productId,
        } as any)
        .select()
        .single()

      if (error) throw error
      const newChat = newChatData as any

      router.push(`/chats/${newChat.id}`)
    } catch (error) {
      console.error('Chat error:', error)
      alert('Failed to start chat. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      fullWidth
      variant="ghost"
      size="lg"
      onClick={handleChat}
      disabled={loading}
    >
      <MessageCircle size={20} className="mr-2" />
      {loading ? 'Loading...' : 'Chat with Seller'}
    </Button>
  )
}
