import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { ProductCard } from '../components/product'
import type { Product } from '../components/product'
import {
  filterProducts,
  paginate,
  sortProducts,
  totalPages,
  type CatalogFilters,
  type SortOption,
} from './productCatalogUtils'

const PAGE_SIZE = 4

const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Wireless Noise-Cancelling Headphones',
    description:
      'Comfortable over-ear headphones with adaptive noise cancellation, 30-hour battery, and crisp audio for work or travel.',
    price: 249.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Black wireless headphones on a yellow background',
    rating: 4.5,
    reviewCount: 428,
  },
  {
    id: '2',
    title: 'Minimal Everyday Backpack',
    description:
      'Water-resistant 20L backpack with padded laptop sleeve, hidden pockets, and contoured straps for long commutes.',
    price: 89.0,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Gray canvas backpack hanging on a wall hook',
    rating: 4,
    reviewCount: 156,
  },
  {
    id: '3',
    title: 'Ceramic Pour-Over Coffee Set',
    description:
      'Matte glaze dripper and server set with precision filter ridges for balanced extraction and a clean cup.',
    price: 42.5,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'White ceramic coffee dripper on a wooden counter',
    rating: 5,
    reviewCount: 89,
  },
  {
    id: '4',
    title: 'Plant-Based Skincare Serum',
    description:
      'Lightweight hydrating serum with vitamin C and botanical extracts. Fragrance-free and suitable for sensitive skin.',
    price: 34.99,
    category: 'Beauty',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Amber glass serum bottle with a dropper',
    rating: 3.5,
    reviewCount: 203,
  },
  {
    id: '5',
    title: 'Mechanical Keyboard — Tactile',
    description:
      'Hot-swappable 75% layout with PBT keycaps, per-key RGB, and pre-lubed tactile switches for a satisfying type feel.',
    price: 159.0,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Mechanical keyboard with warm backlighting',
    rating: 4.5,
    reviewCount: 612,
  },
  {
    id: '6',
    title: 'Stainless Steel Insulated Bottle',
    description:
      'Keeps drinks cold for 24 hours or hot for 12. Leak-proof cap, wide mouth for ice, and powder-coated finish.',
    price: 29.95,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Matte green metal water bottle on concrete',
    rating: 4,
    reviewCount: 91,
  },
  {
    id: '7',
    title: 'USB-C 7-in-1 Hub',
    description: 'Compact aluminum hub with HDMI, SD, USB-A, and pass-through charging for laptops.',
    price: 45.0,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd1030?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'USB hub on a desk',
    rating: 4.2,
    reviewCount: 310,
  },
  {
    id: '8',
    title: 'Premium Yoga Mat',
    description: 'Non-slip cushioned mat for studio or home practice with carrying strap.',
    price: 36.0,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Rolled yoga mat',
    rating: 4.3,
    reviewCount: 142,
  },
  {
    id: '9',
    title: 'LED Desk Lamp',
    description: 'Adjustable arm, warm to cool light temperatures, memory brightness.',
    price: 52.0,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Desk lamp',
    rating: 4.1,
    reviewCount: 98,
  },
  {
    id: '10',
    title: 'Trail Running Shoes',
    description: 'Breathable mesh, grippy outsole for mixed terrain and daily miles.',
    price: 119.0,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Running shoe',
    rating: 4.6,
    reviewCount: 540,
  },
  {
    id: '11',
    title: 'Lip Balm Trio',
    description: 'Tint-free moisturizing balms with shea butter—three pack.',
    price: 12.99,
    category: 'Beauty',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Lip care products',
    rating: 4.0,
    reviewCount: 76,
  },
  {
    id: '12',
    title: 'Polarized Sunglasses',
    description: 'Lightweight frames with UV400 lenses for bright days.',
    price: 78.0,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Sunglasses',
    rating: 4.4,
    reviewCount: 215,
  },
  {
    id: '13',
    title: 'Aluminum Monitor Stand',
    description: 'Raises your display with storage nook for keyboards and desk clutter.',
    price: 89.0,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Monitor on a stand',
    rating: 4.5,
    reviewCount: 402,
  },
  {
    id: '14',
    title: 'Cozy Throw Blanket',
    description: 'Soft knit throw for couches and reading nooks—machine washable.',
    price: 44.0,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1580301762395-cc49ef203d50?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Folded blanket',
    rating: 4.7,
    reviewCount: 188,
  },
]

