import { useId } from 'react'

export type ChartVariant = 'line' | 'bar' | 'area' | 'donut'

export interface ChartPlaceholderProps {
  title: string
  subtitle?: string
  variant: ChartVariant
  loading?: boolean
  className?: string
}

function LineAreaPlaceholder({ area, gradientId }: { area?: boolean; gradientId: string }) {
  const points = [12, 28, 18, 42, 32, 56, 44, 68, 52, 78, 64, 72]
  const w = 100
  const h = 48
  const max = Math.max(...points)
  const pathD = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - (p / max) * (h - 4) - 2
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
  const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-40 w-full text-violet-500 dark:text-violet-400"
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="currentColor"
            stopOpacity="0.35"
          />
          <stop
            offset="100%"
            stopColor="currentColor"
            stopOpacity="0.02"
          />
        </linearGradient>
      </defs>
      {area ? (
        <path
          d={areaD}
          fill={`url(#${gradientId})`}
        />
      ) : null}
      <path
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function BarPlaceholder() {
  const heights = [38, 62, 45, 78, 55, 88, 48, 70, 58, 82, 44, 66]
  return (
    <div
      className="flex h-40 items-end justify-between gap-1 px-1 sm:gap-1.5"
      aria-hidden
    >
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-md bg-gradient-to-t from-violet-600/25 to-violet-500/70 dark:from-violet-500/20 dark:to-violet-400/60 motion-safe:transition-all motion-safe:duration-500"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}

function DonutPlaceholder() {
  return (
    <div
      className="relative mx-auto size-40"
      aria-hidden
    >
      <div
        className="absolute inset-0 rounded-full bg-[conic-gradient(from_-90deg,var(--c1)_0deg_120deg,var(--c2)_120deg_210deg,var(--c3)_210deg_360deg)] opacity-90 [--c1:rgb(139_92_246)] [--c2:rgb(167_139_250)] [--c3:rgb(91_33_182)] dark:[--c1:rgb(167_139_250)] dark:[--c2:rgb(196_181_253)] dark:[--c3:rgb(109_40_217)]"
      />
      <div className="absolute inset-[22%] rounded-full bg-white dark:bg-neutral-900" />
    </div>
  )
}

export function ChartPlaceholder({
  title,
  subtitle,
  variant,
  loading = false,
  className = '',
}: ChartPlaceholderProps) {
  const titleId = useId().replace(/:/g, '')
  const gradientId = `${titleId}-grad`

  return (
    <section
      className={`flex flex-col rounded-2xl border border-neutral-200/90 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/70 dark:ring-white/[0.06] sm:p-5 ${className}`}
      aria-labelledby={titleId}
    >
      <div className="mb-4 shrink-0">
        <h3
          id={titleId}
          className="text-base font-semibold text-neutral-900 dark:text-neutral-50"
        >
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
        ) : null}
        <p className="sr-only">Chart visualization placeholder. Connect a charting library to render live data.</p>
      </div>

      {loading ? (
        <div
          className="flex min-h-40 flex-1 animate-pulse items-end justify-between gap-1 rounded-xl bg-neutral-100/80 px-2 py-3 dark:bg-neutral-800/50 motion-reduce:animate-none"
          aria-hidden
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-neutral-200 dark:bg-neutral-700"
              style={{ height: `${25 + ((i * 13) % 55)}%` }}
            />
          ))}
        </div>
      ) : (
        <div className="min-h-40 flex-1 rounded-xl border border-dashed border-neutral-200/90 bg-neutral-50/50 px-2 py-3 dark:border-neutral-700 dark:bg-neutral-950/40">
          {variant === 'bar' ? <BarPlaceholder /> : null}
          {variant === 'line' ? <LineAreaPlaceholder gradientId={gradientId} /> : null}
          {variant === 'area' ? (
            <LineAreaPlaceholder
              area
              gradientId={gradientId}
            />
          ) : null}
          {variant === 'donut' ? <DonutPlaceholder /> : null}
        </div>
      )}
    </section>
  )
}
