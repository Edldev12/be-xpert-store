
"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface UserProfile {
  id?: number
  name?: string
  email?: string
  avatar?: string
}

export default function ProfilePage() {
  const router = useRouter()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const logout = useCallback(() => {
    sessionStorage.removeItem("be-xpert-access-token")
    sessionStorage.removeItem("be-xpert-refresh-token")
    router.replace("/login")
  }, [router])

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      const token = sessionStorage.getItem("be-xpert-access-token")

      if (!token) {
        router.replace("/login")
        return
      }

      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL ??
        "https://api.escuelajs.co/api/v1"
      ).replace(/\/+$/, "")

      try {
        const response = await fetch(`${apiUrl}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        })

        if (response.status === 401 || response.status === 403) {
          logout()
          return
        }

        if (!response.ok) {
          throw new Error("Could not load your profile. Please try again.")
        }

        const data: unknown = await response.json()

        if (
          !data ||
          typeof data !== "object" ||
          !("email" in data) ||
          typeof data.email !== "string"
        ) {
          throw new Error("The server returned an invalid profile.")
        }

        if (!cancelled) {
          setProfile(data as UserProfile)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to connect to the profile service."
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [logout, router])

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4">
        <p className="text-muted-foreground" role="status">
          Loading your profile...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <section className="rounded-xl border bg-card p-6 text-center">
          <h1 className="text-2xl font-bold">Unable to load profile</h1>
          <p className="mt-3 text-sm text-destructive" role="alert">
            {error}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Try again
            </button>
            <button
              onClick={logout}
              className="rounded-md border px-4 py-2 text-sm font-medium"
            >
              Log out
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <main className="mx-auto min-h-[60vh] max-w-2xl px-4 py-12">
      <section className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View your BE-XPERT Store account information.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 border-b pb-8">
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar}
              alt={profile.name ? `${profile.name}'s avatar` : "Profile avatar"}
              className="size-24 rounded-full border object-cover"
            />
          ) : (
            <div
              className="flex size-24 items-center justify-center rounded-full bg-muted text-3xl font-semibold"
              aria-label="No profile avatar available"
            >
              {(profile.name?.trim().charAt(0) || "?").toUpperCase()}
            </div>
          )}

          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {profile.name || "Name not available"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.email}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm text-muted-foreground">Full name</p>
            <p className="mt-1 font-medium">
              {profile.name || "Not available"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email address</p>
            <p className="mt-1 break-words font-medium">{profile.email}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Browse products
          </Link>

          <button
            type="button"
            onClick={logout}
            className="h-11 flex-1 rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            Log out
          </button>
        </div>
      </section>
    </main>
  )
}
