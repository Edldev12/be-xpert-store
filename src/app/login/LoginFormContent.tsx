"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token?: string;
  refresh_token?: string;
  token?: string;
  message?: string | string[];
}

export default function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submitting = useRef(false);

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof LoginForm, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting.current) return;

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    submitting.current = true;
    setLoading(true);
    setError("");

    const apiUrl = (
      process.env.NEXT_PUBLIC_API_URL ??
      "https://api.escuelajs.co/api/v1"
    ).replace(/\/+$/, "");

    try {
      const response = await fetch(`${apiUrl} /auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse | null = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setError(
          response.status === 401
            ? "Invalid email or password. Please try again."
            : "Login failed. Please check your credentials and try again."
        );
        return;
      }

      const accessToken = data?.access_token ?? data?.token;

      if (!accessToken) {
        setError(
          "The API did not return an access token. Please try again."
        );
        return;
      }

      sessionStorage.setItem("be-xpert-access-token", accessToken);

      if (data?.refresh_token) {
        sessionStorage.setItem(
          "be-xpert-refresh-token",
          data.refresh_token
        );
      }

      window.dispatchEvent(new Event("auth-change"));

      // Return to the requested internal page after login.
      const requestedPath = searchParams.get("next");

      const nextPath =
        requestedPath?.startsWith("/") &&
          !requestedPath.startsWith("//") &&
          !requestedPath.includes("\\")
          ? requestedPath
          : "/";

      router.replace(nextPath);
    } catch {
      setError(
        "Unable to connect to the login service. Check your internet connection and try again."
      );
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  const isCheckoutLogin = searchParams.get("next") === "/checkout";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <section className="w-full rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-center text-3xl font-bold tracking-tight">
          Welcome back
        </h1>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to your BE-XPERT Store account.
        </p>

        {isCheckoutLogin && (
          <p
            role="status"
            className="mt-4 rounded-md bg-primary/10 p-3 text-sm"
          >
            Please log in or create an account to continue to checkout.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              onChange={(event) =>
                updateField("email", event.target.value)
              }
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
              autoComplete="current-password"
              value={form.password}
              onChange={(event) =>
                updateField("password", event.target.value)
              }
              placeholder="Enter your password"
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

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={
              isCheckoutLogin
                ? "/register?next=/checkout"
                : "/register"
            }
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
