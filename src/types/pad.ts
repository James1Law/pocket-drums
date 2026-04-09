export type PadId =
  | 'kick'
  | 'snare'
  | 'hihat'
  | 'openhat'
  | 'tom'
  | 'clap'
  | 'tom2'
  | 'tom3'
  | 'cowbell'
  | 'ride'
  | 'crash'
  | 'tambourine'
  | 'rimshot'

export interface DrumPadConfig {
  id: PadId
  label: string
  color: string
  activeColor: string
}
