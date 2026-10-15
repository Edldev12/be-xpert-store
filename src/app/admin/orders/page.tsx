
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  LoaderCircle,
  RefreshCw,
  Search,
} from "lucide-react";

type Order = {
  id: number;
  customerName: string;
  email: string;
  date: string;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  total: number;
};

type ApiOrder = {
  id: number;
  customer_name: string;
  email: string;
  status: Order["status"];
  total: number | string;
  created_at: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchOrders() {
      setLoading(true);
      setError("");

      try {
        const token = sessionStorage.getItem("be-xpert-access-token");

        if (!token) {
          throw new Error("Please log in before viewing admin orders.");
        }

        const response = await fetch("/api/admin/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load orders.");
        }

        const apiOrders: ApiOrder[] = result.orders ?? [];

        setOrders(
          apiOrders.map((order) => ({
            id: Number(order.id),
            customerName: order.customer_name,
            email: order.email,
            date: new Date(order.created_at).toLocaleString(),
            status: order.status,
            total: Number(order.total),
          }))
        );
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchOrders();

    return () => controller.abort();
  }, [reloadKey]);

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();

    return (
      String(order.id).includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.email.toLowerCase().includes(query)
    );
  });

  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredRevenue = orders
    .filter((order) => order.status === "Delivered")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900 dark:bg-gray-950 dark:text-white md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage customer orders stored in Supabase.
            </p>
          </div>

          <button
            onClick={() => setReloadKey((key) => key + 1)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Orders" value={orders.length} />
          <StatCard label="Pending Orders" value={pendingCount} />
          <StatCard
            label="Delivered Revenue"
            value={`$${deliveredRevenue.toFixed(2)}`}
          />
        </section>

        <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 p-5 dark:border-gray-800">
            <div className="relative max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search order ID, customer, or email..."
                className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-10 pr-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-gray-500">
              <LoaderCircle size={20} className="animate-spin" />
              Loading orders...
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => setReloadKey((key) => key + 1)}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <ClipboardList size={32} className="mx-auto mb-3" />
              {orders.length === 0
                ? "No orders found in the database."
                : "No orders match your search."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-5 py-4">Order ID</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Total</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-5 py-4 font-medium">
                        #{order.id}
                      </td>
                      <td className="px-5 py-4">{order.customerName}</td>
                      <td className="px-5 py-4">{order.email}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                        {order.date}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-medium">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : order.status === "Processing"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="text-sm text-gray-500">
          Order records are loaded from your Supabase database. Status changes
          are not enabled yet.
        </p>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
