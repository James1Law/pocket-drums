import { PadGrid } from '@/components/PadGrid'
import { UnlockOverlay } from '@/components/UnlockOverlay'
import { AudioEngine } from '@/audio/engine'
import { useKeyboardPads } from '@/hooks/useKeyboardPads'
import type { PadId } from '@/types/pad'

function App() {
  const handlePadHit = (id: PadId) => {
    AudioEngine.unlock()
    AudioEngine.play(id)
  }

  useKeyboardPads(handlePadHit)

  return (
    <div className="flex min-h-dvh flex-col">
      <UnlockOverlay />
      <header className="py-3 text-center">
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Pocket Drums
        </h1>
      </header>
      <main className="flex flex-1 flex-col justify-center">
        <PadGrid onPadHit={handlePadHit} />
      </main>
    </div>
  )
}

export default App
