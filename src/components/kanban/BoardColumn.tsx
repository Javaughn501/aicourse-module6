import { Droppable } from '@hello-pangea/dnd'
import { TaskCard } from './TaskCard'
import type { Assignee, ColumnId, KanbanTask } from './types'

export interface BoardColumnProps {
  columnId: ColumnId
  title: string
  hint: string
  tasks: KanbanTask[]
  assigneeById: Map<string, Assignee>
  onEditTask: (task: KanbanTask) => void
}

export function BoardColumn({ columnId, title, hint, tasks, assigneeById, onEditTask }: BoardColumnProps) {
  return (
    <section
      className="flex min-h-[min(70vh,36rem)] flex-col rounded-2xl border border-neutral-200/90 bg-neutral-50/80 dark:border-neutral-800 dark:bg-neutral-950/50"
      aria-labelledby={`kanban-col-${columnId}-title`}
    >
      <header className="border-b border-neutral-200/80 px-4 py-3 dark:border-neutral-800">
        <h2
          id={`kanban-col-${columnId}-title`}
          className="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
        >
          {title}
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>
      </header>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto p-3 transition-colors ${
              snapshot.isDraggingOver
                ? 'bg-violet-500/5 ring-2 ring-inset ring-violet-500/20 dark:bg-violet-500/10'
                : ''
            }`}
            data-testid={`kanban-column-${columnId}`}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver ? (
              <p className="rounded-xl border border-dashed border-neutral-300 px-3 py-8 text-center text-xs text-neutral-500 dark:border-neutral-600 dark:text-neutral-400">
                Drop tasks here or add a new card — drag and drop is enabled.
              </p>
            ) : null}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                assignee={task.assigneeId ? assigneeById.get(task.assigneeId) ?? null : null}
                onEdit={onEditTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  )
}
