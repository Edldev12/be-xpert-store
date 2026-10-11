
import Link from "next/link"
import { ArrowLeft, PackageSearch } from "lucide-react"

export default function ProductNotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <PackageSearch className="size-16 text-muted-foreground" />

      <h1 className="mt-6 text-3xl font-bold">
        Product Not Found
      </h1>

      <p className="mt-3 max-w-md text-muted-foreground">
        Sorry, we couldn&apos;t find this product. It may have been removed,
        or the product link may be incorrect.
      </p>

      <Link
        href="/products"
        className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <ArrowLeft className="size-4" />
        Back to Products
      </Link>
    </section>
  )
}
