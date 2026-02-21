'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/shop/ProductCard'
import { Database } from '@/types/database'
import { useEffect } from 'react'
import { LoadingSpinner } from '@/components/ui/Loading'

type Product = Database['public']['Tables']['products']['Row'] & {
  avgRating?: number
  reviewCount?: number
}

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'used'>('new')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [activeTab])

  const fetchProducts = async () => {
    setLoading(true)
    const conditions = activeTab === 'new' ? ['new'] : ['like_new', 'good', 'fair', 'refurbished']
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .in('condition', conditions)
      .order('created_at', { ascending: false })

    if (!error && data) {
      // Fetch ratings for each product
      const productsWithRatings = await Promise.all(
        (data as any[]).map(async (product: any) => {
          const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('product_id', product.id) as { data: any };
          
          const reviewCount = reviews?.length || 0;
          const avgRating = reviewCount > 0
            ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount
            : 0;
          
          return { ...product, avgRating, reviewCount };
        })
      );
      setProducts(productsWithRatings as Product[]);
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
        <p className="text-gray-400">Buy new and used products from verified sellers</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('new')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'new'
              ? 'bg-primary-main text-white'
              : 'glass hover:bg-surface-glass-hover text-gray-300'
          }`}
        >
          New Products
        </button>
        <button
          onClick={() => setActiveTab('used')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'used'
              ? 'bg-primary-main text-white'
              : 'glass hover:bg-surface-glass-hover text-gray-300'
          }`}
        >
          Used Products
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={Number(product.price)}
              condition={product.condition}
              location={product.location}
              images={product.images}
              stockQuantity={product.stock_quantity}
              avgRating={product.avgRating}
              reviewCount={product.reviewCount}
            />
          ))}
        </div>
      ) : (
        <div className="glass p-12 text-center">
          <p className="text-gray-400">
            No {activeTab} products available at the moment.
          </p>
        </div>
      )}
    </div>
  )
}
