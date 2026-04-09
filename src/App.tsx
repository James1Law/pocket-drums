import { useCallback, useState } from 'react'
import { PadGrid } from '@/components/PadGrid'
import { UnlockOverlay } from '@/components/UnlockOverlay'
import { AudioEngine } from '@/audio/engine'
import { useKeyboardPads } from '@/hooks/useKeyboardPads'
import { usePadLayout } from '@/hooks/usePadLayout'
import type { PadId } from '@/types/pad'

function App() {
  const { padOrder, swap, reset } = usePadLayout()
  const [editMode, setEditMode] = useState(false)

  const handlePadHit = useCallback(
    (id: PadId) => {
      if (editMode) return
      AudioEngine.unlock()
      AudioEngine.play(id)
    },
    [editMode],
  )

  useKeyboardPads(handlePadHit, padOrder)

  return (
    <div className="flex min-h-dvh flex-col">
      <UnlockOverlay />
      <header className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Pocket Drums
        </h1>
        <div className="flex gap-2">
          {editMode && (
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={() => setEditMode((v) => !v)}
            className={
              editMode
                ? 'rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground'
                : 'rounded-lg bg-muted px-3 py-1 text-xs font-medium text-muted-foreground'
            }
          >
            {editMode ? 'Done' : 'Edit'}
          </button>
        </div>
      </header>
      <main className="flex flex-1 flex-col justify-center">
        <PadGrid
          padOrder={padOrder}
          editMode={editMode}
          onPadHit={handlePadHit}
          onSwap={swap}
        />
      </main>
    </div>
  )
}

export default App
