import { useCallback, useRef } from 'react'
import { PAD_CONFIG_MAP } from '@/config/pads'
import { DrumPad } from './DrumPad'
import { useDragReorder } from '@/hooks/useDragReorder'
import type { DragState } from '@/hooks/useDragReorder'
import type { DrumPadConfig, PadId } from '@/types/pad'
import { cn } from '@/lib/utils'

interface PadGridProps {
  padOrder: PadId[]
  editMode: boolean
  onPadHit: (id: PadId) => void
  onMoveTo: (fromIndex: number, toIndex: number) => void
}

function DragGhost({ pad, dragState }: { pad: DrumPadConfig; dragState: DragState }) {
  const x = dragState.currentPointer.x - dragState.pointerOffset.x
  const y = dragState.currentPointer.y - dragState.pointerOffset.y
  return (
    <div
      className={cn(
        pad.color,
        'pointer-events-none flex items-center justify-center rounded-xl text-lg font-bold text-white',
      )}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: dragState.ghostRect.width,
        height: dragState.ghostRect.height,
        transform: `translate3d(${x}px, ${y}px, 0) scale(1.05)`,
        zIndex: 50,
        willChange: 'transform',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
      }}
    >
      {pad.label}
    </div>
  )
}

export function PadGrid({ padOrder, editMode, onPadHit, onMoveTo }: PadGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    dragState,
    displayOrder,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  } = useDragReorder({
    itemCount: padOrder.length,
    containerRef,
    onReorder: onMoveTo,
  })

  const isDragging = dragState !== null

  const makeDragStart = useCallback(
    (orderIndex: number) => (e: React.PointerEvent) => {
      handlePointerDown(orderIndex, e)
    },
    [handlePointerDown],
  )

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 gap-3 p-4"
      style={{ gridAutoRows: 'minmax(64px, 1fr)' }}
      onPointerMove={editMode ? handlePointerMove : undefined}
      onPointerUp={editMode ? handlePointerUp : undefined}
      onPointerCancel={editMode ? handlePointerCancel : undefined}
    >
      {displayOrder.map((orderIndex) => {
        const id = padOrder[orderIndex]
        const isBeingDragged = isDragging && orderIndex === dragState.draggedIndex
        return (
          <DrumPad
            key={id}
            pad={PAD_CONFIG_MAP[id]}
            editMode={editMode}
            index={orderIndex}
            onHit={onPadHit}
            onDragStart={editMode ? makeDragStart(orderIndex) : undefined}
            style={{
              opacity: isBeingDragged ? 0.3 : 1,
              transition: isDragging ? 'transform 200ms ease, opacity 150ms ease' : undefined,
            }}
          />
        )
      })}

      {isDragging && (
        <DragGhost
          pad={PAD_CONFIG_MAP[padOrder[dragState.draggedIndex]]}
          dragState={dragState}
        />
      )}
    </div>
  )
}
