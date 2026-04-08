import type { PadId } from '@/types/pad'
import {
  synthesizeKick,
  synthesizeSnare,
  synthesizeHihat,
  synthesizeOpenHat,
  synthesizeTom,
  synthesizeClap,
} from './synthesis'

const synthesizers: Record<PadId, (ctx: AudioContext, when?: number) => void> = {
  kick: synthesizeKick,
  snare: synthesizeSnare,
  hihat: synthesizeHihat,
  openhat: synthesizeOpenHat,
  tom: synthesizeTom,
  clap: synthesizeClap,
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

  async unlock() {
    const ctx = getContext()
    if (ctx.state === 'suspended') {
      await ctx.resume()
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
