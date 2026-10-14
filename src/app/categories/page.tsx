import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getCategories } from "@/lib/api";
import { createCategorySlug } from "@/lib/slug";
export const instant = false;
async function CategoriesContent() {
  let categories;

  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Failed to load categories:", error);

    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="mt-4 text-muted-foreground">
          We couldn&apos;t load the categories. Please try again later.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Browse All Products
        </Link>
      </section>
    );
  }

  const validCategories = categories.filter(
    (category) =>
      category &&
      Number.isInteger(category.id) &&
      category.id > 0 &&
      typeof category.name === "string" &&
      category.name.trim().length > 0,
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Explore our store</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Shop by Category
        </h1>
        <p className="mt-3 text-muted-foreground">
          Choose a category to discover products you might love.
        </p>
      </div>

      {validCategories.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="text-xl font-semibold">No categories available</h2>
          <p className="mt-2 text-muted-foreground">
            There are no categories to display right now.
          </p>
          <Link
            href="/products"
            className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {validCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${createCategorySlug(category.name, category.id)}`}
              className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                {typeof category.image === "string" &&
                  /^https?:\/\/\S+$/i.test(category.image) ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No image available
                  </div>
                )}
              </div>

              <div className="p-4">
                <h2 className="font-semibold transition-colors group-hover:text-primary">
                  {category.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Explore category
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <section className="mx-auto max-w-7xl px-4 py-16 text-center">
          Loading categories...
        </section>
      }
    >
      <CategoriesContent />
    </Suspense>
  );
}