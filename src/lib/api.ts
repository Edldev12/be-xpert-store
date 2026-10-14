
import type { Category, Product, ProductQuery } from "@/types/product";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.escuelajs.co/api/v1"
).trim().replace(/\/+$/, "");

async function request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function getProducts(
  query: ProductQuery = {},
): Promise<Product[]> {
  const params = new URLSearchParams();

  if (query.limit !== undefined) {
    params.set("limit", String(query.limit));
  }

  if (query.offset !== undefined) {
    params.set("offset", String(query.offset));
  }

  if (query.categoryId !== undefined) {
    params.set("categoryId", String(query.categoryId));
  }

  const search = params.toString();
  const endpoint = search ? `/products?${search}` : "/products";

  return request<Product[]>(endpoint);
}

export async function getProductById(id: number): Promise<Product> {
  if (!Number.isInteger(id) || id < 1) {
    throw new Error("Product ID must be a positive integer.");
  }

  return request<Product>(`/products/${id}`);
}


const ALLOWED_CATEGORY_IDS = [1, 2, 3, 4, 5];

export async function getCategories(): Promise<Category[]> {
  const categories = await request<Category[]>("/categories");

  return categories.filter((category) =>
    ALLOWED_CATEGORY_IDS.includes(category.id),
  );
}



export async function getCategoryById(id: number): Promise<Category> {
  if (!Number.isInteger(id) || id < 1) {
    throw new Error("Category ID must be a positive integer.");
  }

  return request<Category>(`/categories/${id}`);
}

export async function getProductsByCategory(
  categoryId: number,
): Promise<Product[]> {
  if (!Number.isInteger(categoryId) || categoryId < 1) {
    throw new Error("Category ID must be a positive integer.");
  }

  return request<Product[]>(`/categories/${categoryId}/products`);
}

export async function createProduct(product: {
  title: string;
  price: number;
  description: string;
  images: string[];
  categoryId: number;
}): Promise<Product> {
  const response = await fetch(`${API_URL}/products/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create product: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<Product>;
}

export async function updateProduct(
  id: number,
  product: {
    title: string;
    price: number;
    description: string;
    images: string[];
    categoryId: number;
  },
): Promise<Product> {
  if (!Number.isInteger(id) || id < 1) {
    throw new Error("Product ID must be a positive integer.");
  }

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update product: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<Product>;
}

export async function deleteProduct(id: number): Promise<void> {
  if (!Number.isInteger(id) || id < 1) {
    throw new Error("Product ID must be a positive integer.");
  }

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to delete product: ${response.status} ${response.statusText}`,
    );
  }
}

export async function createCategory(
  category: Omit<Category, "id">,
): Promise<Category> {
  const response = await fetch(`${API_URL}/categories/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error("Failed to create category");
  }

  return response.json();
}

export async function updateCategory(
  id: number,
  category: Partial<Omit<Category, "id">>,
): Promise<Category> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error("Failed to update category");
  }

  return response.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    if (
      response.status === 400 &&
      (
        body?.code === "SQLITE_CONSTRAINT_FOREIGNKEY" ||
        body?.message?.includes("FOREIGN KEY constraint failed")
      )
    ) {
      throw new Error(
        "This category is being used by other records and cannot be deleted.",
      );
    }

    throw new Error(
      body?.message ?? `Failed to delete category(${response.status}).`,
    );
  }
}

