
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getCategories, updateCategory } from "@/lib/api";
import type { Category } from "@/types/product";

export default function EditCategoryForm({
  categoryId,
}: {
  categoryId: number;
}) {
  const router = useRouter();

  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCategory() {
      try {
        setError("");

        const categories = await getCategories();
        const selectedCategory = categories.find(
          (item) => item.id === categoryId,
        );

        if (!selectedCategory) {
          throw new Error("Category not found.");
        }

        if (active) {
          setCategory(selectedCategory);
          setName(selectedCategory.name);
          setImage(selectedCategory.image);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load category.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (Number.isInteger(categoryId) && categoryId > 0) {
      void loadCategory();
    }
    return () => {
      active = false;
    };
  }, [categoryId]);

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

    try {
      new URL(trimmedImage);

      if (!/^https?:$/.test(new URL(trimmedImage).protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      setError("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }

    setSaving(true);

    try {
      const updated = await updateCategory(categoryId, {
        name: trimmedName,
        image: trimmedImage,
      });

      setCategory(updated);
      setName(updated.name);
      setImage(updated.image);
      setSuccess("Category updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update category.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="p-6">Loading category...</p>;
  }

  if (!category) {
    return (
      <main className="space-y-4 p-6">
        <h1 className="text-2xl font-bold">Edit Category</h1>
        <p role="alert" className="text-sm text-red-600">
          {error || "Category not found."}
        </p>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="rounded-lg border px-4 py-2"
        >
          Back to Categories
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Category
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update the name and image for {category.name}.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border p-6"
      >
        <div className="space-y-2">
          <label htmlFor="category-name" className="text-sm font-medium">
            Category Name
          </label>
          <input
            id="category-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            required
            className="w-full rounded-lg border bg-background px-3 py-2"
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
            required
            className="w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        {image.trim() && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Image Preview</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`${name || "Category"} preview`}
              className="h-32 w-32 rounded-lg border object-cover"
            />
          </div>
        )}

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

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Category"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/categories")}
            className="rounded-lg border px-5 py-2"
          >
            Back to Categories
          </button>
        </div>
      </form>
    </main>
  );
}
