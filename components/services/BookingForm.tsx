'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils/format'

interface BookingFormProps {
  serviceId: string
  serviceName: string
  basePrice: number
}

export function BookingForm({ serviceId, serviceName, basePrice }: BookingFormProps) {
  const [loading, setLoading] = useState(false)
  const [isExpress, setIsExpress] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    addressDetails: '',
    notes: '',
  })
  const router = useRouter()
  const supabase = createClient()

  const expressPrice = basePrice * 1.5
  const finalPrice = isExpress ? expressPrice : basePrice

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        service_id: serviceId,
        scheduled_date: formData.date,
        scheduled_time: formData.time,
        location: formData.location,
        address_details: formData.addressDetails,
        estimated_price: finalPrice,
        is_express: isExpress,
        notes: formData.notes,
        status: 'pending',
      })

      if (error) throw error

      router.push('/orders?success=booking')
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass p-6">
        <h3 className="text-xl font-semibold mb-4">Service Details</h3>
        <p className="text-gray-300 mb-4">{serviceName}</p>
        
        <div className="flex items-center gap-4 mb-4">
          <button
            type="button"
            onClick={() => setIsExpress(false)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              !isExpress
                ? 'border-primary-main bg-primary-main/10'
                : 'border-surface-glass-border hover:border-gray-600'
            }`}
          >
            <div className="font-semibold mb-1">Standard</div>
            <div className="text-sm text-gray-400">2-3 days</div>
            <div className="text-lg font-bold text-primary-main mt-2">
              {formatCurrency(basePrice)}
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => setIsExpress(true)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              isExpress
                ? 'border-primary-main bg-primary-main/10'
                : 'border-surface-glass-border hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">Express</span>
              <Badge variant="warning" size="sm">+50%</Badge>
            </div>
            <div className="text-sm text-gray-400">Next day</div>
            <div className="text-lg font-bold text-primary-main mt-2">
              {formatCurrency(expressPrice)}
            </div>
          </button>
        </div>
      </div>

      <div className="glass p-6 space-y-4">
        <h3 className="text-xl font-semibold mb-4">Schedule</h3>
        
        <Input
          label="Preferred Date"
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
        />
        
        <Input
          label="Preferred Time"
          type="time"
          required
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        />
      </div>

      <div className="glass p-6 space-y-4">
        <h3 className="text-xl font-semibold mb-4">Location</h3>
        
        <Input
          label="Service Location"
          placeholder="Enter your city or area"
          required
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
        
        <Input
          label="Full Address"
          placeholder="Street, building, apartment number"
          required
          value={formData.addressDetails}
          onChange={(e) => setFormData({ ...formData, addressDetails: e.target.value })}
        />
        
        <Input
          label="Additional Notes (Optional)"
          placeholder="Any special instructions or requirements"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400">Estimated Price</span>
          <span className="text-2xl font-bold text-primary-main">
            {formatCurrency(finalPrice)}
          </span>
        </div>
        
        <Button type="submit" fullWidth size="lg" disabled={loading}>
          {loading ? 'Creating Booking...' : 'Confirm Booking'}
        </Button>
        
        <p className="text-sm text-gray-400 text-center mt-4">
          Final price may vary based on actual requirements
        </p>
      </div>
    </form>
  )
}
