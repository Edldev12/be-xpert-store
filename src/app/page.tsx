import Link from "next/link"

import { getCategories, getProducts } from "@/lib/api"
import { ProductCard } from "@/components/product-card"
import { createCategorySlug } from "@/lib/slug"
import type { Category, Product } from "@/types/product"

export const instant = false

export default async function Home() {
  let products: Product[] = []
  let categories: Category[] = []
  let productsError = false
  let categoriesError = false

  try {
    const result = await getProducts({ limit: 8 })
    products = Array.isArray(result) ? result : []
  } catch (error) {
    console.error("Failed to load homepage products:", error)
    productsError = true
  }

  try {
    const result = await getCategories()
    categories = Array.isArray(result) ? result : []
  } catch (error) {
    console.error("Failed to load homepage categories:", error)
    categoriesError = true
  }

  const validProducts = products.filter(
    (product) =>
      product &&
      Number.isInteger(product.id) &&
      product.id > 0 &&
      typeof product.title === "string" &&
      Number.isFinite(Number(product.price)) &&
      Number(product.price) >= 0
  )

  const validCategories = categories.filter(
    (category) =>
      category &&
      Number.isInteger(category.id) &&
      category.id > 0 &&
      typeof category.name === "string" &&
      category.name.trim().length > 0
  )

  return (
    <main className="mx-auto w-full max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      {/* Store Introduction */}
      <section className="rounded-2xl border bg-card p-6 sm:p-10">
        <p className="text-sm font-semibold text-primary">
          Welcome to BE-XPERT Store
        </p>

        <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Find products you love, all in one place.
        </h1>

        <p className="mt-4 max-w-2xl text-muted-foreground">
          Explore our product collection, compare prices, and discover
          items across different categories. Find what you need and add
          your favorites to your cart.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Browse Products
          </Link>

          <Link
            href="/categories"
            className="inline-flex h-10 items-center justify-center rounded-md border px-5 text-sm font-medium hover:bg-accent"
          >
            Explore Categories
          </Link>
        </div>
      </section>

      {/* Product Categories */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Shop by Category
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore products by category.
            </p>
          </div>

          <Link
            href="/categories"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all categories
          </Link>
        </div>

        {categoriesError ? (
          <div className="rounded-xl border p-6 text-sm text-muted-foreground">
            Categories could not be loaded right now. Please try again later.
          </div>
        ) : validCategories.length === 0 ? (
          <div className="rounded-xl border p-6 text-sm text-muted-foreground">
            No categories are available right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {validCategories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/ categories / ${createCategorySlug(category.name, category.id)} `}
                className="rounded-xl border bg-card p-4 transition-colors hover:bg-accent"
              >
                <h3 className="font-medium">{category.name}</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Browse category
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Featured Products
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Discover items from our product collection.
            </p>
          </div>

          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all products
          </Link>
        </div>

        {productsError ? (
          <div className="rounded-xl border p-6 text-sm text-muted-foreground">
            Products could not be loaded right now. Please try again later.
            <div className="mt-3">
              <Link
                href="/products"
                className="font-medium text-primary hover:underline"
              >
                Open the products page
              </Link>
            </div>
          </div>
        ) : validProducts.length === 0 ? (
          <div className="rounded-xl border p-6 text-sm text-muted-foreground">
            No products are available right now.
            <div className="mt-3">
              <Link
                href="/products"
                className="font-medium text-primary hover:underline"
              >
                Browse products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {validProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Shopping Links */}
      <section className="flex flex-col gap-3 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Ready to find something?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse our complete collection or review your shopping cart.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Shop Now
          </Link>

          <Link
            href="/cart"
            className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
          >
            View Cart
          </Link>

          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
          >
            Sign In
          </Link>
        </div>
      </section>
    </main>
  )
}
