import { useCallback, useRef, useState } from 'react'

export interface DragState {
  draggedIndex: number
  hoverIndex: number
  ghostRect: DOMRect
  pointerOffset: { x: number; y: number }
  currentPointer: { x: number; y: number }
}

interface UseDragReorderOptions {
  itemCount: number
  containerRef: React.RefObject<HTMLElement | null>
  onReorder: (fromIndex: number, toIndex: number) => void
}

const DRAG_THRESHOLD = 5

export function computeDisplayOrder(
  itemCount: number,
  draggedIndex: number,
  hoverIndex: number,
): number[] {
  const order = Array.from({ length: itemCount }, (_, i) => i)
  if (draggedIndex < 0 || hoverIndex < 0 || draggedIndex === hoverIndex) return order
  const [removed] = order.splice(draggedIndex, 1)
  order.splice(hoverIndex, 0, removed)
  return order
}

export function useDragReorder({
  itemCount,
  containerRef,
  onReorder,
}: UseDragReorderOptions) {
  const [dragState, setDragState] = useState<DragState | null>(null)
  const pendingRef = useRef<{
    index: number
    startX: number
    startY: number
    rect: DOMRect
  } | null>(null)
  const cellRectsRef = useRef<DOMRect[]>([])

  const cacheRects = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const children = Array.from(container.children) as HTMLElement[]
    cellRectsRef.current = children.map((el) => el.getBoundingClientRect())
  }, [containerRef])

  const hitTest = useCallback(
    (x: number, y: number): number => {
      const rects = cellRectsRef.current
      // Find the closest cell center
      let closest = 0
      let minDist = Infinity
      for (let i = 0; i < rects.length; i++) {
        const rect = rects[i]
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dist = Math.abs(x - cx) + Math.abs(y - cy)
        if (dist < minDist) {
          minDist = dist
          closest = i
        }
      }
      return closest
    },
    [],
  )

  const handlePointerDown = useCallback(
    (index: number, e: React.PointerEvent) => {
      const el = e.currentTarget as HTMLElement
      const rect = el.getBoundingClientRect()
      pendingRef.current = {
        index,
        startX: e.clientX,
        startY: e.clientY,
        rect,
      }
    },
    [],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const pending = pendingRef.current

      // Not yet dragging — check if we've passed the threshold
      if (pending && !dragState) {
        const dx = e.clientX - pending.startX
        const dy = e.clientY - pending.startY
        if (Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD) return

        // Activate drag
        cacheRects()
        setDragState({
          draggedIndex: pending.index,
          hoverIndex: pending.index,
          ghostRect: pending.rect,
          pointerOffset: {
            x: pending.startX - pending.rect.left,
            y: pending.startY - pending.rect.top,
          },
          currentPointer: { x: e.clientX, y: e.clientY },
        })
        return
      }

      // Already dragging — update position and hover target
      if (dragState) {
        const hover = hitTest(e.clientX, e.clientY)
        setDragState((prev) =>
          prev
            ? {
                ...prev,
                currentPointer: { x: e.clientX, y: e.clientY },
                hoverIndex: hover,
              }
            : null,
        )
      }
    },
    [dragState, cacheRects, hitTest],
  )

  const handlePointerUp = useCallback(() => {
    if (dragState) {
      if (dragState.draggedIndex !== dragState.hoverIndex) {
        onReorder(dragState.draggedIndex, dragState.hoverIndex)
      }
    }
    setDragState(null)
    pendingRef.current = null
  }, [dragState, onReorder])

  const handlePointerCancel = useCallback(() => {
    setDragState(null)
    pendingRef.current = null
  }, [])

  const displayOrder = dragState
    ? computeDisplayOrder(itemCount, dragState.draggedIndex, dragState.hoverIndex)
    : Array.from({ length: itemCount }, (_, i) => i)

  return {
    dragState,
    displayOrder,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  }
}
