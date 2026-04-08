import { useState } from 'react'
import { PadGrid } from '@/components/PadGrid'
import { TransportControls } from '@/components/TransportControls'
import { SavedLoops } from '@/components/SavedLoops'
import { UnlockOverlay } from '@/components/UnlockOverlay'
import { RecordingIndicator } from '@/components/RecordingIndicator'
import { AudioEngine } from '@/audio/engine'
import { useRecorder } from '@/hooks/useRecorder'
import { useLoopPlayer } from '@/hooks/useLoopPlayer'
import { useLoopStorage } from '@/hooks/useLoopStorage'
import { useKeyboardPads } from '@/hooks/useKeyboardPads'
import type { PadId } from '@/types/pad'
import type { Recording } from '@/types/recording'
import { Button } from '@/components/ui/button'

function App() {
  const recorder = useRecorder()
  const loopPlayer = useLoopPlayer()
  const storage = useLoopStorage()
  const [loopCount, setLoopCount] = useState(0)

  const handlePadHit = (id: PadId) => {
    AudioEngine.unlock()
    AudioEngine.play(id)
    recorder.recordHit(id)
  }

  useKeyboardPads(handlePadHit)

  const handlePlay = () => {
    if (recorder.recording) {
      loopPlayer.start(recorder.recording)
      recorder.setState('playing')
    }
  }

  const handleStop = () => {
    if (recorder.state === 'recording') {
      recorder.stopRecording()
    } else {
      loopPlayer.stop()
      recorder.setState('stopped')
    }
  }

  const handleClear = () => {
    loopPlayer.stop()
    recorder.clear()
  }

  const handleSave = () => {
    if (recorder.recording) {
      const count = loopCount + 1
      setLoopCount(count)
      storage.save(recorder.recording, `Loop ${count}`)
    }
  }

  const handleLoadLoop = (recording: Recording) => {
    loopPlayer.stop()
    loopPlayer.start(recording)
    recorder.setState('playing')
  }

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
      <footer className="pb-safe pb-4">
        <RecordingIndicator state={recorder.state} />
        <TransportControls
          state={recorder.state}
          hasRecording={recorder.recording !== null}
          onRecord={recorder.startRecording}
          onStop={handleStop}
          onPlay={handlePlay}
          onClear={handleClear}
        />
        {recorder.recording && (recorder.state === 'stopped' || recorder.state === 'playing') && (
          <div className="px-4 pb-2">
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleSave}
            >
              Save Loop
            </Button>
          </div>
        )}
        <SavedLoops
          loops={storage.loops}
          onLoad={handleLoadLoop}
          onDelete={storage.remove}
        />
      </footer>
    </div>
  )
}

export default App
