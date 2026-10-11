
"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import type { ReactNode } from "react"
import type { Product } from "@/types/product"
import type { CartItem } from "@/types/cart"

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  totalPrice: number
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      const safeQuantity = Math.min(99, Math.max(1, Math.floor(quantity)))

      setItems((currentItems) => {
        const existing = currentItems.find(
          (item) => item.product.id === product.id,
        )

        if (existing) {
          return currentItems.map((item) =>
            item.product.id === product.id
              ? {
                ...item,
                quantity: Math.min(99, item.quantity + safeQuantity),
              }
              : item,
          )
        }

        return [...currentItems, { product, quantity: safeQuantity }]
      })
    },
    [],
  )

  const removeFromCart = useCallback((productId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId),
    )
  }, [])

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity < 1) {
        removeFromCart(productId)
        return
      }

      const safeQuantity = Math.min(99, Math.floor(quantity))

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: safeQuantity }
            : item,
        ),
      )
    },
    [removeFromCart],
  )

  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  )

  const value = useMemo(
    () => ({
      items,
      itemCount,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      itemCount,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ],
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider")
  }

  return context
}
