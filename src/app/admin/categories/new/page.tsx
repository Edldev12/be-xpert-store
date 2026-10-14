
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "@/lib/api";

export default function NewCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedImage = image.trim();

    if (!trimmedName || !trimmedImage) {
      setError("Please enter both a category name and image URL.");
      return;
    }

    try {
      const imageUrl = new URL(trimmedImage);

      if (!["http:", "https:"].includes(imageUrl.protocol)) {
        throw new Error("Invalid image URL");
      }
    } catch {
      setError("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }

    setSaving(true);

    try {
      await createCategory({
        name: trimmedName,
        image: trimmedImage,
      });

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create category. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Add New Category
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a category for your store.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border p-6">
        <div className="space-y-2">
          <label htmlFor="category-name" className="text-sm font-medium">
            Category Name
          </label>
          <input
            id="category-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Electronics"
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
            placeholder="https://example.com/image.jpg"
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

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Category"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/categories")}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
