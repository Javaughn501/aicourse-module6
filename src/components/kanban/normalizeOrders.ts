import type { ColumnId, KanbanTask } from './types'

const COLS: ColumnId[] = ['todo', 'inProgress', 'done']

export function normalizeOrders(tasks: KanbanTask[]): KanbanTask[] {
  const out: KanbanTask[] = []
  for (const col of COLS) {
    const list = tasks.filter((t) => t.columnId === col).sort((a, b) => a.order - b.order)
    list.forEach((t, order) => out.push({ ...t, columnId: col, order }))
  }
  return out
}
