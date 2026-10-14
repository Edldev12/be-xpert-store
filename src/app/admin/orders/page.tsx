
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

interface Order {
  id: number;
  userId: number;
  date: string;
  status: string;
  total: number;
}

const DEMO_ORDERS: Order[] = [
  {
    id: 1001,
    userId: 1,
    date: "2026-10-10",
    status: "Pending",
    total: 129.99,
  },
  {
    id: 1002,
    userId: 2,
    date: "2026-10-11",
    status: "Processing",
    total: 249.5,
  },
  {
    id: 1003,
    userId: 3,
    date: "2026-10-12",
    status: "Delivered",
    total: 89.99,
  },
  {
    id: 1004,
    userId: 4,
    date: "2026-10-13",
    status: "Cancelled",
    total: 59.0,
  },
];

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOrders(DEMO_ORDERS);
      setLoading(false);
    }, 300);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      String(order.id).includes(search) ||
      String(order.userId).includes(search);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter((order) => order.status === "Delivered")
    .reduce((sum, order) => sum + order.total, 0);

  function refreshOrders() {
    setLoading(true);
    setOrders(DEMO_ORDERS);
    setLoading(false);
  }

  function updateOrderStatus(orderId: number, newStatus: string) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900 md:p-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="mt-2 text-gray-500">
              Review and monitor customer orders.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshOrders}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-100"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-white p-5">
            <div className="flex items-center gap-3 text-gray-500">
              <ClipboardList className="h-5 w-5" />
              Total Orders
            </div>
            <p className="mt-3 text-3xl font-bold">{orders.length}</p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Pending Orders</p>
            <p className="mt-3 text-3xl font-bold">
              {orders.filter((order) => order.status === "Pending").length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">Delivered Revenue</p>
            <p className="mt-3 text-3xl font-bold">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by order ID or user ID..."
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl border bg-white">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-gray-500">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              Loading orders...
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">User ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">#{order.id}</td>
                    <td className="px-6 py-4">{order.userId}</td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4">
                      ${order.total.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[order.status] ??
                            "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {order.status}
                        </span>

                        <select
                          aria-label={`Update status for order ${order.id}`}
                          value={order.status}
                          onChange={(event) =>
                            updateOrderStatus(order.id, event.target.value)
                          }
                          className="max-w-40 rounded-md border border-gray-300 bg-white px-2 py-2 text-xs"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No orders match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Demo data only. These orders are not connected to a real order
          database.
        </p>
      </div>
    </main>
  );
}
