'use client'

import { useState } from 'react'
import { useCart } from '@/lib/hooks/useCart'
import { formatCurrency } from '@/lib/utils/format'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    city: '',
    phone: '',
    notes: '',
  })
  const router = useRouter()
  const supabase = createClient()

  const deliveryFee = 2000
  const finalTotal = totalPrice + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total_amount: totalPrice / 100,
          delivery_address: formData.deliveryAddress,
          delivery_city: formData.city,
          delivery_state: 'CA',
          delivery_zip: '00000',
          delivery_phone: formData.phone,
        } as any)
        .select()
        .single()

      if (orderError) throw orderError
      const order = orderData as any

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_time: item.price / 100,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems as any)

      if (itemsError) throw itemsError

      // Create delivery record
      const estimatedDelivery = new Date()
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3)

      await supabase
        .from('deliveries')
        .insert({
          order_id: order.id,
          status: 'pending',
          estimated_delivery: estimatedDelivery.toISOString(),
        } as any)

      clearCart()
      router.push(`/orders/${order.id}`)
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to create order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="glass p-6 space-y-4">
                <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
                
                <Input
                  label="Delivery Address"
                  placeholder="Street address"
                  required
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                />
                
                <Input
                  label="City"
                  placeholder="Your city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Your phone number"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                
                <Input
                  label="Additional Notes (Optional)"
                  placeholder="Any special instructions"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button type="submit" fullWidth size="lg" disabled={loading}>
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="glass p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      {item.title} x {item.quantity}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-surface-glass-border pt-4 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-surface-glass-border">
                  <span>Total</span>
                  <span className="text-primary-main">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <div className="text-sm text-gray-400 pt-4">
                <p>Payment will be collected on delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
