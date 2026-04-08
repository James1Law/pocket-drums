import { useCallback } from 'react'
import type { DrumPadConfig, PadId } from '@/types/pad'
import { usePadInteraction } from '@/hooks/usePadInteraction'
import { cn } from '@/lib/utils'

interface DrumPadProps {
  pad: DrumPadConfig
  onHit: (id: PadId) => void
}

export function DrumPad({ pad, onHit }: DrumPadProps) {
  const handleHit = useCallback(() => {
    onHit(pad.id)
  }, [pad.id, onHit])

  const { active, handlers } = usePadInteraction(handleHit)

  return (
    <div
      role="button"
      aria-label={`${pad.label} drum pad`}
      data-active={active}
      {...handlers}
      className={cn(
        'flex select-none items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg transition-all duration-100',
        active ? pad.activeColor : pad.color,
        active ? 'scale-95 brightness-125 shadow-inner' : 'hover:brightness-110',
      )}
      style={{ touchAction: 'none' }}
    >
      {pad.label}
    </div>
  )
}
