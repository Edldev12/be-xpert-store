"use client";

import {
  BarChart3,
  Bell,
  ChevronDown,
  CircleDollarSign,
  LayoutDashboard,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
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
  { id: "#BX-1024", customer: "Abebe Kebede", product: "Wireless Headphones", amount: "$89.00", status: "Delivered" },
  { id: "#BX-1023", customer: "Sara Ahmed", product: "Smart Watch", amount: "$120.00", status: "Processing" },
  { id: "#BX-1022", customer: "Daniel Bekele", product: "Laptop Stand", amount: "$45.00", status: "Pending" },
  { id: "#BX-1021", customer: "Hana Tesfaye", product: "Mechanical Keyboard", amount: "$75.00", status: "Delivered" },
  { id: "#BX-1020", customer: "Mikael Alemu", product: "USB-C Hub", amount: "$35.00", status: "Processing" },
];

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Products", icon: Package },
  { label: "Orders", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.product}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-white transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div>
            <h1 className="text-xl font-bold tracking-wide">
              BE-XPERT<span className="text-indigo-400">.</span>
            </h1>
            <p className="mt-1 text-xs text-slate-400">Administration</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveNav(item.label);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <Icon size={19} />
                  {item.label}
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Administrator</p>
              <p className="text-xs text-slate-400">Store management</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={22} />
            </button>
            <div>
              <p className="text-sm text-slate-500">Workspace / Admin</p>
              <h2 className="text-lg font-bold">{activeNav}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search recent orders..."
                className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <button
              aria-label="Notifications"
              className="relative rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              A
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] space-y-8 p-4 sm:p-8">
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
              onClick={() => {
                setSearch("");
                setActiveNav("Dashboard");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
            >
              <TrendingUp size={18} />
              Dashboard overview
            </button>
          </section>

          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.title}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
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
                    <span className="text-slate-500">vs. last month</span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Revenue overview</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Monthly performance
                  </p>
                </div>
                <span className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600">
                  Last 7 months
                </span>
              </div>

              <div className="mt-8 flex h-56 items-end justify-between gap-3 border-b border-slate-100 pb-2">
                {[
                  { month: "Apr", height: 42 },
                  { month: "May", height: 65 },
                  { month: "Jun", height: 50 },
                  { month: "Jul", height: 82 },
                  { month: "Aug", height: 60 },
                  { month: "Sep", height: 92 },
                  { month: "Oct", height: 74 },
                ].map((bar) => (
                  <div
                    key={bar.month}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                  >
                    <div
                      className="w-full max-w-12 rounded-t-lg bg-indigo-500 transition hover:bg-indigo-700"
                      style={{ height: `${bar.height}%` }}
                      title={`${bar.month} revenue`}
                    />
                    <span className="text-xs text-slate-500">{bar.month}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Illustrative chart — connect real sales data to display actual revenue.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-lg font-bold">Quick actions</h3>
              <p className="mt-1 text-sm text-slate-500">
                Common store management tasks
              </p>

              <div className="mt-5 space-y-3">
                {[
                  {
                    label: "Manage products",
                    description: "Review your product catalog",
                    icon: Package,
                    target: "Products",
                  },
                  {
                    label: "Review orders",
                    description: "Check recent customer purchases",
                    icon: ShoppingCart,
                    target: "Orders",
                  },
                  {
                    label: "View customers",
                    description: "Review your customer base",
                    icon: Users,
                    target: "Customers",
                  },
                ].map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.target}
                      onClick={() => setActiveNav(action.target)}
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
                    </button>
                  );
                })}
              </div>
            </article>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h3 className="text-lg font-bold">Recent orders</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Latest activity from your store
                </p>
              </div>
              <div className="relative md:hidden">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search orders..."
                  className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400"
                />
              </div>
              <button
                onClick={() => setActiveNav("Orders")}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View all orders →
              </button>
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
                    <tr key={order.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">{order.customer}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {order.product}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.status === "Processing"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-amber-50 text-amber-700"
                            }`}
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
            BE-XPERT Admin Dashboard · Initial prototype
          </footer>
        </main>
      </div>
    </div>
  );
}
