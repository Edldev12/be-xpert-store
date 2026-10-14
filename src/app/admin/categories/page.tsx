"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/lib/api";
import type { Category } from "@/types/product";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadCategories() {
    try {
      setError("");
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCategories();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function resetForm() {
    setName("");
    setImage("");
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedImage = image.trim();

    if (!trimmedName || !trimmedImage) {
      setError("Please enter both a category name and image URL.");
      return;
    }

    if (
      !trimmedImage.startsWith("https://") &&
      !trimmedImage.startsWith("http://")
    ) {
      setError("Please enter a valid image URL starting with http:// or https://.");
      return;
    }

    setSaving(true);

    try {
      if (editingId !== null) {
        const updated = await updateCategory(editingId, {
          name: trimmedName,
          image: trimmedImage,
        });

        setCategories((current) =>
          current.map((category) =>
            category.id === editingId ? updated : category,
          ),
        );

        setSuccess("Category updated successfully.");
      } else {
        const created = await createCategory({
          name: trimmedName,
          image: trimmedImage,
        });

        setCategories((current) => [...current, created]);
        setSuccess("Category created successfully.");
      }

      resetForm();
    } catch {
      setError(
        "Unable to save the category. Please check the API connection and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(category: Category) {
    setEditingId(category.id);
    setName(category.name);
    setImage(category.image);
    setError("");
    setSuccess("");
  }

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) return;

    setDeletingId(category.id);
    setError("");
    setSuccess("");

    try {
      await deleteCategory(category.id);

      setCategories((current) =>
        current.filter((item) => item.id !== category.id),
      );

      if (editingId === category.id) {
        resetForm();
      }

      setSuccess("Category deleted successfully.");
    } catch (error) {
      console.error("Delete category error:", error);

      const message =
        error instanceof Error ? error.message : "";

      if (
        message.includes("FOREIGN KEY constraint failed") ||
        message.includes("SQLITE_CONSTRAINT_FOREIGNKEY")
      ) {
        setError(
          `Cannot delete "${category.name}" because products or other records may still use it. Keep this category or reassign those records first.`,
        );
      } else {
        setError(message || "Unable to delete the category.");
      }
    }
    finally {
      setDeletingId(null);
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Categories Management
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create, edit, search, and manage your product categories.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Total Categories</p>
          <p className="mt-2 text-3xl font-bold">{categories.length}</p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Search Results</p>
          <p className="mt-2 text-3xl font-bold">
            {filteredCategories.length}
          </p>
        </div>
      </div>

      <section className="rounded-xl border p-5">
        <h2 className="mb-4 text-xl font-semibold">
          {editingId !== null ? "Edit Category" : "Add New Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="category-name" className="text-sm font-medium">
                Category Name
              </label>
              <input
                id="category-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Electronics"
                required
                maxLength={100}
                className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category-image" className="text-sm font-medium">
                Image URL
              </label>
              <input
                id="category-image"
                type="url"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder="https://example.com/image.jpg"
                required
                className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {image.trim() && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Image Preview</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="Category preview"
                className="h-24 w-24 rounded-lg border object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Category"
                  : "Create Category"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border px-5 py-2 font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {error && (
        <p role="alert" className="rounded-lg border border-red-500 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="rounded-lg border p-3 text-sm">
          {success}
        </p>
      )}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">All Categories</h2>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories..."
            aria-label="Search categories"
            className="w-full rounded-lg border bg-background px-3 py-2 sm:max-w-xs"
          />
        </div>

        {loading ? (
          <p className="py-8 text-center text-muted-foreground">
            Loading categories...
          </p>
        ) : filteredCategories.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <p className="font-medium">No categories found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another search or create a new category.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Image</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b last:border-0">
                    <td className="px-4 py-3">{category.id}</td>

                    <td className="px-4 py-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-12 w-12 rounded-lg border object-cover"
                      />
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {category.name}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleEdit(category);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="rounded-md border px-3 py-1.5 hover:bg-muted"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDelete(category)}
                          disabled={deletingId === category.id}
                          className="rounded-md border border-red-500/40 px-3 py-1.5 text-red-600 hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {deletingId === category.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}