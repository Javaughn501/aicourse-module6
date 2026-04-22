import { useEffect, useMemo, useRef, useState } from 'react'
import { ChartPlaceholder } from './ChartPlaceholder'
import { DashboardFilters } from './DashboardFilters'
import { DataTable } from './DataTable'
import { defaultFilters, resolveDateRange, transactionInRange } from './dateRange'
import { KpiCard } from './KpiCard'
import { ALL_CATEGORIES, ALL_REGIONS, generateMockTransactions } from './mockData'
import type { DashboardFiltersState, KpiMetric, TransactionRow } from './types'

function applyFilters(rows: TransactionRow[], f: DashboardFiltersState): TransactionRow[] {
  const range = resolveDateRange(f.preset, f.startDate, f.endDate)
  const q = f.search.trim().toLowerCase()
  return rows.filter((r) => {
    if (!transactionInRange(r.date, range)) return false
    if (f.region !== 'all' && r.region !== f.region) return false
    if (f.category !== 'all' && r.category !== f.category) return false
    if (q && !r.customer.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q)) return false
    return true
  })
}

function formatMoney(n: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function buildKpis(rows: TransactionRow[]): KpiMetric[] {
  const nonRefunded = rows.filter((r) => r.status !== 'refunded')
  const revenue = nonRefunded.reduce((s, r) => s + r.amount, 0)
  const completed = rows.filter((r) => r.status === 'completed').length
  const orders = nonRefunded.length
  const aov = orders ? revenue / orders : 0
  const conversion = rows.length ? completed / rows.length : 0

  const seed = Math.round(revenue * 37 + orders * 11) % 100
  const revDelta = 1.8 + (seed % 7) * 0.21
  const ordDelta = 0.5 + (seed % 5) * 0.15
  const convDelta = -0.4 + (seed % 6) * 0.12

  return [
    {
      id: 'rev',
      label: 'Net revenue',
      value: formatMoney(revenue),
      changeLabel: `+${revDelta.toFixed(1)}% vs prior period`,
      trend: 'up',
    },
    {
      id: 'orders',
      label: 'Active orders',
      value: String(orders),
      changeLabel: `${ordDelta >= 0 ? '+' : ''}${ordDelta.toFixed(1)}% vs prior period`,
      trend: ordDelta >= 0 ? 'up' : 'down',
    },
    {
      id: 'aov',
      label: 'Avg. order value',
      value: formatMoney(aov),
      changeLabel: '+0.6% vs prior period',
      trend: 'neutral',
    },
    {
      id: 'conv',
      label: 'Completion rate',
      value: `${Math.round(conversion * 100)}%`,
      changeLabel: `${convDelta >= 0 ? '+' : ''}${convDelta.toFixed(1)}% vs prior period`,
      trend: convDelta >= 0 ? 'up' : 'down',
    },
  ]
}

export interface AnalyticsDashboardProps {
  className?: string
}

export function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const [rows] = useState(() => generateMockTransactions(52))
  const [filters, setFilters] = useState<DashboardFiltersState>(() => defaultFilters())
  const [phase, setPhase] = useState<'boot' | 'ready'>('boot')
  const [busy, setBusy] = useState(false)
  const skipFilterDebounce = useRef(true)

  useEffect(() => {
    const t = window.setTimeout(() => setPhase('ready'), 880)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase !== 'ready') return
    if (skipFilterDebounce.current) {
      skipFilterDebounce.current = false
      return
    }
    const show = window.setTimeout(() => setBusy(true), 0)
    const hide = window.setTimeout(() => setBusy(false), 420)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
    }
  }, [filters, phase])

  const filtered = useMemo(() => applyFilters(rows, filters), [rows, filters])
  const kpis = useMemo(() => buildKpis(filtered), [filtered])

  const loading = phase !== 'ready'
  const chartsBusy = loading || busy

  return (
    <div className={`space-y-8 ${className}`}>
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          Analytics
        </h1>
        <p className="max-w-2xl text-sm text-neutral-600 dark:text-neutral-400 sm:text-base">
          Revenue performance, funnel health, and operational throughput. Data is mocked for layout; charts are placeholders
          ready for your charting library.
        </p>
        <div
          role="status"
          aria-live="polite"
          className="text-sm font-medium text-violet-700 dark:text-violet-300"
        >
          {loading ? 'Loading dashboard…' : busy ? 'Applying filters…' : ''}
        </div>
      </header>

      <DashboardFilters
        filters={filters}
        onChange={setFilters}
        regions={ALL_REGIONS}
        categories={ALL_CATEGORIES}
        disabled={loading}
      />

      <section
        aria-label="Key performance indicators"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {kpis.map((k) => (
          <KpiCard
            key={k.id}
            label={k.label}
            value={k.value}
            changeLabel={k.changeLabel}
            trend={k.trend}
            loading={loading}
          />
        ))}
      </section>

      <section
        aria-label="Chart previews"
        className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3"
      >
        <ChartPlaceholder
          variant="area"
          title="Revenue trend"
          subtitle="Net of refunds · weekly buckets"
          loading={chartsBusy}
          className="lg:col-span-2 xl:col-span-2"
        />
        <ChartPlaceholder
          variant="donut"
          title="Mix by category"
          subtitle="Share of revenue in range"
          loading={chartsBusy}
        />
        <ChartPlaceholder
          variant="bar"
          title="Regional throughput"
          subtitle="Orders by region"
          loading={chartsBusy}
          className="lg:col-span-2 xl:col-span-1"
        />
        <ChartPlaceholder
          variant="line"
          title="Conversion proxy"
          subtitle="Completed ÷ total (mocked smoothing)"
          loading={chartsBusy}
          className="lg:col-span-1 xl:col-span-2"
        />
      </section>

      <DataTable
        rows={filtered}
        loading={loading}
        caption="Recent transactions"
      />
    </div>
  )
}
