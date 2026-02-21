'use client'

import { useCart } from '@/lib/hooks/useCart'
import { formatCurrency } from '@/lib/utils/format'
import { Button } from '@/components/ui/Button'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@/components/ui/EmptyState'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<ShoppingBag size={48} />}
          title="Your cart is empty"
          description="Add some products to get started"
          action={{
            label: 'Browse Products',
            onClick: () => router.push('/shop'),
          }}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.productId} className="glass p-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-background-secondary rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <Link href={`/shop/${item.productId}`}>
                    <h3 className="font-semibold hover:text-primary-main transition-colors mb-2">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-xl font-bold text-primary-main mb-3">
                    {formatCurrency(item.price)}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 glass px-3 py-1 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">Subtotal</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xl font-semibold">Total</span>
            <span className="text-3xl font-bold text-primary-main">
              {formatCurrency(totalPrice)}
            </span>
          </div>

          <div className="space-y-3">
            <Link href="/cart/checkout">
              <Button fullWidth size="lg">
                Proceed to Checkout
              </Button>
            </Link>
            <Button
              fullWidth
              variant="ghost"
              onClick={() => router.push('/shop')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
