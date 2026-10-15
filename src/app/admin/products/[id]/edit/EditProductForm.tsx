"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import {
  getCategories,
  getProductById,
  updateProduct,
} from "@/lib/api";
import type { Category } from "@/types/product";

interface EditProductFormProps {
  productId: number;
}

export default function EditProductForm({
  productId,
}: EditProductFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (!Number.isInteger(productId) || productId < 1) {
        if (!cancelled) {
          setError("Invalid product ID.");
          setLoading(false);
        }
        return;
      }

      try {
        const [product, categoryList] = await Promise.all([
          getProductById(productId),
          getCategories(),
        ]);

        if (cancelled) return;

        setCategories(categoryList);
        setTitle(product.title);
        setPrice(String(product.price));
        setDescription(product.description);
        setCategoryId(String(product.category.id));
        setImageUrl(product.images?.[0] ?? "");
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load product.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const parsedPrice = Number(price);
    const parsedCategoryId = Number(categoryId);

    if (!title.trim()) {
      setError("Product title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Enter a valid price greater than zero.");
      return;
    }

    if (!Number.isInteger(parsedCategoryId) || parsedCategoryId < 1) {
      setError("Please select a category.");
      return;
    }

    if (!imageUrl.trim()) {
      setError("Product image URL is required.");
      return;
    }

    try {
      const url = new URL(imageUrl.trim());

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Invalid URL protocol");
      }
    } catch {
      setError("Enter a valid HTTP or HTTPS image URL.");
      return;
    }

    setSaving(true);

    try {
      await updateProduct(productId, {
        title: title.trim(),
        price: parsedPrice,
        description: description.trim(),
        images: [imageUrl.trim()],
        categoryId: parsedCategoryId,
      });

      setSuccess("Product updated successfully.");

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update product.",
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200";

  if (loading) {
    return (
      <main className="flex min-h-64 items-center justify-center bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
        <span>Loading product...</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Update the product information below.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300"
          >
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <div>
            <label htmlFor="title" className={labelClass}>
              Product Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={120}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter product title"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="price" className={labelClass}>
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Enter product price"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={inputClass}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your product"
              className={`${inputClass} resize - y`}
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className={labelClass}>
              Product Image URL
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              required
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/product.jpg"
              className={inputClass}
            />

            {imageUrl && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                  Image preview
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Product preview"
                  className="h-40 w-40 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
