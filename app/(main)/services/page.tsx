import { createClient } from '@/lib/supabase/server'
import { ServiceCard } from '@/components/services/ServiceCard'
import { SERVICE_CATEGORIES } from '@/lib/utils/constants'
import { Database } from '@/types/database'

type Service = Database['public']['Tables']['services']['Row']

export default async function ServicesPage() {
  const supabase = await createClient()
  
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error)
  }

  const servicesByCategory = (services as Service[] | null)?.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, Service[]>)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Professional Services</h1>
        <p className="text-gray-400">Book expert technicians for your home installation needs</p>
      </div>

      {services && services.length > 0 ? (
        <div className="space-y-12">
          {Object.entries(servicesByCategory || {}).map(([category, categoryServices]) => (
            <div key={category}>
              <h2 className="text-2xl font-semibold mb-4">{category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    name={service.name}
                    description={service.description || ''}
                    category={service.category}
                    basePrice={Number(service.base_price)}
                    durationMinutes={service.duration_minutes || 60}
                    imageUrl={service.image_url || undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass p-12 text-center">
          <p className="text-gray-400">No services available at the moment.</p>
        </div>
      )}
    </div>
  )
}
