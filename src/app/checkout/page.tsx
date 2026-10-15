"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { useEffect } from "react";
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"

interface CheckoutForm {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
}

const initialForm: CheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`
}

export default function CheckoutPage() {
  const router = useRouter()
  useEffect(() => {
    const token = sessionStorage.getItem("be-xpert-access-token");

    if (!token) {
      router.replace("/login?next=/checkout");
    }
  }, [router]);
  const { items, itemCount, subtotal, totalPrice, clearCart } = useCart()

  const [form, setForm] = useState<CheckoutForm>(initialForm)
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  function validateForm() {
    const nextErrors: Partial<CheckoutForm> = {}

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required."
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address."
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required."
    } else if (!/^[+()\d\s-]{7,20}$/.test(form.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number."
    }

    if (!form.address.trim()) {
      nextErrors.address = "Delivery address is required."
    }

    if (!form.city.trim()) {
      nextErrors.city = "City is required."
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function updateField(field: keyof CheckoutForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || items.length === 0 || !validateForm()) return;

    setSubmitting(true);
    setSubmitError("");
    const token = sessionStorage.getItem("be-xpert-access-token");

    if (!token) {
      router.push("/login?next=/checkout");
      return;
    }
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer: {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
          },
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not save your order.");
      }

      clearCart();
      router.push("/checkout/success");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }


  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <ShoppingBag className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Add products to your cart before proceeding to checkout.
        </p>
        <Button
          type="button"
          className="mt-6"
          onClick={() => router.push("/products")}
        >
          Browse products
        </Button>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to cart
      </Link>

      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          Enter your contact and delivery details to complete the simulated checkout.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid items-start gap-8 lg:grid-cols-[1fr_360px]"
      >
        <section className="space-y-6 rounded-xl border bg-card p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Delivery information</h2>

          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Full name *
            </label>
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              required
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p id="fullName-error" className="text-sm text-destructive">
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone number *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="+251 9XX XXX XXX"
            />
            {errors.phone && (
              <p id="phone-error" className="text-sm text-destructive">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Delivery address *
            </label>
            <textarea
              id="address"
              name="address"
              autoComplete="street-address"
              required
              rows={3}
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "address-error" : undefined}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Street, building, house number..."
            />
            {errors.address && (
              <p id="address-error" className="text-sm text-destructive">
                {errors.address}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">
              City *
            </label>
            <input
              id="city"
              name="city"
              autoComplete="address-level2"
              required
              value={form.city}
              onChange={(event) => updateField("city", event.target.value)}
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? "city-error" : undefined}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Enter your city"
            />
            {errors.city && (
              <p id="city-error" className="text-sm text-destructive">
                {errors.city}
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            * Required fields. This demo does not process real payments.
          </p>
        </section>

        <aside className="rounded-xl border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold">Order summary</h2>

          <div className="mt-5 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex justify-between gap-4 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium">{product.title}</p>
                  <p className="text-muted-foreground">Quantity: {quantity}</p>
                </div>
                <p className="shrink-0 font-medium">
                  {formatPrice(Number(product.price) * quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3 border-t pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Total items</span>
              <span>{itemCount}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between gap-4 border-t pt-4 text-base font-bold">
              <span>Total price</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>


          {submitError && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {submitError}
            </p>
          )}

          <Button
            type="submit"
            className="mt-6 w-full"
            disabled={submitting}
          >
            {submitting ? "Saving order..." : "Place order"}
          </Button>


          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Your order will be saved to our database. No real payment is processed.
          </p>
        </aside>
      </form>
    </main>
  )
}