
"use client"

import { useState } from "react"
import { Check, Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/types/product"

interface AddToCartButtonProps {
  product: Product
  showQuantitySelector?: boolean
}

export function AddToCartButton({
  product,
  showQuantitySelector = false,
}: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAddToCart() {
    addToCart(product, showQuantitySelector ? quantity : 1)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="mt-8 space-y-4">
      {showQuantitySelector && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Quantity
          </label>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() =>
                setQuantity((current) => Math.max(1, current - 1))
              }
            >
              <Minus className="size-4" />
            </Button>

            <span
              className="min-w-8 text-center font-semibold"
              aria-live="polite"
            >
              {quantity}
            </span>

            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Increase quantity"
              disabled={quantity >= 99}
              onClick={() =>
                setQuantity((current) => Math.min(99, current + 1))
              }
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <Button size="lg" onClick={handleAddToCart}>
        {added ? (
          <>
            <Check className="mr-2 size-5" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag className="mr-2 size-5" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  )
}
