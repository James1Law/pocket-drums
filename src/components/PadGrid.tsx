import { PAD_CONFIG } from '@/config/pads'
import { DrumPad } from './DrumPad'
import type { PadId } from '@/types/pad'

interface PadGridProps {
  onPadHit: (id: PadId) => void
}

export function PadGrid({ onPadHit }: PadGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4" style={{ gridAutoRows: 'minmax(80px, 1fr)' }}>
      {PAD_CONFIG.map((pad) => (
        <DrumPad key={pad.id} pad={pad} onHit={onPadHit} />
      ))}
    </div>
  )
}
