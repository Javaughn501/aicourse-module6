import { KanbanBoard } from '../components/kanban'

export function KanbanDemo() {
  return (
    <div
      id="kanban-demo"
      className="scroll-mt-24 border-t border-neutral-200 bg-neutral-100 py-10 dark:border-neutral-800 dark:bg-neutral-950 sm:scroll-mt-28 sm:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Kanban board</h1>
        </header>
        <KanbanBoard />
      </div>
    </div>
  )
}
