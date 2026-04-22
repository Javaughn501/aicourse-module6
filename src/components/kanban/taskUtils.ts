import type { Priority } from './types'

export function formatDueDate(iso: string | null): string | null {
  if (!iso) return null
  try {
    const d = new Date(iso + 'T12:00:00')
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(d)
  } catch {
    return iso
  }
}

export const PRIORITY_STYLES: Record<
  Priority,
  { label: string; className: string }
> = {
  low: {
    label: 'Low',
    className:
      'bg-neutral-100 text-neutral-700 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-neutral-600',
  },
  medium: {
    label: 'Medium',
    className:
      'bg-sky-100 text-sky-900 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-200 dark:ring-sky-800',
  },
  high: {
    label: 'High',
    className:
      'bg-red-100 text-red-900 ring-red-200 dark:bg-red-950/50 dark:text-red-200 dark:ring-red-900',
  },
}
