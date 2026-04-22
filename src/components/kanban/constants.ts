import type { Assignee, ColumnId, KanbanTask } from './types'

export const STORAGE_KEY = 'kanban-board-v1'

export const COLUMN_CONFIG: { id: ColumnId; title: string; hint: string }[] = [
  { id: 'todo', title: 'Todo', hint: 'Backlog and ideas' },
  { id: 'inProgress', title: 'In Progress', hint: 'Active work' },
  { id: 'done', title: 'Done', hint: 'Shipped' },
]

export const ASSIGNEES: Assignee[] = [
  { id: 'a1', name: 'Sam Rivera', initials: 'SR', accentClass: 'bg-violet-500/20 text-violet-700 ring-violet-500/40 dark:text-violet-300' },
  { id: 'a2', name: 'Jordan Lee', initials: 'JL', accentClass: 'bg-sky-500/20 text-sky-800 ring-sky-500/40 dark:text-sky-200' },
  { id: 'a3', name: 'Riley Chen', initials: 'RC', accentClass: 'bg-emerald-500/20 text-emerald-800 ring-emerald-500/40 dark:text-emerald-200' },
  { id: 'a4', name: 'Morgan Diaz', initials: 'MD', accentClass: 'bg-amber-500/20 text-amber-900 ring-amber-500/40 dark:text-amber-100' },
]

export function createSeedTasks(): KanbanTask[] {
  return [
    {
      id: 't1',
      title: 'Design review feedback',
      description: 'Consolidate comments from stakeholders.',
      columnId: 'todo',
      priority: 'high',
      dueDate: null,
      assigneeId: 'a1',
      order: 0,
    },
    {
      id: 't2',
      title: 'API contract draft',
      description: 'OpenAPI spec for billing endpoints.',
      columnId: 'todo',
      priority: 'medium',
      dueDate: '2026-04-15',
      assigneeId: 'a2',
      order: 1,
    },
    {
      id: 't3',
      title: 'Wire checkout A/B test',
      description: 'Hook experiment flag to analytics.',
      columnId: 'inProgress',
      priority: 'high',
      dueDate: '2026-04-02',
      assigneeId: 'a3',
      order: 0,
    },
    {
      id: 't4',
      title: 'Onboarding tooltip copy',
      description: 'Microcopy for first-run checklist.',
      columnId: 'inProgress',
      priority: 'low',
      dueDate: null,
      assigneeId: 'a4',
      order: 1,
    },
    {
      id: 't5',
      title: 'Release v2.1 notes',
      description: 'Published to changelog.',
      columnId: 'done',
      priority: 'medium',
      dueDate: '2026-03-20',
      assigneeId: 'a1',
      order: 0,
    },
  ]
}
