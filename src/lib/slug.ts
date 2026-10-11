export function createCategorySlug(name: string, id: number): string {
  const nameSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return `${nameSlug || "category"}-${id}`
}
