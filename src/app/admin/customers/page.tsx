"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Users,
  UserCheck,
  Mail,
} from "lucide-react";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Inactive";
}

const DEMO_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "0987654321",
    role: "Customer",
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "0987654321",
    role: "Customer",
    status: "Active",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "0987654321",
    role: "Customer",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "0987654321",
    role: "Customer",
    status: "Active",
  },
  {
    id: 5,
    name: "Daniel Wilson",
    email: "daniel@example.com",
    phone: "0987654321",
    role: "Customer",
    status: "Active",
  },
];

export default function AdminCustomersPage() {
  const [customers] = useState<Customer[]>(DEMO_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredCustomers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        String(customer.id).includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active",
  ).length;

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900 dark:bg-slate-950 dark:text-slate-100 md:p-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="mt-2 text-gray-500 dark:text-slate-400">
            View and search customer information.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400">
              <Users className="h-5 w-5" />
              Total Customers
            </div>
            <p className="mt-3 text-3xl font-bold">{customers.length}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400">
              <UserCheck className="h-5 w-5" />
              Active Customers
            </div>
            <p className="mt-3 text-3xl font-bold">{activeCustomers}</p>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, or customer ID..."
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter customers by status"
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Customer ID</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800/60"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-slate-300">
                    #{customer.id}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400 dark:text-slate-500" />
                      {customer.email}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-slate-300">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-slate-300">
                    {customer.role}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline - flex rounded - full px - 3 py - 1 text - xs font - medium ${customer.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300"
                        } `}
                    >
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 dark:text-slate-400"
                  >
                    No customers match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-gray-500 dark:text-slate-400">
          Demo customer data only. This page is not connected to your
          application&apos;s registered user database.
        </p>
      </div>
    </main>
  );
}