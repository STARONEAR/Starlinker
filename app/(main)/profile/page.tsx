'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Package, ShoppingBag, MessageCircle, LogOut } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="space-y-4 max-w-2xl">
        <div className="glass p-6">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <p className="text-gray-400 mb-2">Email: {user.email}</p>
        </div>

        <Link href="/profile/sell">
          <div className="glass-hover p-6 cursor-pointer">
            <div className="flex items-center gap-4">
              <Package size={24} className="text-primary-main" />
              <div>
                <h3 className="font-semibold">Sell Products</h3>
                <p className="text-sm text-gray-400">List your products for sale</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/orders">
          <div className="glass-hover p-6 cursor-pointer">
            <div className="flex items-center gap-4">
              <ShoppingBag size={24} className="text-primary-main" />
              <div>
                <h3 className="font-semibold">My Orders</h3>
                <p className="text-sm text-gray-400">View your purchase history</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/chats">
          <div className="glass-hover p-6 cursor-pointer">
            <div className="flex items-center gap-4">
              <MessageCircle size={24} className="text-primary-main" />
              <div>
                <h3 className="font-semibold">Messages</h3>
                <p className="text-sm text-gray-400">Chat with buyers and sellers</p>
              </div>
            </div>
          </div>
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full glass-hover p-6 text-left"
        >
          <div className="flex items-center gap-4">
            <LogOut size={24} className="text-red-500" />
            <div>
              <h3 className="font-semibold text-red-500">Sign Out</h3>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
