import { ProductGridSkeleton } from "@/components/product-grid-skeleton"

export default function ProductsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <SkeletonHeading />
      </div>

      <ProductGridSkeleton count={8} />
    </section>
  )
}

function SkeletonHeading() {
  return (
    <div className="space-y-3">
      <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-64 max-w-full animate-pulse rounded-md bg-muted" />
    </div>
  )
}
