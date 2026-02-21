'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/lib/hooks/useCart'
import { ShoppingCart, Check } from 'lucide-react'

interface AddToCartButtonProps {
  productId: string
  title: string
  price: number
  image?: string
  sellerId: string
  stockQuantity: number
}

export function AddToCartButton({
  productId,
  title,
  price,
  image,
  sellerId,
  stockQuantity,
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({
      productId,
      title,
      price,
      quantity: 1,
      image,
      sellerId,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button
      fullWidth
      size="lg"
      disabled={stockQuantity === 0 || added}
      onClick={handleAdd}
    >
      {added ? (
        <>
          <Check size={20} className="mr-2" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart size={20} className="mr-2" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
