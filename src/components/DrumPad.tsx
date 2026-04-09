import { forwardRef, useCallback } from 'react'
import type { DrumPadConfig, PadId } from '@/types/pad'
import { usePadInteraction } from '@/hooks/usePadInteraction'
import { cn } from '@/lib/utils'

interface DrumPadProps {
  pad: DrumPadConfig
  editMode: boolean
  index: number
  onHit: (id: PadId) => void
  style?: React.CSSProperties
  onDragStart?: (e: React.PointerEvent) => void
}

export const DrumPad = forwardRef<HTMLDivElement, DrumPadProps>(
  function DrumPad({ pad, editMode, index, onHit, style, onDragStart }, ref) {
    const handleHit = useCallback(() => {
      onHit(pad.id)
    }, [pad.id, onHit])

    const { active, handlers } = usePadInteraction(handleHit)

    return (
      <div
        ref={ref}
        role="button"
        aria-label={`${pad.label} drum pad`}
        data-active={!editMode && active}
        data-pad-index={index}
        {...(editMode && onDragStart ? { onPointerDown: onDragStart } : !editMode ? handlers : {})}
        className={cn(
          'flex select-none items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg transition-all duration-100',
          editMode
            ? cn(pad.color, 'animate-jiggle cursor-grab')
            : cn(
                active ? pad.activeColor : pad.color,
                active ? 'scale-95 brightness-125 shadow-inner' : 'hover:brightness-110',
              ),
        )}
        style={{ touchAction: 'none', ...style }}
      >
        {pad.label}
      </div>
    )
  },
)
