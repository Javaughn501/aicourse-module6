import type { Product } from '../components/product'

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'rating-desc'

export interface CatalogFilters {
  search: string
  category: string
  minPrice: string
  maxPrice: string
  sort: SortOption
}

export function filterProducts(products: Product[], f: CatalogFilters): Product[] {
  const q = f.search.trim().toLowerCase()
  const min = f.minPrice === '' ? null : Number(f.minPrice)
  const max = f.maxPrice === '' ? null : Number(f.maxPrice)

  return products.filter((p) => {
    if (q) {
      const blob = `${p.title} ${p.description} ${p.category ?? ''}`.toLowerCase()
      if (!blob.includes(q)) return false
    }
    if (f.category && f.category !== 'all' && (p.category ?? '') !== f.category) return false
    if (min !== null && !Number.isNaN(min) && p.price < min) return false
    if (max !== null && !Number.isNaN(max) && p.price > max) return false
    return true
  })
}

export function sortProducts(products: Product[], sort: SortOption, originalOrder: Map<string, number>): Product[] {
  const list = [...products]
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return list.sort((a, b) => a.title.localeCompare(b.title))
    case 'rating-desc':
      return list.sort((a, b) => b.rating - a.rating)
    default:
      return list.sort((a, b) => (originalOrder.get(a.id) ?? 0) - (originalOrder.get(b.id) ?? 0))
  }
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function totalPages(count: number, pageSize: number): number {
  return Math.max(1, Math.ceil(count / pageSize))
}
