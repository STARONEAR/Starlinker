import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Clock, MapPin } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Database } from '@/types/database'

type Service = Database['public']['Tables']['services']['Row']

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', params.id)
    .single()

  const service = data as Service | null

  if (error || !service) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="px-3 py-1 bg-primary-main/20 text-primary-main rounded-full text-sm">
              {service.category}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
          <p className="text-gray-300 text-lg mb-6">{service.description}</p>
          
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock size={20} />
              <span>{service.duration_minutes} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={20} />
              <span>On-site service</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-surface-glass-border">
            <div>
              <p className="text-gray-400 text-sm mb-1">Starting from</p>
              <p className="text-3xl font-bold text-primary-main">
                {formatCurrency(Number(service.base_price))}
              </p>
            </div>
            <Link href={`/services/${service.id}/book`}>
              <Button size="lg">Book Now</Button>
            </Link>
          </div>
        </div>

        {/* Details */}
        <div className="glass p-8">
          <h2 className="text-2xl font-semibold mb-4">What's Included</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-primary-main mt-1">✓</span>
              <span>Professional technician with verified credentials</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-main mt-1">✓</span>
              <span>All necessary tools and equipment</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-main mt-1">✓</span>
              <span>Quality guarantee on workmanship</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-main mt-1">✓</span>
              <span>Post-service support and warranty</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
