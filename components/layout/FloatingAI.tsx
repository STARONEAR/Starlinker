'use client'

import { Bot } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function FloatingAI() {
  const router = useRouter()
  
  return (
    <button
      onClick={() => router.push('/ai')}
      className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-primary-main to-secondary-main neon-glow flex items-center justify-center z-50 hover:scale-110 transition-transform"
      aria-label="Open AI Assistant"
    >
      <Bot size={28} className="text-white" />
    </button>
  )
}
