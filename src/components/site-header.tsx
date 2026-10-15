
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import {
  ShoppingBag,
  House,
  LayoutGrid,
  Package,
  ShoppingCart,
  UserRound,
  LogIn,
  ChevronRight,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const pathname = usePathname()
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

  const desktopLinkClass = (href: string) =>
    `group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${pathname === href || pathname.startsWith(`${href}/`)
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-accent hover:text-foreground"
    }`

  const mobileLinkClass = (href: string) =>
    `relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 transition-all duration-200 ${pathname === href || pathname.startsWith(`${href}/`)
      ? "text-primary"
      : "text-muted-foreground hover:text-foreground"
    }`

  return (
    <>
      {/* Main header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 shadow-sm shadow-black/[0.02] backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            href="/"
            aria-label="Edl-Store home"
            className="group flex shrink-0 items-center gap-2.5 rounded-xl outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform duration-200 group-hover:scale-105">
              <ShoppingBag className="size-5" strokeWidth={2.2} />
            </span>

            <span className="text-lg font-extrabold tracking-tight sm:text-xl">
              Edl<span className="text-primary">-</span>Store
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            <Link href="/products" className={desktopLinkClass("/products")}>
              Products
            </Link>

            <Link
              href="/categories"
              className={desktopLinkClass("/categories")}
            >
              <LayoutGrid className="size-4" />
              Categories
            </Link>

            {isLoggedIn === true && (
              <Link
                href="/my-orders"
                className={desktopLinkClass("/my-orders")}
              >
                <Package className="size-4" />
                My Orders
              </Link>
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <Link
              href="/cart"
              aria-label="Shopping cart"
              title="Shopping cart"
              className={`relative inline-flex size-10 items-center justify-center rounded-xl border border-transparent transition-all duration-200 hover:border-border hover:bg-accent ${pathname === "/cart"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <ShoppingCart className="size-[19px]" strokeWidth={2} />
            </Link>

            {isLoggedIn === true && (
              <Link
                href="/profile"
                aria-label="My profile"
                title="My Profile"
                className={`inline-flex size-10 items-center justify-center rounded-xl border transition-all duration-200 hover:bg-accent ${pathname.startsWith("/profile")
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-border/70 text-muted-foreground hover:text-foreground"
                  }`}
              >
                <UserRound className="size-[19px]" />
              </Link>
            )}

            {isLoggedIn === false && (
              <Link
                href="/login"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border/70 px-3.5 text-sm font-semibold transition-all duration-200 hover:border-primary/40 hover:bg-accent"
              >
                <LogIn className="size-4" />
                Login
                <ChevronRight className="size-3.5 opacity-60" />
              </Link>
            )}

            <div className="ml-1 border-l border-border/70 pl-3">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile top actions */}
          <div className="flex shrink-0 items-center gap-1.5 md:hidden">
            {isLoggedIn === true && (
              <Link
                href="/profile"
                aria-label="My profile"
                title="My Profile"
                className={`inline-flex size-10 items-center justify-center rounded-xl transition-colors hover:bg-accent ${pathname.startsWith("/profile")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
                  }`}
              >
                <UserRound className="size-5" />
              </Link>
            )}

            {isLoggedIn === false && (
              <Link
                href="/login"
                aria-label="Login"
                title="Login"
                className="inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <LogIn className="size-5" />
              </Link>
            )}

            <div className="flex size-10 items-center justify-center rounded-xl transition-colors hover:bg-accent">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl md:hidden"
        aria-label="Mobile bottom navigation"
      >
        <div className="mx-auto grid h-[68px] max-w-lg grid-cols-5 items-stretch px-2">
          <Link href="/" aria-label="Home" className={mobileLinkClass("/")}>
            <House
              className={`size-[21px] ${pathname === "/" ? "stroke-[2.5px]" : ""
                }`}
            />
            <span className="max-w-full truncate text-[10px] font-semibold sm:text-[11px]">
              Home
            </span>
            {pathname === "/" && (
              <span className="absolute top-0 h-0.5 w-7 rounded-full bg-primary" />
            )}
          </Link>

          <Link
            href="/products"
            aria-label="Products"
            className={mobileLinkClass("/products")}
          >
            <ShoppingBag
              className={`size-[21px] ${pathname.startsWith("/products") ? "stroke-[2.5px]" : ""
                }`}
            />
            <span className="max-w-full truncate text-[10px] font-semibold sm:text-[11px]">
              Products
            </span>
            {pathname.startsWith("/products") && (
              <span className="absolute top-0 h-0.5 w-7 rounded-full bg-primary" />
            )}
          </Link>

          <Link
            href="/categories"
            aria-label="Categories"
            className={mobileLinkClass("/categories")}
          >
            <LayoutGrid
              className={`size-[21px] ${pathname.startsWith("/categories") ? "stroke-[2.5px]" : ""
                }`}
            />
            <span className="max-w-full truncate text-[10px] font-semibold sm:text-[11px]">
              Categories
            </span>
            {pathname.startsWith("/categories") && (
              <span className="absolute top-0 h-0.5 w-7 rounded-full bg-primary" />
            )}
          </Link>

          <Link
            href="/cart"
            aria-label="Shopping cart"
            className={mobileLinkClass("/cart")}
          >
            <ShoppingCart
              className={`size-[21px] ${pathname === "/cart" ? "stroke-[2.5px]" : ""
                }`}
            />
            <span className="max-w-full truncate text-[10px] font-semibold sm:text-[11px]">
              Cart
            </span>
            {pathname === "/cart" && (
              <span className="absolute top-0 h-0.5 w-7 rounded-full bg-primary" />
            )}
          </Link>

          <Link
            href={isLoggedIn === true ? "/my-orders" : "/login"}
            aria-label="My Orders"
            className={mobileLinkClass("/my-orders")}
          >
            <Package
              className={`size-[21px] ${pathname.startsWith("/my-orders") ? "stroke-[2.5px]" : ""
                }`}
            />
            <span className="max-w-full truncate text-[10px] font-semibold sm:text-[11px]">
              My Orders
            </span>
            {pathname.startsWith("/my-orders") && (
              <span className="absolute top-0 h-0.5 w-7 rounded-full bg-primary" />
            )}
          </Link>
        </div>
      </nav>
    </>
  )
}
