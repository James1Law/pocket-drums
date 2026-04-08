import type { SavedLoop } from '@/hooks/useLoopStorage'
import type { Recording } from '@/types/recording'
import { Button } from '@/components/ui/button'

interface SavedLoopsProps {
  loops: SavedLoop[]
  onLoad: (recording: Recording) => void
  onDelete: (id: string) => void
}

export function SavedLoops({ loops, onLoad, onDelete }: SavedLoopsProps) {
  if (loops.length === 0) return null

  return (
    <div className="px-4 py-2">
      <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
        Saved Loops
      </h2>
      <div className="space-y-1">
        {loops.map((loop) => (
          <div
            key={loop.id}
            className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
          >
            <span className="text-sm text-foreground">{loop.name}</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                aria-label="Load"
                onClick={() => onLoad(loop.recording)}
              >
                Load
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Delete"
                onClick={() => onDelete(loop.id)}
                className="text-destructive"
              >
                Del
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
