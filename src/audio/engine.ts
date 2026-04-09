import type { PadId } from '@/types/pad'
import {
  synthesizeKick,
  synthesizeSnare,
  synthesizeHihat,
  synthesizeOpenHat,
  synthesizeTom,
  synthesizeClap,
  synthesizeTom2,
  synthesizeTom3,
  synthesizeCowbell,
  synthesizeRide,
  synthesizeCrash,
  synthesizeTambourine,
  synthesizeRimshot,
} from './synthesis'

const synthesizers: Record<PadId, (ctx: AudioContext, when?: number) => void> = {
  kick: synthesizeKick,
  snare: synthesizeSnare,
  hihat: synthesizeHihat,
  openhat: synthesizeOpenHat,
  tom: synthesizeTom,
  clap: synthesizeClap,
  tom2: synthesizeTom2,
  tom3: synthesizeTom3,
  cowbell: synthesizeCowbell,
  ride: synthesizeRide,
  crash: synthesizeCrash,
  tambourine: synthesizeTambourine,
  rimshot: synthesizeRimshot,
}

let context: AudioContext | null = null

function getContext(): AudioContext {
  if (!context) {
    context = new AudioContext()
  }
  return context
}

export const AudioEngine = {
  init() {
    getContext()
  },

  unlock() {
    const ctx = getContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
  },

  play(padId: PadId, when?: number) {
    const ctx = getContext()
    synthesizers[padId](ctx, when)
  },

  getContext(): AudioContext {
    return getContext()
  },

  reset() {
    context = null
  },
}
