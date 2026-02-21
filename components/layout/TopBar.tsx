'use client'

import { Menu, User, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function TopBar() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 glass border-b border-surface-glass-border z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-main to-secondary-main" />
          <span className="text-xl font-bold">Starlinker</span>
        </div>
        
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-surface-glass-hover rounded-lg transition-colors"
            >
              <User size={24} />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 glass border border-surface-glass-border rounded-xl overflow-hidden">
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-3 text-left hover:bg-surface-glass-hover transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-primary-main hover:bg-primary-dark rounded-lg transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  )
}
