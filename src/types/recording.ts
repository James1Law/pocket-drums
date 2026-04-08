import type { PadId } from './pad'

export interface RecordedHit {
  padId: PadId
  timestamp: number
}

export interface Recording {
  hits: RecordedHit[]
  duration: number
}

export type TransportState = 'idle' | 'recording' | 'stopped' | 'playing'
