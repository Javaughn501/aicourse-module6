import type { TransactionRow } from './types'

export interface DataTableProps {
  rows: TransactionRow[]
  loading?: boolean
  caption?: string
  className?: string
}

function statusBadge(status: TransactionRow['status']) {
  const styles = {
    completed:
      'bg-emerald-500/15 text-emerald-700 ring-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
    pending:
      'bg-amber-500/15 text-amber-800 ring-amber-500/25 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-500/30',
    refunded: 'bg-red-500/15 text-red-700 ring-red-500/25 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/30',
  }
  return styles[status]
}

export function DataTable({ rows, loading = false, caption = 'Transactions', className = '' }: DataTableProps) {
  if (loading) {
    return (
      <div
        className={`overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/90 shadow-sm ring-1 ring-black/[0.04] dark:border-neutral-800 dark:bg-neutral-900/70 dark:ring-white/[0.06] ${className}`}
      >
        <div className="border-b border-neutral-200 px-4 py-4 dark:border-neutral-800 sm:px-6">
          <div className="h-5 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 motion-reduce:animate-none" />
        </div>
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-2 gap-3 px-4 py-3 sm:grid-cols-4 sm:gap-4 sm:px-6"
            >
              <div className="h-4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 motion-reduce:animate-none" />
              <div className="col-span-2 hidden h-4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 motion-reduce:animate-none sm:block" />
              <div className="h-4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 motion-reduce:animate-none" />
              <div className="h-4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 motion-reduce:animate-none sm:col-span-2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/90 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/70 dark:ring-white/[0.06] ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm text-neutral-800 dark:text-neutral-200">
          <caption className="border-b border-neutral-200 px-4 py-3 text-left text-base font-semibold text-neutral-900 dark:border-neutral-800 dark:text-neutral-50 sm:px-6">
            {caption}
            <span className="mt-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {rows.length} row{rows.length === 1 ? '' : 's'} match current filters
            </span>
          </caption>
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/90 dark:border-neutral-800 dark:bg-neutral-950/80">
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 sm:px-6"
              >
                Order
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 sm:px-6"
              >
                Date
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 sm:px-6"
              >
                Customer
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 sm:px-6"
              >
                Region
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 sm:px-6"
              >
                Category
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 sm:px-6"
              >
                Amount
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 sm:px-6"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-neutral-500 dark:text-neutral-400 sm:px-6"
                >
                  No transactions match these filters. Try widening the date range or clearing search.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="motion-safe:transition-colors motion-safe:hover:bg-neutral-50/90 dark:motion-safe:hover:bg-neutral-950/60"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-neutral-600 tabular-nums dark:text-neutral-400 sm:px-6">
                    {row.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-neutral-700 dark:text-neutral-300 sm:px-6">
                    {row.date}
                  </td>
                  <td className="max-w-[10rem] truncate px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100 sm:max-w-none sm:px-6">
                    {row.customer}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400 sm:px-6">
                    {row.region}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400 sm:px-6">
                    {row.category}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-neutral-900 dark:text-neutral-100 sm:px-6">
                    {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(row.amount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 sm:px-6">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${statusBadge(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
