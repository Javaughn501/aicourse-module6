import type { DropResult } from '@hello-pangea/dnd'
import type { ColumnId, KanbanTask } from './types'

const COL_ORDER: ColumnId[] = ['todo', 'inProgress', 'done']

export function applyDragResult(tasks: KanbanTask[], result: DropResult): KanbanTask[] {
  const { destination, source, draggableId } = result
  if (!destination) return tasks

  const sourceCol = source.droppableId as ColumnId
  const destCol = destination.droppableId as ColumnId
  if (sourceCol === destCol && source.index === destination.index) return tasks

  const grouped = COL_ORDER.map((col) =>
    tasks.filter((t) => t.columnId === col).sort((a, b) => a.order - b.order),
  )

  const idx = (col: ColumnId) => COL_ORDER.indexOf(col)
  const listFor = (col: ColumnId) => grouped[idx(col)]!

  const sourceArr = [...listFor(sourceCol)]
  const [moved] = sourceArr.splice(source.index, 1)
  if (!moved || moved.id !== draggableId) return tasks

  const updatedMoved: KanbanTask = { ...moved, columnId: destCol }
  const destArr = sourceCol === destCol ? sourceArr : [...listFor(destCol)]
  destArr.splice(destination.index, 0, updatedMoved)

  if (sourceCol === destCol) {
    grouped[idx(sourceCol)] = destArr
  } else {
    grouped[idx(sourceCol)] = sourceArr
    grouped[idx(destCol)] = destArr
  }

  const out: KanbanTask[] = []
  for (let i = 0; i < COL_ORDER.length; i++) {
    const col = COL_ORDER[i]!
    const list = grouped[i]!.map((t, order) => ({ ...t, columnId: col, order }))
    out.push(...list)
  }
  return out
}
