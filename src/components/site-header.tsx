"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Menu,
  ShoppingBag,
  X,
  House,
  Grid2X2,
  LayoutGrid,
  ShoppingCart,
  UserRound,
  LogIn,
  UserPlus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Home", href: "/", icon: House },
  { name: "Products", href: "/products", icon: ShoppingBag },
  { name: "Categories", href: "/categories", icon: Grid2X2 },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    function checkAuth() {
      setIsLoggedIn(
        Boolean(sessionStorage.getItem("be-xpert-access-token"))
      )
    }

    function handleStorageChange(event: StorageEvent) {
      if (
        event.key === "be-xpert-access-token" ||
        event.key === null
      ) {
        checkAuth()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("focus", checkAuth)
    window.addEventListener("auth-change", checkAuth)

    const frame = window.requestAnimationFrame(checkAuth)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", checkAuth)
      window.removeEventListener("auth-change", checkAuth)
    }
  }, [])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="Edl-Store home"
            className="flex items-center gap-2"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShoppingBag className="size-5" />
            </div>

            <span className="text-lg font-bold tracking-tight">
              Edl-Store <span className="text-primary">Store</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-6 md:flex"
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />

            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="inline-flex size-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ShoppingCart className="size-5" />
            </Link>

            {isLoggedIn === true && (
              <Link
                href="/profile"
                className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-accent"
              >
                <UserRound className="mr-2 size-4" />

              </Link>
            )}

            {isLoggedIn === false && (
              <>
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <LogIn className="mr-2 size-4" />
                  Login
                </Link>

                <Link
                  href="/register"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <UserPlus className="mr-2 size-4" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile header actions */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />

            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ShoppingCart className="size-5" />
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="border-t bg-background px-4 py-4 md:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {navigation.map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Icon className="size-5" />
                    {item.name}
                  </Link>
                )
              })}

              <Link
                href="/cart"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <ShoppingCart className="size-5" />
                Shopping Cart
              </Link>

              {isLoggedIn === true && (
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <UserRound className="size-5" />
                  My Account
                </Link>
              )}

              {isLoggedIn === false && (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <LogIn className="size-5" />
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <UserPlus className="size-5" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur md:hidden"
        aria-label="Mobile bottom navigation"
      >
        <div className="grid h-16 grid-cols-5">
          <BottomNavItem
            href="/"
            label="Home"
            icon={House}
          />

          <BottomNavItem
            href="/products"
            label="Products"
            icon={ShoppingBag}
          />

          <BottomNavItem
            href="/categories"
            label="Categories"
            icon={LayoutGrid}
          />

          <BottomNavItem
            href="/cart"
            label="Cart"
            icon={ShoppingCart}
          />

          <BottomNavItem
            href={isLoggedIn === true ? "/profile" : "/login"}
            label={
              isLoggedIn === null
                ? "Account"
                : isLoggedIn
                  ? "Account"
                  : "Login"
            }
            icon={UserRound}
          />
        </div>
      </nav>
    </>
  )
}

interface BottomNavItemProps {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

function BottomNavItem({
  href,
  label,
  icon: Icon,
}: BottomNavItemProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
    >
      <Icon className="size-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}
