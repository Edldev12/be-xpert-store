"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  LoaderCircle,
  Package,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { getCategories, getProducts } from "@/lib/api";
import type { Category, Product } from "@/types/product";
import { deleteProduct } from "@/lib/api";
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productData, categoryData] = await Promise.all([
        getProducts({ limit: 50, offset: 0 }),
        getCategories(),
      ]);

      setProducts(productData);
      setCategories(categoryData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialProducts() {
      setLoading(true);
      setError("");

      try {
        const [productData, categoryData] = await Promise.all([
          getProducts({ limit: 50, offset: 0 }),
          getCategories(),
        ]);

        if (!cancelled) {
          setProducts(productData);
          setCategories(categoryData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load products. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchInitialProducts();

    return () => {
      cancelled = true;
    };
  }, []);
  async function handleDelete(productId: number, productTitle: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productTitle}"?`,
    );

    if (!confirmed) return;

    setDeletingId(productId);
    setDeleteError("");

    try {
      await deleteProduct(productId);

      setProducts((current) =>
        current.filter((product) => product.id !== productId),
      );
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete product.",
      );
    } finally {
      setDeletingId(null);
    }
  }
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.category.name.toLowerCase().includes(query) ||
        String(product.id).includes(query),
    );
  }, [products, search]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              Admin / Products
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Product Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              View and search your store&apos;s product catalog.
            </p>
          </div>

          <button
            type="button"
            disabled
            title="Product creation will be implemented in the next step."
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white opacity-60"
          >
            <Plus size={18} />
            Add product
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3 text-slate-500">
              <Package size={20} />
              <span className="text-sm">Loaded products</span>
            </div>
            <p className="mt-3 text-3xl font-bold">{products.length}</p>
            <p className="mt-1 text-xs text-slate-500">
              Products retrieved from the API
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm text-slate-500">Categories</div>
            <p className="mt-3 text-3xl font-bold">{categories.length}</p>
            <p className="mt-1 text-xs text-slate-500">
              Categories available from the API
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm text-slate-500">Search results</div>
            <p className="mt-3 text-3xl font-bold">
              {filteredProducts.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Matching loaded products
            </p>
          </article>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">All products</h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing up to 50 products from the API.
              </p>
            </div>

            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1 sm:w-72">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="button"
                onClick={() => void loadProducts()}
                disabled={loading}
                aria-label="Refresh products"
                className="rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="m-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle size={20} className="shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">Could not load products</p>
                <p className="mt-1">{error}</p>
                <button
                  type="button"
                  onClick={() => void loadProducts()}
                  className="mt-3 font-semibold underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
          {deleteError && (
            <p role="alert" className="mb-4 text-sm text-red-600">
              {deleteError}
            </p>
          )}
          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500">
              <LoaderCircle size={22} className="animate-spin" />
              Loading products...
            </div>
          ) : !error && filteredProducts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Package size={36} className="mx-auto text-slate-300" />
              <p className="mt-4 font-semibold">No products found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try another product name, category, or ID.
              </p>
            </div>
          ) : !error ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Product</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Price</th>
                    <th className="px-5 py-4 font-semibold">Product ID</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="h-12 w-12 rounded-lg border border-slate-200 bg-white object-contain"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                              <Package size={20} />
                            </div>
                          )}

                          <span className="max-w-xs font-semibold">
                            {product.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                          {product.category.name}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        ${product.price.toFixed(2)}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        #{product.id}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(product.id, product.title)}
                            disabled={deletingId === product.id}
                            className="text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            {deletingId === product.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {!loading && !error && (
            <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
              Showing {filteredProducts.length} of {products.length} loaded
              products
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
