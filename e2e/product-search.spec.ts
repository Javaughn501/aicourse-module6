import { expect, test, type Page } from '@playwright/test'

async function gotoCatalog(page: Page) {
  await page.goto('/#product-grid')
  await expect(page.getByTestId('product-search-input')).toBeVisible()
}

/** Wait until the catalog finishes its short “loading” debounce after filter/pagination changes. */
async function waitForCatalogIdle(page: Page) {
  const region = page.getByTestId('product-results-region')
  await expect(region).toBeVisible()
  await expect(region).toHaveAttribute('aria-busy', 'false', { timeout: 5000 })
}

test.describe('Product catalog search and filters', () => {
  test.beforeEach(async ({ page }) => {
    await gotoCatalog(page)
    await waitForCatalogIdle(page)
  })

  test('search with valid query shows matching products', async ({ page }) => {
    // "keyboard" also matches the monitor stand description ("keyboards"); use a unique term.
    await page.getByTestId('product-search-input').fill('tactile')
    await waitForCatalogIdle(page)

    await expect(page.getByTestId('product-result-count')).toContainText(/1 product match/)
    await expect(page.getByTestId('product-card-5')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Mechanical Keyboard/i })).toBeVisible()
  })

  test('search with no results shows empty state', async ({ page }) => {
    await page.getByTestId('product-search-input').fill('zzznomatchqueryxyz')
    await waitForCatalogIdle(page)

    await expect(page.getByTestId('product-result-count')).toContainText(/0 products match/)
    await expect(page.getByTestId('product-empty-state')).toBeVisible()
    await expect(page.getByTestId('product-empty-state')).toContainText(/No products found/)
  })

  test('apply single filter — category', async ({ page }) => {
    await page.getByTestId('product-category-filter').selectOption('Electronics')
    await waitForCatalogIdle(page)

    await expect(page.getByTestId('product-result-count')).toContainText(/4 products match/)
    await expect(page.getByTestId('product-card-1')).toBeVisible()
    await expect(page.getByTestId('product-card-7')).toBeVisible()
  })

  test('apply multiple filters — category and price range', async ({ page }) => {
    await page.getByTestId('product-category-filter').selectOption('Electronics')
    await page.getByTestId('product-price-min').fill('40')
    await page.getByTestId('product-price-max').fill('100')
    await waitForCatalogIdle(page)

    await expect(page.getByTestId('product-result-count')).toContainText(/2 products match/)
    await expect(page.getByTestId('product-card-7')).toBeVisible()
    await expect(page.getByTestId('product-card-13')).toBeVisible()
  })

  test('clear all filters resets the catalog', async ({ page }) => {
    await page.getByTestId('product-search-input').fill('bottle')
    await page.getByTestId('product-category-filter').selectOption('Accessories')
    await waitForCatalogIdle(page)

    await expect(page.getByTestId('product-result-count')).toContainText(/1 product match/)

    await page.getByTestId('product-clear-filters').click()
    await waitForCatalogIdle(page)

    await expect(page.getByTestId('product-search-input')).toHaveValue('')
    await expect(page.getByTestId('product-category-filter')).toHaveValue('all')
    await expect(page.getByTestId('product-price-min')).toHaveValue('')
    await expect(page.getByTestId('product-price-max')).toHaveValue('')
    await expect(page.getByTestId('product-result-count')).toContainText(/14 products match/)
  })

  test('pagination navigation', async ({ page }) => {
    await expect(page.getByTestId('product-page-info')).toContainText('Page 1 of 4')

    const firstPageCard = page.getByTestId('product-card-1')
    await expect(firstPageCard).toBeVisible()

    await page.getByTestId('product-page-next').click()
    await waitForCatalogIdle(page)

    await expect(page.getByTestId('product-page-info')).toContainText('Page 2 of 4')
    await expect(firstPageCard).toBeHidden()
    await expect(page.getByTestId('product-card-5')).toBeVisible()

    await page.getByTestId('product-page-prev').click()
    await waitForCatalogIdle(page)

    await expect(page.getByTestId('product-page-info')).toContainText('Page 1 of 4')
    await expect(firstPageCard).toBeVisible()
  })

  test('sort by different criteria', async ({ page }) => {
    await page.getByTestId('product-sort').selectOption('price-asc')
    await waitForCatalogIdle(page)

    const firstItem = page.locator('[data-testid^="product-card-"]').first()
    await expect(firstItem).toHaveAttribute('data-testid', 'product-card-11')

    await page.getByTestId('product-sort').selectOption('price-desc')
    await waitForCatalogIdle(page)

    const firstDesc = page.locator('[data-testid^="product-card-"]').first()
    await expect(firstDesc).toHaveAttribute('data-testid', 'product-card-1')

    await page.getByTestId('product-sort').selectOption('name-asc')
    await waitForCatalogIdle(page)

    await expect(page.locator('[data-testid^="product-card-"]').first()).toHaveAttribute(
      'data-testid',
      'product-card-13',
    )
  })

  test('loading state: results region finishes updates and clears loading indicator', async ({ page }) => {
    const region = page.getByTestId('product-results-region')
    await expect(region).toHaveAttribute('aria-busy', 'false')

    await page.getByTestId('product-search-input').fill('yoga')

    await expect(region).toHaveAttribute('aria-busy', 'false', { timeout: 5000 })
    await expect(page.getByTestId('product-catalog-loading')).toBeHidden()
    await expect(page.getByTestId('product-result-count')).toContainText(/1 product match/)
  })
})

test.describe('Product catalog error state', () => {
  test('simulated error shows message and retry restores catalog', async ({ page }) => {
    await page.goto('/?simulateCatalogError=1#product-grid')

    await expect(page.getByTestId('product-catalog-error')).toBeVisible()
    await expect(page.getByTestId('product-catalog-error')).toContainText(/couldn't load/i)
    await expect(page.getByTestId('product-search-input')).toBeHidden()

    await page.getByTestId('product-error-retry').click()

    await expect(page.getByTestId('product-catalog-error')).toBeHidden()
    await expect(page.getByTestId('product-search-input')).toBeVisible()
    await waitForCatalogIdle(page)
    await expect(page.getByTestId('product-result-count')).toContainText(/14 products match/)
  })
})
