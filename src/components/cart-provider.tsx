"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { ReactNode } from "react"
import type { Product } from "@/types/product"
import type { CartItem } from "@/types/cart"

const CART_STORAGE_KEY = "be-xpert-cart"
const MAX_QUANTITY = 99

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  totalPrice: number
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false

  const item = value as Partial<CartItem>
  const product = item.product

  return (
    !!product &&
    typeof product === "object" &&
    Number.isInteger(product.id) &&
    product.id > 0 &&
    typeof product.title === "string" &&
    Number.isFinite(Number(product.price)) &&
    Number(product.price) >= 0 &&
    Number.isInteger(item.quantity) &&
    Number(item.quantity) >= 1 &&
    Number(item.quantity) <= MAX_QUANTITY
  )
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Restore the cart when the app loads in the browser.
  useEffect(() => {
    let cancelled = false

    const restoreCart = async () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY)

        if (savedCart) {
          const parsed: unknown = JSON.parse(savedCart)

          if (Array.isArray(parsed)) {
            const validItems = parsed.filter(isValidCartItem)

            const mergedItems = validItems.reduce<CartItem[]>(
              (result, item) => {
                const existing = result.find(
                  (entry) => entry.product.id === item.product.id,
                )

                if (existing) {
                  existing.quantity = Math.min(
                    MAX_QUANTITY,
                    existing.quantity + item.quantity,
                  )
                } else {
                  result.push({
                    product: item.product,
                    quantity: item.quantity,
                  })
                }

                return result
              },
              [],
            )

            if (!cancelled) {
              setItems(mergedItems)
            }
          }
        }
      } catch (error) {
        console.error("Unable to restore the shopping cart:", error)
      } finally {
        if (!cancelled) {
          setIsHydrated(true)
        }
      }
    }

    void restoreCart()

    return () => {
      cancelled = true
    }
  }, [])

  // Save changes only after the saved cart has been restored.
  useEffect(() => {
    if (!isHydrated) return

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error("Unable to save the shopping cart:", error)
    }
  }, [items, isHydrated])

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      if (!Number.isFinite(quantity) || quantity < 1) return

      const safeQuantity = Math.min(
        MAX_QUANTITY,
        Math.floor(quantity),
      )

      setItems((currentItems) => {
        const existing = currentItems.find(
          (item) => item.product.id === product.id,
        )

        if (existing) {
          return currentItems.map((item) =>
            item.product.id === product.id
              ? {
                ...item,
                quantity: Math.min(
                  MAX_QUANTITY,
                  item.quantity + safeQuantity,
                ),
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
      if (!Number.isFinite(quantity) || quantity < 1) {
        removeFromCart(productId)
        return
      }

      const safeQuantity = Math.min(MAX_QUANTITY, Math.floor(quantity))

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

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  )

  const totalPrice = subtotal

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      itemCount,
      subtotal,
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