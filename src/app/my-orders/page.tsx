
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, RefreshCw } from "lucide-react";

type OrderItem = {
  order_id: number;
  product_id: string;
  product_title: string;
  unit_price: number;
  quantity: number;
};

type Order = {
  id: number;
  customer_name: string;
  email: string;
  status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadOrders = useCallback(async (refresh = false) => {
    if (refresh) {
      setLoading(true);
    }

    try {
      const token = sessionStorage.getItem("be-xpert-access-token");

      if (!token) {
        router.push("/login?next=/my-orders");
        return;
      }

      const response = await fetch("/api/my-orders", {
        headers: {
          Authorization: `Bearer ${token} `,
        },
        cache: "no-store",
      });

      const data: { orders?: Order[]; error?: string } =
        await response.json();

      if (response.status === 401) {
        sessionStorage.removeItem("be-xpert-access-token");
        router.push("/login?next=/my-orders");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Could not load your orders.");
      }

      setOrders(data.orders ?? []);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load your orders."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadOrders();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadOrders]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900 dark:bg-slate-950 dark:text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 dark:text-slate-300"
        >
          <ArrowLeft size={16} />
          Back to shopping
        </Link>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="mt-2 text-gray-500 dark:text-slate-400">
              View your order history and purchased products.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadOrders()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            Loading your orders...
          </div>
        ) : !error && orders.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <Package className="mx-auto mb-4 text-gray-400" size={44} />
            <h2 className="text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-gray-500 dark:text-slate-400">
              Your orders will appear here after you complete checkout.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4 dark:border-slate-800">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Order #{order.id}
                    </p>
                    <p className="mt-1 font-medium">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {order.status}
                  </span>
                </div>

                <div className="space-y-3 py-5">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.order_id}-${item.product_id}-${index}`}
                      className="flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-medium">{item.product_title}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Quantity: {item.quantity} ×{" "}
                          {formatPrice(item.unit_price)}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.unit_price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-slate-800">
                  <span className="font-medium">Order total</span>
                  <span className="text-xl font-bold">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
