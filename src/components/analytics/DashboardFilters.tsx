import type { DashboardFiltersState, DateRangePreset } from './types'

const PRESETS: { id: DateRangePreset; label: string }[] = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
  { id: 'ytd', label: 'Year to date' },
  { id: 'custom', label: 'Custom' },
]

export interface DashboardFiltersProps {
  filters: DashboardFiltersState
  onChange: (next: DashboardFiltersState) => void
  regions: string[]
  categories: string[]
  disabled?: boolean
  className?: string
}

export function DashboardFilters({
  filters,
  onChange,
  regions,
  categories,
  disabled = false,
  className = '',
}: DashboardFiltersProps) {
  const patch = (partial: Partial<DashboardFiltersState>) => {
    onChange({ ...filters, ...partial })
  }

  const selectClass =
    'w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-3 pr-3 text-sm text-neutral-900 outline-none ring-violet-500/0 transition-[border-color,box-shadow] focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100'

  const labelClass = 'mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400'

  return (
    <div
      className={`rounded-2xl border border-neutral-200/90 bg-white/90 p-4 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/70 dark:ring-white/[0.06] sm:p-5 ${className}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <fieldset className="min-w-0 border-0 p-0">
            <legend className={`${labelClass} mb-2`}>Date range</legend>
            <div
              role="group"
              aria-label="Date range presets"
              className="flex flex-wrap gap-2"
            >
              {PRESETS.map((p) => {
                const selected = filters.preset === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={disabled}
                    aria-pressed={selected}
                    onClick={() => patch({ preset: p.id })}
                    className={`rounded-xl px-3 py-2 text-sm font-medium outline-none transition-[background-color,color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 dark:focus-visible:ring-offset-neutral-950 ${
                      selected
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200/90 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          {filters.preset === 'custom' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="dash-start"
                  className={labelClass}
                >
                  Start date
                </label>
                <input
                  id="dash-start"
                  type="date"
                  disabled={disabled}
                  value={filters.startDate}
                  onChange={(e) => patch({ startDate: e.target.value })}
                  className={selectClass}
                />
              </div>
              <div>
                <label
                  htmlFor="dash-end"
                  className={labelClass}
                >
                  End date
                </label>
                <input
                  id="dash-end"
                  type="date"
                  disabled={disabled}
                  value={filters.endDate}
                  onChange={(e) => patch({ endDate: e.target.value })}
                  className={selectClass}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[min(100%,28rem)] lg:grid-cols-3">
          <div className="sm:col-span-1">
            <label
              htmlFor="dash-region"
              className={labelClass}
            >
              Region
            </label>
            <select
              id="dash-region"
              disabled={disabled}
              value={filters.region}
              onChange={(e) => patch({ region: e.target.value })}
              className={selectClass}
            >
              <option value="all">All regions</option>
              {regions.map((r) => (
                <option
                  key={r}
                  value={r}
                >
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-1">
            <label
              htmlFor="dash-category"
              className={labelClass}
            >
              Category
            </label>
            <select
              id="dash-category"
              disabled={disabled}
              value={filters.category}
              onChange={(e) => patch({ category: e.target.value })}
              className={selectClass}
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option
                  key={c}
                  value={c}
                >
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label
              htmlFor="dash-search"
              className={labelClass}
            >
              Search
            </label>
            <input
              id="dash-search"
              type="search"
              disabled={disabled}
              placeholder="Customer or order ID…"
              value={filters.search}
              onChange={(e) => patch({ search: e.target.value })}
              className={selectClass}
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      <p
        className="mt-4 text-xs text-neutral-500 dark:text-neutral-400"
        aria-live="polite"
      >
        Filters apply to KPIs, charts (mock series), and the transactions table.
      </p>
    </div>
  )
}
