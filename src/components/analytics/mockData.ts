import type { TransactionRow } from './types'

const REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America'] as const
const CATEGORIES = ['Electronics', 'Apparel', 'Home', 'Beauty', 'Sports'] as const
const CUSTOMERS = [
  'Nimbus Labs',
  'Harbor Retail',
  'Vertex Health',
  'Copperline Media',
  'Brightfield Co',
  'Aster Goods',
  'Northwind Traders',
  'Contoso Foods',
]

const statuses: TransactionRow['status'][] = ['completed', 'completed', 'completed', 'pending', 'refunded']

/** Deterministic pseudo-random 0..1 from string seed */
function hash01(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i)
  return Math.abs(Math.sin(h)) % 1
}

export function generateMockTransactions(count = 48): TransactionRow[] {
  const rows: TransactionRow[] = []
  const base = new Date()
  base.setHours(12, 0, 0, 0)

  for (let i = 0; i < count; i++) {
    const d = new Date(base)
    d.setDate(d.getDate() - Math.floor((i * 7 + (i % 3) * 2) % 120))

    const id = `TX-${String(10042 + i)}`
    const r = hash01(id)
    const amount = Math.round((38 + r * 920 + (i % 5) * 40) * 100) / 100

    rows.push({
      id,
      date: d.toISOString().slice(0, 10),
      customer: CUSTOMERS[i % CUSTOMERS.length]!,
      region: REGIONS[i % REGIONS.length]!,
      category: CATEGORIES[i % CATEGORIES.length]!,
      amount,
      status: statuses[i % statuses.length]!,
    })
  }

  return rows.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export const ALL_REGIONS = [...REGIONS]
export const ALL_CATEGORIES = [...CATEGORIES]
