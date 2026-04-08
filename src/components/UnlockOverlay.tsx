import { useCallback, useState } from 'react'
import { AudioEngine } from '@/audio/engine'

export function UnlockOverlay() {
  const [visible, setVisible] = useState(true)

  const handleTap = useCallback(() => {
    // Must be synchronous within user gesture for mobile browsers
    AudioEngine.init()
    AudioEngine.unlock()
    setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleTap}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/30">
          <span className="text-3xl">&#9654;</span>
        </div>
        <p className="text-lg font-semibold text-white">Tap to Start</p>
        <p className="text-sm text-white/60">Audio requires user interaction</p>
      </div>
    </div>
  )
}
