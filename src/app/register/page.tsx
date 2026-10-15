
"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface RegistrationForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface ApiUser {
  email?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const submitting = useRef(false)

  const [form, setForm] = useState<RegistrationForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  function updateField(field: keyof RegistrationForm, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }))
    setError("")
    setSuccess("")
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Prevent multiple requests, including rapid repeated clicks.
    if (submitting.current) return

    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()

    if (!name || !email || !form.password || !form.confirmPassword) {
      setError("Please complete all fields.")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.")
      return
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    submitting.current = true
    setLoading(true)
    setError("")
    setSuccess("")

    const apiUrl = (
      process.env.NEXT_PUBLIC_API_URL ??
      "https://api.escuelajs.co/api/v1"
    ).replace(/\/+$/, "")

    try {
      // Check whether the email already exists.
      const usersResponse = await fetch(
        `${apiUrl}/users?email=${encodeURIComponent(email)}`,
        { cache: "no-store" }
      )

      if (!usersResponse.ok) {
        throw new Error(
          "Could not check email availability. Please try again."
        )
      }

      const usersData: unknown = await usersResponse.json()

      if (!Array.isArray(usersData)) {
        throw new Error(
          "The server returned an unexpected response. Please try again."
        )
      }

      const existingUsers = usersData as ApiUser[]

      const emailExists = existingUsers.some(
        (user) => user.email?.trim().toLowerCase() === email
      )

      if (emailExists) {
        setError(
          "This email is already registered. Please use another email or sign in."
        )
        return
      }

      // Register only after the email check succeeds.
      const registrationResponse = await fetch(`${apiUrl}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password: form.password,
          avatar: "https://i.imgur.com/4ZQZ4WR.jpeg",
        }),
      })

      const registrationData: unknown = await registrationResponse
        .json()
        .catch(() => null)

      if (!registrationResponse.ok) {
        const message =
          registrationData &&
            typeof registrationData === "object" &&
            "message" in registrationData &&
            typeof registrationData.message === "string"
            ? registrationData.message
            : "Registration failed. Please try again."

        throw new Error(message)
      }

      setSuccess("Registration successful! Redirecting to login...")

      // Keep submission locked until navigation.
      router.push("/login")
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <section className="w-full rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-center text-3xl font-bold tracking-tight">
          Create an account
        </h1>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          Register for your Edl-Store account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Enter your full name"
              required
              maxLength={100}
              disabled={loading}
              className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              required
              disabled={loading}
              className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(event) =>
                updateField("confirmPassword", event.target.value)
              }
              placeholder="Enter your password again"
              required
              disabled={loading}
              className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-md bg-green-100 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}