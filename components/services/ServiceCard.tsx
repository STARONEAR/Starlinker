import { Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/format'

interface ServiceCardProps {
  id: string
  name: string
  description: string
  category: string
  basePrice: number
  durationMinutes: number
  imageUrl?: string
}

export function ServiceCard({
  id,
  name,
  description,
  category,
  basePrice,
  durationMinutes,
  imageUrl,
}: ServiceCardProps) {
  return (
    <Link href={`/services/${id}`}>
      <div className="glass-hover h-full p-6 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="px-3 py-1 bg-primary-main/20 text-primary-main rounded-full text-sm">
            {category}
          </div>
          <ArrowRight className="text-gray-400 group-hover:text-primary-main transition-colors" size={20} />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Clock size={16} />
            <span>{durationMinutes} min</span>
          </div>
          <div className="text-xl font-bold text-primary-main">
            {formatCurrency(basePrice)}
          </div>
        </div>
      </div>
    </Link>
  )
}
