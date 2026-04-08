import { useCallback, useRef, useState } from 'react'
import type { PadId } from '@/types/pad'
import type { Recording, RecordedHit, TransportState } from '@/types/recording'

export function useRecorder() {
  const [state, setState] = useState<TransportState>('idle')
  const [recording, setRecording] = useState<Recording | null>(null)
  const hitsRef = useRef<RecordedHit[]>([])
  const startTimeRef = useRef(0)

  const startRecording = useCallback(() => {
    hitsRef.current = []
    startTimeRef.current = performance.now()
    setState('recording')
  }, [])

  const recordHit = useCallback(
    (padId: PadId) => {
      if (state !== 'recording') return
      hitsRef.current.push({
        padId,
        timestamp: performance.now() - startTimeRef.current,
      })
    },
    [state],
  )

  const stopRecording = useCallback(() => {
    const duration = performance.now() - startTimeRef.current
    setRecording({ hits: [...hitsRef.current], duration })
    setState('stopped')
  }, [])

  const clear = useCallback(() => {
    setRecording(null)
    hitsRef.current = []
    setState('idle')
  }, [])

  return {
    state,
    setState,
    recording,
    startRecording,
    stopRecording,
    recordHit,
    clear,
  }
}
