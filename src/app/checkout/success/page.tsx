import Link from "next/link"
import { CheckCircle2, ShoppingBag } from "lucide-react"

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
        <CheckCircle2 className="size-12 text-green-600" aria-hidden="true" />
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Order confirmation
      </h1>

      <p className="mt-3 max-w-lg text-muted-foreground">
        Your simulated checkout has been completed successfully. Thank you for
        shopping with BE-XPERT Store!
      </p>

      <section
        className="mt-8 w-full rounded-xl border p-6 text-left"
        aria-labelledby="order-summary-title"
      >
        <div className="flex items-center gap-3">
          <ShoppingBag className="size-6" aria-hidden="true" />
          <h2 id="order-summary-title" className="text-lg font-semibold">
            Order summary
          </h2>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Your cart has been cleared. This demo does not save an order record,
          so a detailed order receipt is not available.
        </p>

        <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
          <p className="font-medium">Checkout status: Simulated</p>
          <p className="mt-1 text-muted-foreground">
            No payment was processed, no real transaction occurred, and no
            backend order was created.
          </p>
        </div>
      </section>

      <Link
        href="/products"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Continue shopping
      </Link>
    </main>
  )
}