const CATEGORY_OPTIONS = ['all', 'Electronics', 'Accessories', 'Home', 'Beauty', 'Sports'] as const

const originalOrder = new Map(DEMO_PRODUCTS.map((p, i) => [p.id, i]))

const defaultFilters: CatalogFilters = {
  search: '',
  category: 'all',
  minPrice: '',
  maxPrice: '',
  sort: 'featured',
}

export function ProductsDemo() {
  const [lastAdded, setLastAdded] = useState<string | null>(null)
  const [filters, setFilters] = useState<CatalogFilters>(() => ({ ...defaultFilters }))
  const [page, setPage] = useState(1)
  const [catalogError, setCatalogError] = useState(() =>
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('simulateCatalogError') === '1',
  )
  const [listLoading, setListLoading] = useState(false)

  useEffect(() => {
    const show = window.setTimeout(() => setListLoading(true), 0)
    const hide = window.setTimeout(() => setListLoading(false), 240)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
    }
  }, [filters, page])

  const updateFilters = useCallback((patch: Partial<CatalogFilters>, resetPage = true) => {
    setFilters((f) => ({ ...f, ...patch }))
    if (resetPage) setPage(1)
  }, [])

  const filtered = useMemo(() => filterProducts(DEMO_PRODUCTS, filters), [filters])
  const sorted = useMemo(
    () => sortProducts(filtered, filters.sort, originalOrder),
    [filtered, filters.sort],
  )
  const pages = totalPages(sorted.length, PAGE_SIZE)
  const safePage = Math.min(page, pages)
  const pageItems = useMemo(
    () => paginate(sorted, safePage, PAGE_SIZE),
    [sorted, safePage],
  )

  const handleAddToCart = useCallback((product: Product) => {
    setLastAdded(product.title)
  }, [])

  const clearAllFilters = useCallback(() => {
    setFilters({ ...defaultFilters })
    setPage(1)
  }, [])

  const retryAfterError = useCallback(() => {
    setCatalogError(false)
    const url = new URL(window.location.href)
    url.searchParams.delete('simulateCatalogError')
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
  }, [])

  return (
    <div className="relative min-h-svh bg-neutral-50 dark:bg-neutral-950">
      <a
        href="#product-grid"
        className="absolute left-[-10000px] top-0 z-[100] rounded-lg bg-violet-600 px-4 py-2 text-white outline-none ring-violet-300 transition-none focus:left-4 focus:top-4 focus:inline-block focus:ring-2"
      >
        Skip to products
      </a>

      <header className="border-b border-neutral-200 bg-white/80 px-4 py-8 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
            Shop demo
          </h1>
          <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
            Search, filter, sort, and paginate the catalog. Built for component and E2E demos.
          </p>
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mt-4 min-h-6 text-sm text-violet-700 dark:text-violet-300"
          >
            {lastAdded ? `Added “${lastAdded}” to cart (demo).` : '\u00a0'}
          </div>
        </div>
      </header>

      <main
        id="product-grid"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        aria-labelledby="products-heading"
      >
        <h2
          id="products-heading"
          className="sr-only"
        >
          Product catalog
        </h2>

        {catalogError ? (
          <div
            data-testid="product-catalog-error"
            role="alert"
            className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/40"
          >
            <p className="font-semibold text-red-800 dark:text-red-200">
              {"We couldn't load the catalog"}
            </p>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              Something went wrong while fetching products. Please try again.
            </p>
            <button
              type="button"
              data-testid="product-error-retry"
              className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-red-500"
              onClick={retryAfterError}
            >
              Retry
            </button>
          </div>
        ) : null}

        {!catalogError ? (
          <>
            <form
              data-testid="product-search-form"
              className="mb-8 space-y-4 rounded-2xl border border-neutral-200 bg-white/90 p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/70 sm:p-6"
              onSubmit={(e: FormEvent) => {
                e.preventDefault()
              }}
            >
              <div className="grid gap-4 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <label
                    htmlFor="product-search-input"
                    className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
                  >
                    Search
                  </label>
                  <input
                    id="product-search-input"
                    data-testid="product-search-input"
                    type="search"
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    placeholder="Search titles and descriptions…"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
                    autoComplete="off"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label
                    htmlFor="product-category-filter"
                    className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
                  >
                    Category
                  </label>
                  <select
                    id="product-category-filter"
                    data-testid="product-category-filter"
                    value={filters.category}
                    onChange={(e) => updateFilters({ category: e.target.value })}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option
                        key={c}
                        value={c}
                      >
                        {c === 'all' ? 'All categories' : c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3 lg:col-span-3">
                  <div>
                    <label
                      htmlFor="product-price-min"
                      className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
                    >
                      Min price
                    </label>
                    <input
                      id="product-price-min"
                      data-testid="product-price-min"
                      type="number"
                      min={0}
                      step="0.01"
                      inputMode="decimal"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => updateFilters({ minPrice: e.target.value })}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="product-price-max"
                      className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
                    >
                      Max price
                    </label>
                    <input
                      id="product-price-max"
                      data-testid="product-price-max"
                      type="number"
                      min={0}
                      step="0.01"
                      inputMode="decimal"
                      placeholder="Any"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
                    />
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <label
                    htmlFor="product-sort"
                    className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
                  >
                    Sort
                  </label>
                  <select
                    id="product-sort"
                    data-testid="product-sort"
                    value={filters.sort}
                    onChange={(e) => updateFilters({ sort: e.target.value as SortOption })}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                    <option value="name-asc">Name: A–Z</option>
                    <option value="rating-desc">Rating: high to low</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  data-testid="product-clear-filters"
                  className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  onClick={clearAllFilters}
                >
                  Clear all filters
                </button>
              </div>
            </form>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p
                data-testid="product-result-count"
                className="text-sm text-neutral-600 dark:text-neutral-400"
                aria-live="polite"
              >
                {sorted.length} product{sorted.length === 1 ? '' : 's'} match
                {listLoading ? '…' : ''}
              </p>
              {listLoading ? (
                <span
                  data-testid="product-catalog-loading"
                  className="text-xs font-medium text-violet-600 dark:text-violet-400"
                >
                  Updating results…
                </span>
              ) : null}
            </div>

            <section
              data-testid="product-results-region"
              aria-busy={listLoading}
              aria-label="Product results"
            >
              {sorted.length === 0 && !listLoading ? (
                <div
                  data-testid="product-empty-state"
                  role="status"
                  className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/80 px-6 py-16 text-center dark:border-neutral-700 dark:bg-neutral-900/40"
                >
                  <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">No products found</p>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    Try a different search term or clear filters to see more items.
                  </p>
                </div>
              ) : null}

              {sorted.length > 0 ? (
                <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {pageItems.map((product) => (
                    <li
                      key={product.id}
                      className="list-none"
                      data-testid={`product-card-${product.id}`}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            {sorted.length > 0 ? (
              <nav
                data-testid="product-pagination"
                className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800"
                aria-label="Catalog pagination"
              >
                <p
                  data-testid="product-page-info"
                  className="text-sm text-neutral-600 dark:text-neutral-400"
                >
                  Page {safePage} of {pages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-testid="product-page-prev"
                    className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    data-testid="product-page-next"
                    className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
                    disabled={safePage >= pages}
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </nav>
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  )
}
