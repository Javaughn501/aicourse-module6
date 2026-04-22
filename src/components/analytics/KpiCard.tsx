export interface KpiCardProps {
  label: string
  value: string
  changeLabel: string
  trend: 'up' | 'down' | 'neutral'
  loading?: boolean
  className?: string
}

export function KpiCard({
  label,
  value,
  changeLabel,
  trend,
  loading = false,
  className = '',
}: KpiCardProps) {
  const trendColor =
    trend === 'up'
      ? 'text-emerald-600 dark:text-emerald-400'
      : trend === 'down'
        ? 'text-red-600 dark:text-red-400'
        : 'text-neutral-500 dark:text-neutral-400'

  return (
    <div
      className={`rounded-2xl border border-neutral-200/90 bg-white/90 p-5 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/70 dark:ring-white/[0.06] ${className}`}
    >
      {loading ? (
        <div className="animate-pulse space-y-3 motion-reduce:animate-none">
          <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-8 w-36 max-w-full rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      ) : (
        <>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
            {value}
          </p>
          <p className={`mt-2 text-sm font-medium tabular-nums ${trendColor}`}>{changeLabel}</p>
        </>
      )}
    </div>
  )
}
