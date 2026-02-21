import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BookingForm } from '@/components/services/BookingForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function BookServicePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: service, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !service) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link 
          href={`/services/${service.id}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Service
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Book Service</h1>
        
        <BookingForm
          serviceId={service.id}
          serviceName={service.name}
          basePrice={Number(service.base_price)}
        />
      </div>
    </div>
  )
}
