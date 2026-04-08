import type { TransportState } from '@/types/recording'

interface RecordingIndicatorProps {
  state: TransportState
}

export function RecordingIndicator({ state }: RecordingIndicatorProps) {
  if (state === 'idle') return null

  return (
    <div className="flex items-center justify-center gap-2 py-1">
      {state === 'recording' && (
        <>
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
          <span className="text-xs font-medium text-red-400">RECORDING</span>
        </>
      )}
      {state === 'playing' && (
        <>
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
          <span className="text-xs font-medium text-green-400">PLAYING</span>
        </>
      )}
      {state === 'stopped' && (
        <span className="text-xs font-medium text-muted-foreground">READY</span>
      )}
    </div>
  )
}
