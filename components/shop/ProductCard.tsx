import { MapPin, Eye, Star } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/format'
import { Badge } from '@/components/ui/Badge'

interface ProductCardProps {
  id: string
  title: string
  price: number
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'refurbished'
  location: string
  images: string[]
  stockQuantity: number
  avgRating?: number
  reviewCount?: number
}

const conditionLabels = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
  refurbished: 'Refurbished',
}

const conditionVariants = {
  new: 'success' as const,
  like_new: 'info' as const,
  good: 'default' as const,
  fair: 'warning' as const,
  refurbished: 'info' as const,
}

export function ProductCard({
  id,
  title,
  price,
  condition,
  location,
  images,
  stockQuantity,
  avgRating,
  reviewCount,
}: ProductCardProps) {
  return (
    <Link href={`/shop/${id}`}>
      <div className="glass-hover h-full overflow-hidden cursor-pointer group">
        <div className="aspect-square bg-background-secondary relative overflow-hidden">
          {images[0] ? (
            <img src={images[0]} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              No Image
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant={conditionVariants[condition]} size="sm">
              {conditionLabels[condition]}
            </Badge>
          </div>
          {stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary-main transition-colors">
            {title}
          </h3>
          
          {avgRating && reviewCount ? (
            <div className="flex items-center gap-1 mb-2">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({reviewCount})</span>
            </div>
          ) : null}
          
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <MapPin size={14} />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-main">
              {formatCurrency(price)}
            </span>
            {stockQuantity > 0 && stockQuantity <= 5 && (
              <span className="text-xs text-yellow-500">Only {stockQuantity} left</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
