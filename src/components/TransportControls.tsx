import type { TransportState } from '@/types/recording'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TransportControlsProps {
  state: TransportState
  hasRecording: boolean
  onRecord: () => void
  onStop: () => void
  onPlay: () => void
  onClear: () => void
}

export function TransportControls({
  state,
  hasRecording,
  onRecord,
  onStop,
  onPlay,
  onClear,
}: TransportControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3 px-4 py-3">
      <Button
        variant="outline"
        size="lg"
        aria-label="Rec"
        disabled={state === 'recording' || state === 'playing'}
        onClick={onRecord}
        className={cn(
          'flex-1',
          state === 'recording' && 'animate-pulse border-red-500 text-red-500',
        )}
      >
        REC
      </Button>

      <Button
        variant="outline"
        size="lg"
        aria-label="Stop"
        disabled={state === 'idle' || state === 'stopped'}
        onClick={onStop}
        className="flex-1"
      >
        STOP
      </Button>

      <Button
        variant="outline"
        size="lg"
        aria-label="Play"
        disabled={!hasRecording || state === 'recording' || state === 'playing'}
        onClick={onPlay}
        className="flex-1"
      >
        PLAY
      </Button>

      <Button
        variant="outline"
        size="lg"
        aria-label="Clear"
        disabled={!hasRecording && state !== 'playing'}
        onClick={onClear}
        className="flex-1"
      >
        CLR
      </Button>
    </div>
  )
}
