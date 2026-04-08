import { useCallback, useState } from 'react'
import type { Recording } from '@/types/recording'

const STORAGE_KEY = 'pocket-drums-loops'

export interface SavedLoop {
  id: string
  name: string
  recording: Recording
  createdAt: number
}

function loadLoops(): SavedLoop[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function persistLoops(loops: SavedLoop[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(loops))
}

export function useLoopStorage() {
  const [loops, setLoops] = useState<SavedLoop[]>(loadLoops)

  const save = useCallback((recording: Recording, name: string) => {
    const newLoop: SavedLoop = {
      id: crypto.randomUUID(),
      name,
      recording,
      createdAt: Date.now(),
    }
    setLoops((prev) => {
      const updated = [...prev, newLoop]
      persistLoops(updated)
      return updated
    })
  }, [])

  const remove = useCallback((id: string) => {
    setLoops((prev) => {
      const updated = prev.filter((l) => l.id !== id)
      persistLoops(updated)
      return updated
    })
  }, [])

  return { loops, save, remove }
}
