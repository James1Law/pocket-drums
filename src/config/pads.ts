import type { DrumPadConfig, PadId } from '@/types/pad'

/** All available pad configs — the first 10 are the default active set. */
export const PAD_CONFIG: DrumPadConfig[] = [
  // Default 10 pads (2x5 grid)
  { id: 'hihat', label: 'HI-HAT', color: 'bg-yellow-600', activeColor: 'bg-yellow-400' },
  { id: 'ride', label: 'RIDE', color: 'bg-amber-600', activeColor: 'bg-amber-400' },
  { id: 'snare', label: 'SNARE', color: 'bg-blue-600', activeColor: 'bg-blue-400' },
  { id: 'clap', label: 'CLAP', color: 'bg-pink-600', activeColor: 'bg-pink-400' },
  { id: 'tom', label: 'TOM', color: 'bg-purple-600', activeColor: 'bg-purple-400' },
  { id: 'tom2', label: 'LOW TOM', color: 'bg-violet-600', activeColor: 'bg-violet-400' },
  { id: 'tom3', label: 'FLOOR TOM', color: 'bg-indigo-600', activeColor: 'bg-indigo-400' },
  { id: 'cowbell', label: 'COWBELL', color: 'bg-rose-600', activeColor: 'bg-rose-400' },
  { id: 'kick', label: 'KICK', color: 'bg-orange-600', activeColor: 'bg-orange-400' },
  { id: 'openhat', label: 'OPEN HAT', color: 'bg-green-600', activeColor: 'bg-green-400' },
  // Swappable extras (not shown by default)
  { id: 'crash', label: 'CRASH', color: 'bg-cyan-600', activeColor: 'bg-cyan-400' },
  { id: 'tambourine', label: 'TAMBOURINE', color: 'bg-teal-600', activeColor: 'bg-teal-400' },
  { id: 'rimshot', label: 'RIM SHOT', color: 'bg-red-600', activeColor: 'bg-red-400' },
]

export const DEFAULT_PAD_COUNT = 10

export const DEFAULT_PAD_ORDER: PadId[] = PAD_CONFIG.slice(0, DEFAULT_PAD_COUNT).map((p) => p.id)

export const PAD_CONFIG_MAP: Record<PadId, DrumPadConfig> = Object.fromEntries(
  PAD_CONFIG.map((p) => [p.id, p]),
) as Record<PadId, DrumPadConfig>
