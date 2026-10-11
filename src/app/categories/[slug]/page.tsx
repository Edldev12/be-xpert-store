import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { getCategoryById, getProductsByCategory } from "@/lib/api"
import { createCategorySlug } from "@/lib/slug"
import type { Category, Product } from "@/types/product"
import { ProductCard } from "@/components/product-card"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}
export const instant = false
export default async function CategoryProductsPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params

  // The category ID is included in the dynamically generated slug.
  const match = slug.match(/-(\d+)$/)

  if (!match) {
    notFound()
  }

  const categoryId = Number(match[1])

  if (!Number.isInteger(categoryId) || categoryId < 1) {
    notFound()
  }

  let category: Category

  try {
    category = await getCategoryById(categoryId)
  } catch {
    notFound()
  }

  // Make sure the URL matches the category returned by the API.
  if (
    !category ||
    category.id !== categoryId ||
    createCategorySlug(category.name, category.id) !== slug
  ) {
    notFound()
  }

  let products: Product[] = []
  let productsFailed = false

  try {
    products = await getProductsByCategory(categoryId)
    products = products.filter(
      (product) =>
        product &&
        Number.isInteger(product.id) &&
        typeof product.title === "string" &&
        Number.isFinite(Number(product.price))
    )
  } catch (error) {
    console.error("Failed to load category products:", error)
    productsFailed = true
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/categories"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Categories
      </Link>

      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Browse category</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {category.name}
        </h1>

        <p className="mt-3 text-muted-foreground">
          {productsFailed
            ? "We couldn't load these products. Please try again later."
            : `${products.length} ${products.length === 1 ? "product" : "products"
            } in this category.`}
        </p>
      </div>

      {productsFailed ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="text-muted-foreground">
            Please return to the categories page and try again later.
          </p>
          <Link
            href="/categories"
            className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            View Categories
          </Link>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="text-xl font-semibold">No products found</h2>
          <p className="mt-2 text-muted-foreground">
            This category doesn&apos;t have any products available right now.
          </p>
          <Link
            href="/categories"
            className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Browse Other Categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}