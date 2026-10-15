"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import { createProduct, getCategories } from "@/lib/api";
import type { Category } from "@/types/product";

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await getCategories();

        if (!cancelled) {
          setCategories(data);

          if (data.length > 0) {
            setCategoryId(String(data[0].id));
          }
        }
      } catch {
        if (!cancelled) {
          setError("Could not load categories. Please refresh the page.");
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please enter a product title and description.");
      return;
    }

    const numericPrice = Number(price);
    const numericCategoryId = Number(categoryId);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Price must be greater than zero.");
      return;
    }

    if (!Number.isInteger(numericCategoryId) || numericCategoryId <= 0) {
      setError("Please select a valid category.");
      return;
    }

    if (imageUrl.trim()) {
      try {
        const url = new URL(imageUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        setError("Please enter a valid image URL.");
        return;
      }
    }

    setSaving(true);

    try {
      await createProduct({
        title: title.trim(),
        price: numericPrice,
        description: description.trim(),
        images: imageUrl.trim() ? [imageUrl.trim()] : [],
        categoryId: numericCategoryId,
      });

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create product.",
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200";

  return (
    <main className="min-h-screen bg-slate-50 p-5 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={18} />
          Back to products
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Product management
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Add new product
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Enter the details below to create a product.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className={labelClass}>
              Product name *
            </label>

            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              maxLength={120}
              placeholder="e.g. Wireless Headphones"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="price" className={labelClass}>
              Price *
            </label>

            <input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
              placeholder="99.99"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Category *
            </label>

            <select
              id="category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              required
              disabled={loadingCategories || categories.length === 0}
              className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {loadingCategories ? (
                <option value="">Loading categories...</option>
              ) : categories.length === 0 ? (
                <option value="">No categories available</option>
              ) : (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Description *
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows={5}
              placeholder="Describe the product..."
              className={`${inputClass} resize-y`}
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className={labelClass}>
              Image URL
            </label>

            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/product.jpg"
              className={inputClass}
            />

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Optional. Enter a publicly accessible image URL.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                saving || loadingCategories || categories.length === 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {saving ? "Creating..." : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}