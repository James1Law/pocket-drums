import { useEffect } from 'react'
import type { PadId } from '@/types/pad'

const KEY_MAP: Record<string, PadId> = {
  q: 'kick',
  w: 'snare',
  a: 'hihat',
  s: 'openhat',
  z: 'tom',
  x: 'clap',
}

export function useKeyboardPads(onHit: (id: PadId) => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return
      const padId = KEY_MAP[e.key.toLowerCase()]
      if (padId) {
        onHit(padId)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onHit])
}
