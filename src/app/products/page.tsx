import Link from "next/link"

import { getCategories, getProducts } from "@/lib/api"
import { ProductDiscovery } from "@/components/product-discovery"
import type { Category, Product } from "@/types/product"

export const instant = false

export default async function ProductsPage() {
  let products: Product[]
  let categories: Category[]

  try {
    const results = await Promise.all([
      getProducts({ limit: 100 }),
      getCategories(),
    ])

    products = results[0]
    categories = results[1]
  } catch (error) {
    console.error("Failed to load products:", error)

    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Our Products</h1>
        <p className="mt-4 text-muted-foreground">
          We couldn&apos;t load the products right now. Please try again later.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </section>
    )
  }

  const validProducts = Array.isArray(products)
    ? products.filter(
      (product) =>
        product &&
        Number.isInteger(product.id) &&
        product.id > 0 &&
        typeof product.title === "string" &&
        Number.isFinite(Number(product.price)) &&
        Number(product.price) >= 0
    )
    : []

  const validCategories = Array.isArray(categories)
    ? categories.filter(
      (category) =>
        category &&
        Number.isInteger(category.id) &&
        category.id > 0 &&
        typeof category.name === "string" &&
        category.name.trim().length > 0
    )
    : []

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Discover your next favorite</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Our Products
        </h1>
        <p className="mt-3 text-muted-foreground">
          Search, filter, and sort products to find exactly what you need.
        </p>
      </div>

      {validProducts.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="text-xl font-semibold">No products available</h2>
          <p className="mt-2 text-muted-foreground">
            Please check back later to explore our products.
          </p>
        </div>
      ) : (
        <ProductDiscovery
          products={validProducts}
          categories={validCategories}
        />
      )}
    </section>
  )
}
