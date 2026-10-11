import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-5 w-5 text-primary" />
            BE-XPERT Store
          </Link>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"
          >
            <Link href="/products" className="hover:text-foreground">
              Products
            </Link>
            <Link href="/categories" className="hover:text-foreground">
              Categories
            </Link>
            <Link href="/profile" className="hover:text-foreground">
              My Account
            </Link>
          </nav>
        </div>

        <Separator className="my-6" />

        <p className="text-sm text-muted-foreground">
          © 2026 BE-XPERT Store. Built for the Frontend Development Capstone.
        </p>
      </div>
    </footer>
  )
}
