import { Skeleton } from "@/components/ui/skeleton"

interface ProductGridSkeletonProps {
  count?: number
}

export function ProductGridSkeleton({
  count = 8,
}: ProductGridSkeletonProps) {
  return (
    <div
      aria-label="Loading products"
      aria-busy="true"
      className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border bg-card"
        >
          <Skeleton className="aspect-square w-full rounded-none" />

          <div className="space-y-3 p-4">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
