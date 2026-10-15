
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Users,
  UserCheck,
  Mail,
  RefreshCw,
} from "lucide-react";

interface Customer {
  id: number;
  external_user_id: number | null;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: "Active" | "Inactive";
  created_at: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncUserId, setSyncUserId] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Use the same token as the Admin Orders API.
      const token = sessionStorage.getItem("be-xpert-access-token");

      if (!token) {
        setError("Please sign in again to access customer management.");
        return;
      }

      const response = await fetch("/api/admin/customers", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data: {
        customers?: Customer[];
        error?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load customers.");
      }

      setCustomers(data.customers ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load customers."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const syncCustomer = async () => {
    const userId = Number(syncUserId);

    if (!syncUserId.trim() || !Number.isSafeInteger(userId) || userId <= 0) {
      setSyncMessage("Enter a valid EscuelaJS user ID.");
      return;
    }

    setSyncing(true);
    setSyncMessage("");
    setError("");

    try {
      const token = sessionStorage.getItem("be-xpert-access-token");

      if (!token) {
        throw new Error("Please sign in again as an administrator.");
      }

      const response = await fetch("/api/admin/customers/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ external_user_id: userId }),
      });

      const data: { message?: string; error?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Customer synchronization failed.");
      }

      setSyncMessage(data.message || "Customer synchronized successfully.");
      setSyncUserId("");
      await loadCustomers();
    } catch (err) {
      setSyncMessage(
        err instanceof Error ? err.message : "Customer synchronization failed."
      );
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchCustomers() {
      setError("");

      try {
        const token = sessionStorage.getItem("be-xpert-access-token");

        if (!token) {
          if (!cancelled) {
            setError("Please sign in again to access customer management.");
            setLoading(false);
          }
          return;
        }

        const response = await fetch("/api/admin/customers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data: {
          customers?: Customer[];
          error?: string;
        } = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load customers.");
        }

        if (!cancelled) {
          setCustomers(data.customers ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load customers."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchCustomers();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCustomers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        String(customer.external_user_id ?? customer.id).includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
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

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customer Management</h1>
            <p className="mt-2 text-gray-500 dark:text-slate-400">
              View and search registered customers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadCustomers()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Synchronize Existing Customer</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Enter the customer&apos;s existing EscuelaJS user ID to add or repair
            their Supabase customer record.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="number"
              min="1"
              step="1"
              value={syncUserId}
              onChange={(event) => setSyncUserId(event.target.value)}
              placeholder="EscuelaJS user ID"
              aria-label="EscuelaJS user ID"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />

            <button
              type="button"
              onClick={() => void syncCustomer()}
              disabled={syncing}
              className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {syncing ? "Syncing..." : "Sync Customer"}
            </button>
          </div>

          {syncMessage && (
            <p role="status" className="mt-3 text-sm">
              {syncMessage}
            </p>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void loadCustomers()}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400">
              <Users className="h-5 w-5" />
              Total Customers
            </div>
            <p className="mt-3 text-3xl font-bold">
              {loading ? "—" : customers.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400">
              <UserCheck className="h-5 w-5" />
              Active Customers
            </div>
            <p className="mt-3 text-3xl font-bold">
              {loading ? "—" : activeCustomers}
            </p>
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
              {!loading &&
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800/60"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                      {customer.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600 dark:text-slate-300">
                      #{customer.external_user_id ?? customer.id}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400 dark:text-slate-500" />
                        {customer.email}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-slate-300">
                      {customer.phone || "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-600 dark:text-slate-300">
                      {customer.role === "admin" ? "Admin" : "Customer"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${customer.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300"
                          : "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300"
                          }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))}

              {!loading && filteredCustomers.length === 0 && !error && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 dark:text-slate-400"
                  >
                    {customers.length === 0
                      ? "No customer records found. New registrations will appear here."
                      : "No customers match your search."}
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 dark:text-slate-400"
                  >
                    Loading customers...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-gray-500 dark:text-slate-400">
          Customer records are loaded from Supabase. Phone numbers appear when
          available from the customer profile.
        </p>
      </div>
    </main>
  );
}
