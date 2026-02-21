'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Wrench, ShoppingBag, Bot, Package, User } from 'lucide-react'
import { useCart } from '@/lib/hooks/useCart'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/services', label: 'Services', icon: Wrench },
  { href: '/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/ai', label: 'AI', icon: Bot },
  { href: '/orders', label: 'Orders', icon: Package },
  { href: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-surface-glass-border z-50">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          const isShop = href === '/shop'
          
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
                isActive
                  ? 'text-primary-main'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <Icon size={24} />
                {isShop && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-main text-white text-xs rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
