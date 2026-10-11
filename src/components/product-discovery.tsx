"use client"

import { useMemo, useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import type { Category, Product } from "@/types/product"

interface ProductDiscoveryProps {
  products: Product[]
  categories: Category[]
}

type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "date-newest"
  | "date-oldest"

export function ProductDiscovery({
  products,
  categories,
}: ProductDiscoveryProps) {
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("all")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sort, setSort] = useState<SortOption>("default")

  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (product) =>
        product &&
        Number.isInteger(product.id) &&
        typeof product.title === "string" &&
        Number.isFinite(Number(product.price))
    )

    const searchTerm = search.trim().toLowerCase()

    if (searchTerm) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(searchTerm)
      )
    }

    if (categoryId !== "all") {
      result = result.filter(
        (product) => String(product.category?.id) === categoryId
      )
    }

    const minimum = minPrice.trim() === "" ? null : Number(minPrice)
    const maximum = maxPrice.trim() === "" ? null : Number(maxPrice)

    if (minimum !== null && Number.isFinite(minimum) && minimum >= 0) {
      result = result.filter((product) => Number(product.price) >= minimum)
    }

    if (maximum !== null && Number.isFinite(maximum) && maximum >= 0) {
      result = result.filter((product) => Number(product.price) <= maximum)
    }

    result = [...result]

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "date-newest":
      case "date-oldest":
        result.sort((a, b) => {
          const dateA = Date.parse(a.creationAt ?? "")
          const dateB = Date.parse(b.creationAt ?? "")
          const validA = Number.isFinite(dateA)
          const validB = Number.isFinite(dateB)

          if (!validA && !validB) return 0
          if (!validA) return 1
          if (!validB) return -1

          return sort === "date-newest"
            ? dateB - dateA
            : dateA - dateB
        })
        break
    }

    return result
  }, [products, search, categoryId, minPrice, maxPrice, sort])

  function clearFilters() {
    setSearch("")
    setCategoryId("all")
    setMinPrice("")
    setMaxPrice("")
    setSort("default")
  }

  const invalidPriceRange =
    minPrice.trim() !== "" &&
    maxPrice.trim() !== "" &&
    Number.isFinite(Number(minPrice)) &&
    Number.isFinite(Number(maxPrice)) &&
    Number(minPrice) > Number(maxPrice)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search and Clear Filters */}
        <div className="sm:col-span-2 lg:col-span-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label
                htmlFor="product-search"
                className="mb-2 block text-sm font-medium"
              >
                Search products
              </label>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="product-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by product name..."
                  className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto sm:shrink-0"
              onClick={clearFilters}
            >
              <X className="mr-2 size-4" />
              Clear filters
            </Button>
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category-filter"
            className="mb-2 block text-sm font-medium"
          >
            Category
          </label>

          <select
            id="category-filter"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum Price */}
        <div>
          <label
            htmlFor="min-price"
            className="mb-2 block text-sm font-medium"
          >
            Minimum price ($)
          </label>

          <input
            id="min-price"
            type="number"
            min="0"
            step="0.01"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="No minimum"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        {/* Maximum Price */}
        <div>
          <label
            htmlFor="max-price"
            className="mb-2 block text-sm font-medium"
          >
            Maximum price ($)
          </label>

          <input
            id="max-price"
            type="number"
            min="0"
            step="0.01"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="No maximum"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        {/* Sorting */}
        <div>
          <label
            htmlFor="product-sort"
            className="mb-2 block text-sm font-medium"
          >
            Sort products
          </label>

          <select
            id="product-sort"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as SortOption)
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="default">Default order</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="date-newest">Newest first</option>
            <option value="date-oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p
          className="text-sm text-muted-foreground"
          aria-live="polite"
        >
          <SlidersHorizontal className="mr-2 inline size-4" />
          Showing{" "}
          {invalidPriceRange ? 0 : filteredProducts.length} of{" "}
          {products.length} products
        </p>
      </div>

      {/* Product Results */}
      {invalidPriceRange ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="text-xl font-semibold">
            Invalid price range
          </h2>
          <p className="mt-2 text-muted-foreground">
            The minimum price cannot be greater than the maximum price.
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="text-xl font-semibold">No products found</h2>
          <p className="mt-2 text-muted-foreground">
            Try another search term or adjust your filters.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
