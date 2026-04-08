import type { DrumPadConfig } from '@/types/pad'

export const PAD_CONFIG: DrumPadConfig[] = [
  { id: 'hihat', label: 'HI-HAT', color: 'bg-yellow-600', activeColor: 'bg-yellow-400' },
  { id: 'snare', label: 'SNARE', color: 'bg-blue-600', activeColor: 'bg-blue-400' },
  { id: 'openhat', label: 'OPEN HAT', color: 'bg-green-600', activeColor: 'bg-green-400' },
  { id: 'kick', label: 'KICK', color: 'bg-orange-600', activeColor: 'bg-orange-400' },
  { id: 'tom', label: 'TOM', color: 'bg-purple-600', activeColor: 'bg-purple-400' },
  { id: 'clap', label: 'CLAP', color: 'bg-pink-600', activeColor: 'bg-pink-400' },
]
