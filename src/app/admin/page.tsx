"use client";

import {
  CircleDollarSign,
  Package,
  Search,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const stats = [
  {
    title: "Total Revenue",
    value: "$12,450",
    change: "+12.5%",
    icon: CircleDollarSign,
  },
  {
    title: "Total Orders",
    value: "284",
    change: "+8.2%",
    icon: ShoppingCart,
  },
  {
    title: "Total Products",
    value: "156",
    change: "+4.6%",
    icon: Package,
  },
  {
    title: "Total Customers",
    value: "1,240",
    change: "+10.1%",
    icon: Users,
  },
];

type Order = {
  id: number | string;
  customer_name: string | null;
  email: string | null;
  status: string;
  total: number | string;
  created_at: string;
};

const formatAmount = (amount: number | string) =>
  `$${Number(amount).toFixed(2)}`;

const formatStatus = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

const monthlyRevenue = [
  { month: "Apr", height: 42 },
  { month: "May", height: 65 },
  { month: "Jun", height: 50 },
  { month: "Jul", height: 82 },
  { month: "Aug", height: 60 },
  { month: "Sep", height: 92 },
  { month: "Oct", height: 74 },
];

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      try {
        const token = sessionStorage.getItem("be-xpert-access-token");

        if (!token) {
          throw new Error("Please log in again to view orders.");
        }

        const response = await fetch("/api/admin/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load orders.");
        }

        if (!cancelled) {
          setOrders(Array.isArray(result.orders) ? result.orders : []);
        }
      } catch (error) {
        if (!cancelled) {
          setOrdersError(
            error instanceof Error
              ? error.message
              : "Failed to load orders.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingOrders(false);
        }
      }
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.customer_name ?? ""} ${order.email ?? ""} ${order.status}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <main className="w-full space-y-8 p-4 sm:p-8">
      {/* Dashboard welcome */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome to your dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSearch("")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 dark:shadow-none"
        >
          <TrendingUp size={18} />
          Dashboard overview
        </button>
      </section>

      {/* Statistics */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-2xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <Icon size={21} />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs">
                <span className="rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  {stat.change}
                </span>

                <span className="text-slate-500 dark:text-slate-400">
                  vs. last month
                </span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Revenue chart and quick actions */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold">Revenue overview</h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Monthly performance
              </p>
            </div>

            <span className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
              Last 7 months
            </span>
          </div>

          <div className="mt-8 flex h-56 items-end justify-between gap-3 border-b border-slate-100 pb-2 dark:border-slate-700">
            {monthlyRevenue.map((bar) => (
              <div
                key={bar.month}
                className="flex h-full flex-1 flex-col items-center justify-end gap-3"
              >
                <div
                  className="w-full max-w-12 rounded-t-lg bg-indigo-500 transition hover:bg-indigo-700"
                  style={{ height: `${bar.height}%` }}
                  title={`${bar.month} revenue`}
                />

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {bar.month}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            Illustrative chart — connect real sales data to display actual
            revenue.
          </p>
        </article>
      </section>

      {/* Recent orders */}
      <section className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-700 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h3 className="text-lg font-bold">Recent orders</h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Latest activity from your store
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search orders..."
              aria-label="Search recent orders"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/20"
            />
          </div>

          <Link
            href="/admin/orders"
            className="shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View all orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Order Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loadingOrders ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Loading recent orders...
                  </td>
                </tr>
              ) : ordersError ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-red-500"
                  >
                    {ordersError}
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    {orders.length === 0
                      ? "No orders have been placed yet."
                      : "No matching orders found."}
                  </td>
                </tr>
              ) : (
                filteredOrders.slice(0, 5).map((order) => {
                  const status = formatStatus(order.status || "pending");
                  const normalizedStatus = status.toLowerCase();

                  return (
                    <tr
                      key={order.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">
                        #{order.id}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {order.customer_name || "Unknown customer"}
                        </div>

                        {order.email && (
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {order.email}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        {formatAmount(order.total)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${normalizedStatus === "delivered"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                            : normalizedStatus === "processing"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                            }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          {loadingOrders
            ? "Loading orders..."
            : `Showing ${Math.min(filteredOrders.length, 5)} of ${filteredOrders.length} matching orders`}
        </div>
      </section>

      <footer className="pb-2 text-center text-xs text-slate-400 dark:text-slate-500">
        Edl-Store Admin Dashboard
      </footer>
    </main>
  );
}