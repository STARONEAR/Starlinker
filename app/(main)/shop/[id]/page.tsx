import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MapPin, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'
import { Badge } from '@/components/ui/Badge'
import { Database } from '@/types/database'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { ChatButton } from '@/components/chat/ChatButton'
import ReviewList from '@/components/reviews/ReviewList'
import RatingDisplay from '@/components/reviews/RatingDisplay'

type Product = Database['public']['Tables']['products']['Row']

const conditionLabels = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
  refurbished: 'Refurbished',
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*, seller:users(full_name, avatar_url)')
    .eq('id', params.id)
    .single()

  const product = data as (Product & { seller: any }) | null

  if (error || !product) {
    notFound()
  }

  // Fetch reviews
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*, users(full_name, avatar_url)')
    .eq('product_id', params.id)
    .order('created_at', { ascending: false }) as { data: any };

  const reviews = reviewsData || [];
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-background-secondary rounded-2xl overflow-hidden">
              {product.images[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  No Image Available
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((img, idx) => (
                  <div key={idx} className="aspect-square bg-background-secondary rounded-lg overflow-hidden">
                    <img src={img} alt={`${product.title} ${idx + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="mb-3">
                <Badge variant={product.condition === 'new' ? 'success' : 'info'}>
                  {conditionLabels[product.condition]}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              {reviews.length > 0 && (
                <div className="mb-2">
                  <RatingDisplay rating={avgRating} count={reviews.length} />
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <MapPin size={18} />
                <span>{product.location}</span>
              </div>
            </div>

            <div className="glass p-6">
              <div className="text-3xl font-bold text-primary-main mb-4">
                {formatCurrency(Number(product.price))}
              </div>
              
              <div className="flex items-center gap-2 text-gray-400 mb-6">
                <Package size={18} />
                <span>
                  {product.stock_quantity > 0 
                    ? `${product.stock_quantity} in stock`
                    : 'Out of stock'
                  }
                </span>
              </div>

              <div className="space-y-3">
                <AddToCartButton
                  productId={product.id}
                  title={product.title}
                  price={Number(product.price)}
                  image={product.images[0]}
                  sellerId={product.seller_id}
                  stockQuantity={product.stock_quantity}
                />
                <ChatButton
                  productId={product.id}
                  sellerId={product.seller_id}
                />
              </div>
            </div>

            {/* Seller Info */}
            <div className="glass p-6">
              <h3 className="font-semibold mb-3">Seller Information</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-main/20 flex items-center justify-center">
                  {product.seller?.avatar_url ? (
                    <img 
                      src={product.seller.avatar_url} 
                      alt={product.seller.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-main font-semibold">
                      {product.seller?.full_name?.[0] || 'S'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{product.seller?.full_name || 'Seller'}</p>
                  <p className="text-sm text-gray-400">Verified Seller</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="glass p-6">
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-gray-300 whitespace-pre-line">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  )
}
