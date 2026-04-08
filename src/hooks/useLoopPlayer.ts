import { useCallback, useRef, useState } from 'react'
import { AudioEngine } from '@/audio/engine'
import { LoopScheduler } from '@/audio/scheduler'
import type { Recording } from '@/types/recording'

export function useLoopPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const schedulerRef = useRef<LoopScheduler | null>(null)

  const start = useCallback((recording: Recording) => {
    // Stop any existing playback
    if (schedulerRef.current) {
      schedulerRef.current.stop()
    }

    const ctx = AudioEngine.getContext()
    const scheduler = new LoopScheduler(
      (padId, when) => AudioEngine.play(padId, when),
      () => ctx.currentTime,
    )

    schedulerRef.current = scheduler
    scheduler.start(recording, ctx.currentTime)
    setIsPlaying(true)
  }, [])

  const stop = useCallback(() => {
    if (schedulerRef.current) {
      schedulerRef.current.stop()
      schedulerRef.current = null
    }
    setIsPlaying(false)
  }, [])

  return { isPlaying, start, stop }
}
