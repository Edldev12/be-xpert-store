export interface Category {
  id: number
  name: string
  image: string
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  images: string[]
  category: Category
  creationAt?: string
}

export interface ProductQuery {
  limit?: number
  offset?: number
  categoryId?: number
}
