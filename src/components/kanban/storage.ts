import { createSeedTasks, STORAGE_KEY } from './constants'
import type { KanbanPersistedState, KanbanTask } from './types'

export function loadKanbanState(): KanbanTask[] {
  if (typeof window === 'undefined') return createSeedTasks()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeedTasks()
    const parsed = JSON.parse(raw) as KanbanPersistedState
    if (!parsed.tasks || !Array.isArray(parsed.tasks)) return createSeedTasks()
    return parsed.tasks
  } catch {
    return createSeedTasks()
  }
}

export function saveKanbanState(tasks: KanbanTask[]): void {
  if (typeof window === 'undefined') return
  try {
    const payload: KanbanPersistedState = { version: 1, tasks }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* quota / private mode */
  }
}
