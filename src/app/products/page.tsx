import { getProducts } from "@/lib/api"
import { ProductCard } from "@/components/product-card"


export const metadata = {
  title: "Products | BE-XPERT Store",
  description: "Explore products available at BE-XPERT Store.",
}

export default async function ProductsPage() {
  let products

  try {
    products = await getProducts({ limit: 12 })
  } catch {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Our Products</h1>

        <div
          role="alert"
          className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-6"
        >
          <h2 className="font-semibold">Unable to load products</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please check your internet connection and try again later.
          </p>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <p className="mt-6 text-muted-foreground">
          No products are available right now. Please check back later.
        </p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Discover something new</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Our Products
        </h1>
        <p className="mt-3 text-muted-foreground">
          Explore our collection and find something you love.
        </p>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {products.length} products
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
