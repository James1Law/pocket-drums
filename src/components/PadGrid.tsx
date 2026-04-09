import { PAD_CONFIG_MAP } from '@/config/pads'
import { DrumPad } from './DrumPad'
import type { PadId } from '@/types/pad'

interface PadGridProps {
  padOrder: PadId[]
  editMode: boolean
  onPadHit: (id: PadId) => void
  onSwap: (indexA: number, indexB: number) => void
}

export function PadGrid({ padOrder, editMode, onPadHit, onSwap }: PadGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4" style={{ gridAutoRows: 'minmax(64px, 1fr)' }}>
      {padOrder.map((id, index) => (
        <DrumPad
          key={id}
          pad={PAD_CONFIG_MAP[id]}
          editMode={editMode}
          index={index}
          onHit={onPadHit}
          onSwap={onSwap}
        />
      ))}
    </div>
  )
}
