"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Menu,
  ShoppingBag,
  X,
  House,
  Grid2X2,
  LayoutGrid,
  ShoppingCart,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { label: "Home", href: "/", icon: House },
  { label: "Products", href: "/products", icon: ShoppingBag },
  { label: "Categories", href: "/categories", icon: LayoutGrid },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-bold tracking-tight"
            aria-label="BE-XPERT Store home"
            onClick={() => setMenuOpen(false)}
          >
            <ShoppingBag className="size-6 text-primary" />
            <span className="text-lg">BE-XPERT Store</span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 md:flex"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Cart
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <nav
            aria-label="Additional navigation"
            className="border-t px-4 py-3 md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                My Account
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                Sign in
              </Link>
            </div>
          </nav>
        )}
      </header>

      <nav
        aria-label="Mobile bottom navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <div className="mx-auto grid h-16 max-w-lg grid-cols-5">
          <BottomNavItem href="/" label="Home" icon={House} />
          <BottomNavItem href="/products" label="Products" icon={ShoppingBag} />
          <BottomNavItem href="/categories" label="Categories" icon={Grid2X2} />
          <BottomNavItem href="/cart" label="Cart" icon={ShoppingCart} />
          <BottomNavItem href="/profile" label="Account" icon={UserRound} />
        </div>
      </nav>
    </>
  )
}

function BottomNavItem({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex min-w-0 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <Icon className="size-5" />
      <span className="text-[10px] font-medium sm:text-xs">{label}</span>
    </Link>
  )
}
