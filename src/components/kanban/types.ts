export type ColumnId = 'todo' | 'inProgress' | 'done'

export type Priority = 'low' | 'medium' | 'high'

export interface Assignee {
  id: string
  name: string
  initials: string
  /** Tailwind classes for avatar ring/background */
  accentClass: string
}

export interface KanbanTask {
  id: string
  title: string
  description: string
  columnId: ColumnId
  priority: Priority
  /** ISO date yyyy-mm-dd or null */
  dueDate: string | null
  assigneeId: string | null
  /** Sort order within column */
  order: number
}

export interface KanbanPersistedState {
  tasks: KanbanTask[]
  version: 1
}
