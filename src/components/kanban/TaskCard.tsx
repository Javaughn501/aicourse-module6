import { Draggable } from '@hello-pangea/dnd'
import type { Assignee, KanbanTask } from './types'
import { formatDueDate, PRIORITY_STYLES } from './taskUtils'

export interface TaskCardProps {
  task: KanbanTask
  index: number
  assignee: Assignee | null
  onEdit: (task: KanbanTask) => void
}

const secondaryBtn =
  'w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/25 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100'

export function TaskCard({ task, index, assignee, onEdit }: TaskCardProps) {
  const due = formatDueDate(task.dueDate)
  const pr = PRIORITY_STYLES[task.priority]

  return (
    <Draggable
      draggableId={task.id}
      index={index}
    >
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-3 rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm ring-1 ring-black/[0.04] transition-shadow dark:border-neutral-800 dark:bg-neutral-900/80 dark:ring-white/[0.06] ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-violet-500/60' : 'hover:shadow-md'
          }`}
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div
              {...provided.dragHandleProps}
              className="cursor-grab touch-none active:cursor-grabbing"
              aria-label={`Drag task: ${task.title}`}
            >
              <h3 className="text-left text-sm font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
                {task.title}
              </h3>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${pr.className}`}
            >
              {pr.label}
            </span>
          </div>
          {task.description ? (
            <p className="mb-3 line-clamp-2 text-left text-xs text-neutral-600 dark:text-neutral-400">{task.description}</p>
          ) : null}

          <div className="mb-3 flex flex-wrap items-center gap-2">
            {assignee ? (
              <div
                className={`inline-flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-2 ring-1 ring-inset ${assignee.accentClass}`}
              >
                <span
                  className="flex size-7 items-center justify-center rounded-full bg-white/80 text-xs font-bold dark:bg-neutral-900/80"
                  aria-hidden
                >
                  {assignee.initials}
                </span>
                <span className="text-xs font-medium">{assignee.name}</span>
              </div>
            ) : (
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-700">
                Unassigned
              </span>
            )}
            {due ? (
              <time
                dateTime={task.dueDate!}
                className="text-xs tabular-nums text-neutral-500 dark:text-neutral-400"
              >
                Due {due}
              </time>
            ) : (
              <span className="text-xs text-neutral-400 dark:text-neutral-500">No due date</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onEdit(task)}
            className={`${secondaryBtn} border-dashed text-center text-xs font-medium text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/40`}
          >
            Edit task
          </button>
        </article>
      )}
    </Draggable>
  )
}
