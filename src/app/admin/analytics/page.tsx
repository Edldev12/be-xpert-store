"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";

const revenueData = [
  { month: "May", revenue: 12000 },
  { month: "Jun", revenue: 18500 },
  { month: "Jul", revenue: 15000 },
  { month: "Aug", revenue: 24000 },
  { month: "Sep", revenue: 21000 },
  { month: "Oct", revenue: 28500 },
];

const stats = [
  {
    title: "Total Revenue",
    value: "$119,000",
    icon: DollarSign,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  {
    title: "Total Orders",
    value: "384",
    icon: ShoppingCart,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  },
  {
    title: "Total Products",
    value: "126",
    icon: Package,
    color: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  },
  {
    title: "Total Customers",
    value: "892",
    icon: Users,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
];

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            BE-XPERT ADMIN
          </p>
          <h1 className="mt-1 text-3xl font-bold">Analytics</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Monitor your store&apos;s performance.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {stat.title}
                    </p>
                    <p className="mt-3 text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={21} />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Revenue overview</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monthly revenue for the last six months
          </p>

          <div className="mt-6 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(value: number) => `$${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [
                    `$${Number(value).toLocaleString("en-US")}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          These figures are sample data and are not connected to your live store yet.
        </p>
      </div>
    </main>
  );
}