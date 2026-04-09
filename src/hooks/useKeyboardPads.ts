import { useEffect } from 'react'
import type { PadId } from '@/types/pad'

/** Keys mapped to grid positions (0–9), read left-to-right, top-to-bottom. */
const POSITION_KEYS = ['q', 'w', 'a', 's', 'z', 'x', 'e', 'd', 'c', 'v']

export function useKeyboardPads(
  onHit: (id: PadId) => void,
  padOrder: PadId[],
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return
      const index = POSITION_KEYS.indexOf(e.key.toLowerCase())
      if (index >= 0 && index < padOrder.length) {
        onHit(padOrder[index])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onHit, padOrder])
}
