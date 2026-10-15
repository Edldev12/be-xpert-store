"use client";

import {
  BarChart3,
  CircleDollarSign,
  Package,
  Search,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

const orders = [
  {
    id: "#BX-1024",
    customer: "Abebe Kebede",
    product: "Wireless Headphones",
    amount: "$89.00",
    status: "Delivered",
  },
  {
    id: "#BX-1023",
    customer: "Sara Ahmed",
    product: "Smart Watch",
    amount: "$120.00",
    status: "Processing",
  },
  {
    id: "#BX-1022",
    customer: "Daniel Bekele",
    product: "Laptop Stand",
    amount: "$45.00",
    status: "Pending",
  },
  {
    id: "#BX-1021",
    customer: "Hana Tesfaye",
    product: "Mechanical Keyboard",
    amount: "$75.00",
    status: "Delivered",
  },
  {
    id: "#BX-1020",
    customer: "Mikael Alemu",
    product: "USB-C Hub",
    amount: "$35.00",
    status: "Processing",
  },
];

const quickActions = [
  {
    label: "Manage products",
    description: "Review your product catalog",
    icon: Package,
    href: "/admin/products",
  },
  {
    label: "Manage categories",
    description: "Organize your product catalog",
    icon: BarChart3,
    href: "/admin/categories",
  },
  {
    label: "Review orders",
    description: "Check customer purchases",
    icon: ShoppingCart,
    href: "/admin/orders",
  },
  {
    label: "View customers",
    description: "Review your customer base",
    icon: Users,
    href: "/admin/customers",
  },
];

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

  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.product} `
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <main className="w-full space-y-8 p-4 sm:p-8">
      {/* Dashboard welcome */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome to your dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSearch("")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
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
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-2xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <Icon size={21} />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs">
                <span className="rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
                  {stat.change}
                </span>

                <span className="text-slate-500">
                  vs. last month
                </span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Revenue chart and quick actions */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold">
                Revenue overview
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Monthly performance
              </p>
            </div>

            <span className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600">
              Last 7 months
            </span>
          </div>

          <div className="mt-8 flex h-56 items-end justify-between gap-3 border-b border-slate-100 pb-2">
            {monthlyRevenue.map((bar) => (
              <div
                key={bar.month}
                className="flex h-full flex-1 flex-col items-center justify-end gap-3"
              >
                <div
                  className="w-full max-w-12 rounded-t-lg bg-indigo-500 transition hover:bg-indigo-700"
                  style={{ height: `${bar.height}% ` }}
                  title={`${bar.month} revenue`}
                />

                <span className="text-xs text-slate-500">
                  {bar.month}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Illustrative chart — connect real sales data to display
            actual revenue.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-bold">Quick actions</h3>

          <p className="mt-1 text-sm text-slate-500">
            Common store management tasks
          </p>

          <div className="mt-5 space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
                >
                  <div className="rounded-lg bg-slate-100 p-2.5 text-slate-700">
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      {action.label}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {action.description}
                    </p>
                  </div>

                  <span className="text-lg text-slate-400">›</span>
                </Link>
              );
            })}
          </div>
        </article>
      </section>

      {/* Recent orders */}
      <section className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h3 className="text-lg font-bold">Recent orders</h3>

            <p className="mt-1 text-sm text-slate-500">
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
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <Link
            href="/admin/orders"
            className="shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View all orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {order.id}
                  </td>

                  <td className="px-6 py-4">
                    {order.customer}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {order.product}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    {order.amount}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline - flex rounded - full px - 3 py - 1 text - xs font - semibold ${order.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-700"
                        : order.status === "Processing"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                        } `}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No matching orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-500">
          Showing {filteredOrders.length} of {orders.length} sample orders
        </div>
      </section>

      <footer className="pb-2 text-center text-xs text-slate-400">
        Edl-Store Admin Dashboard · Initial prototype
      </footer>
    </main>
  );
}