import { useEffect, useId, useState, type FormEvent } from 'react'
import { ASSIGNEES, COLUMN_CONFIG } from './constants'
import type { ColumnId, Priority } from './types'

const field =
  'w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/25 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100'

export type NewTaskInput = {
  title: string
  description: string
  columnId: ColumnId
  priority: Priority
  dueDate: string | null
  assigneeId: string | null
}

export interface AddTaskModalProps {
  open: boolean
  defaultColumn: ColumnId
  onClose: () => void
  onCreate: (data: NewTaskInput) => void
}

export function AddTaskModal({ open, defaultColumn, onClose, onCreate }: AddTaskModalProps) {
  const titleId = useId()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [columnId, setColumnId] = useState<ColumnId>(() => defaultColumn)
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [assigneeId, setAssigneeId] = useState<string>('')

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    onCreate({
      title: t,
      description: description.trim(),
      columnId,
      priority,
      dueDate: dueDate.trim() || null,
      assigneeId: assigneeId || null,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 dark:bg-black/60"
        aria-label="Close add task dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="kanban-add-task-modal"
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
      >
        <h2
          id={titleId}
          className="text-lg font-semibold text-neutral-900 dark:text-neutral-50"
        >
          Add task
        </h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Placeholder modal wired to board state and localStorage.</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={submit}
        >
          <div>
            <label
              htmlFor="add-task-title"
              className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Title <span className="text-red-600">*</span>
            </label>
            <input
              id="add-task-title"
              data-testid="kanban-add-title"
              className={field}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="add-task-desc"
              className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Description
            </label>
            <textarea
              id="add-task-desc"
              className={`${field} min-h-[5rem] resize-y`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="add-task-column"
              className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Column
            </label>
            <select
              id="add-task-column"
              className={field}
              value={columnId}
              onChange={(e) => setColumnId(e.target.value as ColumnId)}
            >
              {COLUMN_CONFIG.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="add-task-priority"
                className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
              >
                Priority
              </label>
              <select
                id="add-task-priority"
                className={field}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="add-task-due"
                className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
              >
                Due date
              </label>
              <input
                id="add-task-due"
                type="date"
                className={field}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="add-task-assignee"
              className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Assignee
            </label>
            <select
              id="add-task-assignee"
              data-testid="kanban-add-assignee"
              className={field}
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
            >
              <option value="">Unassigned</option>
              {ASSIGNEES.map((a) => (
                <option
                  key={a.id}
                  value={a.id}
                >
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Add task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
