import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0]

  return (
    <article className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg">
      <Link
        href={`/products/${product.id}`}
        className="block"
        aria-label={`View ${product.title}`}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={product.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        <div className="space-y-2 p-4">
          <p className="text-xs text-muted-foreground">
            {product.category?.name ?? "Uncategorized"}
          </p>

          <h2 className="line-clamp-2 min-h-10 font-semibold">
            {product.title}
          </h2>

          <p className="text-lg font-bold text-primary">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>
      </Link>
    </article>
  )
}
