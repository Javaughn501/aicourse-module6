import type { DashboardFiltersState, DateRangePreset } from './types'

export function resolveDateRange(
  preset: DateRangePreset,
  startDate: string,
  endDate: string,
): { start: Date; inclusiveEnd: Date } {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  let start = new Date(end)

  if (preset === 'custom' && startDate && endDate) {
    const s = new Date(startDate + 'T00:00:00')
    const e = new Date(endDate + 'T23:59:59')
    return { start: s, inclusiveEnd: e }
  }

  switch (preset) {
    case '7d':
      start.setDate(start.getDate() - 6)
      break
    case '30d':
      start.setDate(start.getDate() - 29)
      break
    case '90d':
      start.setDate(start.getDate() - 89)
      break
    case 'ytd':
      start = new Date(end.getFullYear(), 0, 1)
      break
    default:
      start.setDate(start.getDate() - 29)
  }

  start.setHours(0, 0, 0, 0)
  return { start, inclusiveEnd: end }
}

export function transactionInRange(
  dateStr: string,
  range: ReturnType<typeof resolveDateRange>,
): boolean {
  const d = new Date(dateStr + 'T12:00:00')
  return d >= range.start && d <= range.inclusiveEnd
}

export function defaultFilters(): DashboardFiltersState {
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - 29)
  return {
    preset: '30d',
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    region: 'all',
    category: 'all',
    search: '',
  }
}
