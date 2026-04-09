import { useCallback, useRef } from 'react'
import type { DrumPadConfig, PadId } from '@/types/pad'
import { usePadInteraction } from '@/hooks/usePadInteraction'
import { cn } from '@/lib/utils'

interface DrumPadProps {
  pad: DrumPadConfig
  editMode: boolean
  index: number
  onHit: (id: PadId) => void
  onSwap: (indexA: number, indexB: number) => void
}

export function DrumPad({ pad, editMode, index, onHit, onSwap }: DrumPadProps) {
  const handleHit = useCallback(() => {
    onHit(pad.id)
  }, [pad.id, onHit])

  const { active, handlers } = usePadInteraction(handleHit)
  const dragOriginRef = useRef<{ x: number; y: number } | null>(null)

  const editHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      dragOriginRef.current = { x: e.clientX, y: e.clientY }
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (!dragOriginRef.current) return
      dragOriginRef.current = null
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)

      // Find the element under the pointer (look past the dragged element)
      const target = document.elementFromPoint(e.clientX, e.clientY)
      if (!target) return
      const padEl = target.closest('[data-pad-index]') as HTMLElement | null
      if (!padEl) return
      const targetIndex = Number(padEl.dataset.padIndex)
      if (!Number.isNaN(targetIndex) && targetIndex !== index) {
        onSwap(index, targetIndex)
      }
    },
    onPointerCancel: () => {
      dragOriginRef.current = null
    },
  }

  return (
    <div
      role="button"
      aria-label={`${pad.label} drum pad`}
      data-active={!editMode && active}
      data-pad-index={index}
      {...(editMode ? editHandlers : handlers)}
      className={cn(
        'flex select-none items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg transition-all duration-100',
        editMode
          ? cn(pad.color, 'animate-jiggle cursor-grab')
          : cn(
              active ? pad.activeColor : pad.color,
              active ? 'scale-95 brightness-125 shadow-inner' : 'hover:brightness-110',
            ),
      )}
      style={{ touchAction: 'none' }}
    >
      {pad.label}
    </div>
  )
}
