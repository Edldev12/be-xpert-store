
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

type OrderStatus = "Pending" | "Processing" | "Delivered" | "Cancelled";

type Order = {
  id: number;
  customerName: string;
  email: string;
  date: string;
  status: OrderStatus;
  total: number;
};

type ApiOrder = {
  id: number;
  customer_name: string;
  email: string;
  status: OrderStatus;
  total: number | string;
  created_at: string;
};

const statuses: OrderStatus[] = [
  "Pending",
  "Processing",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

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
          headers: { Authorization: `Bearer ${token}` },
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
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void fetchOrders();
    return () => controller.abort();
  }, [reloadKey]);

  async function updateOrderStatus(orderId: number, status: OrderStatus) {
    const token = sessionStorage.getItem("be-xpert-access-token");

    if (!token) {
      setError("Please log in again.");
      return;
    }

    setUpdatingId(orderId);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not update order status.");
      }

      setOrders((previous) =>
        previous.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      setNotice(`Order #${orderId} updated to ${status}.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

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

        {notice && (
          <p role="status" className="rounded-lg bg-green-100 p-3 text-sm text-green-800">
            {notice}
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

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
                      <td className="px-5 py-4 font-medium">#{order.id}</td>
                      <td className="px-5 py-4">{order.customerName}</td>
                      <td className="px-5 py-4">{order.email}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                        {order.date}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-medium">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          aria-label={`Status for order ${order.id}`}
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(event) =>
                            void updateOrderStatus(
                              order.id,
                              event.target.value as OrderStatus
                            )
                          }
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        {updatingId === order.id && (
                          <LoaderCircle
                            size={14}
                            className="ml-2 inline animate-spin"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="text-sm text-gray-500">
          Status changes are verified by the admin API and saved to Supabase.
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
