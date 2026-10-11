
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="mb-8 h-5 w-36" />

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <Skeleton className="aspect-square w-full rounded-2xl" />

        <div className="space-y-5 py-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    </section>
  )
}
