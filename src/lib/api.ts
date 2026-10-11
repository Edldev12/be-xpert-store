import type { Category, Product, ProductQuery } from "@/types/product"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.escuelajs.co/api/v1"

async function request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`)

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    )
  }

  return response.json() as Promise<T>
}

export async function getProducts(
  query: ProductQuery = {},
): Promise<Product[]> {
  const params = new URLSearchParams()

  if (query.limit !== undefined) {
    params.set("limit", String(query.limit))
  }

  if (query.offset !== undefined) {
    params.set("offset", String(query.offset))
  }

  if (query.categoryId !== undefined) {
    params.set("categoryId", String(query.categoryId))
  }

  const search = params.toString()
  const endpoint = search ? `/products?${search}` : "/products"

  return request<Product[]>(endpoint)
}

export async function getProductById(id: number): Promise<Product> {
  if (!Number.isInteger(id) || id < 1) {
    throw new Error("Product ID must be a positive integer.")
  }

  return request<Product>(`/products/${id}`)
}

export async function getCategories(): Promise<Category[]> {
  return request<Category[]>("/categories")
}

export async function getCategoryById(id: number): Promise<Category> {
  if (!Number.isInteger(id) || id < 1) {
    throw new Error("Category ID must be a positive integer.")
  }

  return request<Category>(`/categories/${id}`)
}

export async function getProductsByCategory(
  categoryId: number,
): Promise<Product[]> {
  if (!Number.isInteger(categoryId) || categoryId < 1) {
    throw new Error("Category ID must be a positive integer.")
  }

  return request<Product[]>(`/categories/${categoryId}/products`)
}
