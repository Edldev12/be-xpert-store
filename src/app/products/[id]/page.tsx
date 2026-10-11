
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getProductById, getProducts } from "@/lib/api"
import type { Product } from "@/types/product"
import { ProductCard } from "@/components/product-card"
import { AddToCartButton } from "@/components/add-to-cart-button"

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>
}

function isValidProduct(product: Product): boolean {
  return (
    product !== null &&
    typeof product === "object" &&
    Number.isInteger(product.id) &&
    product.id > 0 &&
    typeof product.title === "string" &&
    product.title.trim().length > 0 &&
    Number.isFinite(Number(product.price)) &&
    Number(product.price) >= 0 &&
    typeof product.description === "string"
  )
}

export async function generateMetadata({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params
  const productId = Number(id)

  if (!Number.isInteger(productId) || productId < 1) {
    return { title: "Product Not Found | BE-XPERT Store" }
  }

  try {
    const product = await getProductById(productId)

    if (!isValidProduct(product)) {
      return { title: "Product Not Found | BE-XPERT Store" }
    }

    return {
      title: `${product.title} | BE-XPERT Store`,
      description: product.description,
    }
  } catch {
    return { title: "Product Not Found | BE-XPERT Store" }
  }
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params
  const productId = Number(id)

  if (!Number.isInteger(productId) || productId < 1) {
    notFound()
  }

  let product: Product

  try {
    product = await getProductById(productId)
  } catch {
    notFound()
  }

  if (!isValidProduct(product)) {
    notFound()
  }

  const image =
    Array.isArray(product.images) &&
      typeof product.images[0] === "string" &&
      /^https?:\/\/\S+$/i.test(product.images[0])
      ? product.images[0]
      : undefined

  let relatedProducts: Product[] = []

  try {
    if (product.category?.id) {
      const categoryProducts = await getProducts({
        limit: 20,
        categoryId: product.category.id,
      })

      relatedProducts = categoryProducts.filter(
        (item) => item.id !== product.id,
      )
    }

    if (relatedProducts.length === 0) {
      const allProducts = await getProducts({ limit: 20 })

      relatedProducts = allProducts.filter(
        (item) => item.id !== product.id,
      )
    }

    relatedProducts = relatedProducts
      .filter(
        (item) =>
          item &&
          Number.isInteger(item.id) &&
          typeof item.title === "string" &&
          Number.isFinite(Number(item.price)),
      )
      .slice(0, 4)
  } catch (error) {
    console.error("Failed to load related products:", error)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
          {image ? (
            <Image
              src={image}
              alt={product.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        <div className="flex flex-col items-start justify-center">
          <p className="text-sm font-medium text-primary">
            {product.category?.name ?? "Uncategorized"}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {product.title}
          </h1>

          <p className="mt-5 text-3xl font-bold text-primary">
            ${Number(product.price).toFixed(2)}
          </p>

          <div className="my-6 w-full border-t" />

          <h2 className="font-semibold">Description</h2>

          <p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground">
            {product.description || "No description is available for this product."}
          </p>

          <AddToCartButton
            product={product}
            showQuantitySelector
          />
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t pt-10">
          <div className="mb-6">
            <p className="text-sm font-medium text-primary">
              You might also like
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Related Products
            </h2>

            <p className="mt-2 text-muted-foreground">
              More products you may like.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
              />
            ))}
          </div>
        </section>
      )}
    </section>
  )
}
