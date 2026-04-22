import type { DropResult } from '@hello-pangea/dnd'
import { DragDropContext } from '@hello-pangea/dnd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AddTaskModal, type NewTaskInput } from './AddTaskModal'
import { BoardColumn } from './BoardColumn'
import { ASSIGNEES, COLUMN_CONFIG, STORAGE_KEY, createSeedTasks } from './constants'
import { EditTaskModal } from './EditTaskModal'
import { applyDragResult } from './kanbanDrag'
import { normalizeOrders } from './normalizeOrders'
import { loadKanbanState, saveKanbanState } from './storage'
import type { ColumnId, KanbanTask } from './types'

export function KanbanBoard() {
  const [tasks, setTasks] = useState<KanbanTask[]>(() => loadKanbanState())
  const [addOpen, setAddOpen] = useState(false)
  const [addDefaultCol, setAddDefaultCol] = useState<ColumnId>('todo')
  const [addModalKey, setAddModalKey] = useState(0)
  const [editing, setEditing] = useState<KanbanTask | null>(null)

  useEffect(() => {
    saveKanbanState(tasks)
  }, [tasks])

  const assigneeById = useMemo(() => new Map(ASSIGNEES.map((a) => [a.id, a])), [])

  const tasksByColumn = useCallback(
    (columnId: ColumnId) =>
      tasks.filter((t) => t.columnId === columnId).sort((a, b) => a.order - b.order),
    [tasks],
  )

  const onDragEnd = useCallback((result: DropResult) => {
    setTasks((prev) => applyDragResult(prev, result))
  }, [])

  const handleCreate = useCallback((data: NewTaskInput) => {
    setTasks((prev) => {
      const colTasks = prev.filter((t) => t.columnId === data.columnId)
      const order = colTasks.length === 0 ? 0 : Math.max(...colTasks.map((t) => t.order)) + 1
      const task: KanbanTask = {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        columnId: data.columnId,
        priority: data.priority,
        dueDate: data.dueDate,
        assigneeId: data.assigneeId,
        order,
      }
      return [...prev, task]
    })
  }, [])

  const handleSaveEdit = useCallback((updated: KanbanTask) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === updated.id ? updated : t))
      return normalizeOrders(next)
    })
  }, [])

  const handleDelete = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id)
      return normalizeOrders(next)
    })
  }, [])

  const resetDemo = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setTasks(createSeedTasks())
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-neutral-600 dark:text-neutral-400">
          Drag cards between <strong className="font-medium text-neutral-800 dark:text-neutral-200">Todo</strong>,{' '}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">In Progress</strong>, and{' '}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">Done</strong>. Assign teammates, set due dates, and
          priorities. Board state syncs to <code className="rounded bg-neutral-200 px-1 text-xs dark:bg-neutral-800">localStorage</code>.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setAddDefaultCol('todo')
              setAddModalKey((k) => k + 1)
              setAddOpen(true)
            }}
            className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            Add task
          </button>
          <button
            type="button"
            onClick={resetDemo}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Reset demo
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {COLUMN_CONFIG.map((col) => (
            <BoardColumn
              key={col.id}
              columnId={col.id}
              title={col.title}
              hint={col.hint}
              tasks={tasksByColumn(col.id)}
              assigneeById={assigneeById}
              onEditTask={setEditing}
            />
          ))}
        </div>
      </DragDropContext>

      <AddTaskModal
        key={`add-${addModalKey}-${addDefaultCol}`}
        open={addOpen}
        defaultColumn={addDefaultCol}
        onClose={() => setAddOpen(false)}
        onCreate={handleCreate}
      />

      <EditTaskModal
        task={editing}
        onClose={() => setEditing(null)}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
