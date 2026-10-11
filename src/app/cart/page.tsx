"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`
}

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Continue shopping
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Shopping Cart
        </h1>
        <p className="mt-2 text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {items.length === 0 ? (
        <section className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <ShoppingBag className="size-8 text-muted-foreground" />
          </div>

          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            You haven&apos;t added any products yet. Explore our store to find
            something you love.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse products
          </Link>
        </section>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_350px]">
          <section className="min-w-0 space-y-4">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearCart}
              >
                <Trash2 className="mr-2 size-4" />
                Clear cart
              </Button>
            </div>

            {items.map(({ product, quantity }) => {
              const image = product.images?.[0]
              const lineTotal = Number(product.price) * quantity

              return (
                <article
                  key={product.id}
                  className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-[120px_1fr] sm:items-center"
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="relative block aspect-square overflow-hidden rounded-lg bg-muted"
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={product.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 120px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No image
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-semibold hover:underline"
                        >
                          {product.title}
                        </Link>

                        {product.category?.name && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {product.category.name}
                          </p>
                        )}

                        <p className="mt-2 text-sm text-muted-foreground">
                          Unit price: {formatPrice(Number(product.price))}
                        </p>
                      </div>

                      <p className="font-semibold sm:text-right">
                        {formatPrice(lineTotal)}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div
                        className="inline-flex items-center rounded-md border"
                        aria-label={`Quantity for ${product.title}`}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Decrease quantity of ${product.title}`}
                          disabled={quantity <= 1}
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                        >
                          <Minus className="size-4" />
                        </Button>

                        <span className="min-w-10 text-center text-sm font-medium">
                          {quantity}
                        </span>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Increase quantity of ${product.title}`}
                          disabled={quantity >= 99}
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(product.id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>

          <aside className="rounded-xl border bg-card p-5 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Items</span>
                <span>{itemCount}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between gap-4 text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Proceed to checkout
            </Link>

            <Link
              href="/products"
              className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Continue shopping
            </Link>

            <p className="mt-4 text-xs text-muted-foreground">
              Shipping is currently free. The total equals the subtotal until
              additional checkout fees are implemented.
            </p>
          </aside>
        </div>
      )}
    </main>
  )
}