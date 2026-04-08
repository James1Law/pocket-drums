export type PadId = 'kick' | 'snare' | 'hihat' | 'openhat' | 'tom' | 'clap'

export interface DrumPadConfig {
  id: PadId
  label: string
  color: string
  activeColor: string
}
