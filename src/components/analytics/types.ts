export type DateRangePreset = '7d' | '30d' | '90d' | 'ytd' | 'custom'

export interface DashboardFiltersState {
  preset: DateRangePreset
  startDate: string
  endDate: string
  region: string
  category: string
  search: string
}

export interface TransactionRow {
  id: string
  date: string
  customer: string
  region: string
  category: string
  amount: number
  status: 'completed' | 'pending' | 'refunded'
}

export interface KpiMetric {
  id: string
  label: string
  value: string
  changeLabel: string
  trend: 'up' | 'down' | 'neutral'
}
