import { useCallback, useState } from 'react'
import type { PadId } from '@/types/pad'
import { DEFAULT_PAD_ORDER, PAD_CONFIG_MAP } from '@/config/pads'

const STORAGE_KEY = 'pocket-drums-pad-order'

function loadOrder(): PadId[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PAD_ORDER
    const parsed = JSON.parse(raw) as unknown[]
    if (
      !Array.isArray(parsed) ||
      parsed.length !== DEFAULT_PAD_ORDER.length ||
      !parsed.every((id) => typeof id === 'string' && id in PAD_CONFIG_MAP)
    ) {
      return DEFAULT_PAD_ORDER
    }
    return parsed as PadId[]
  } catch {
    return DEFAULT_PAD_ORDER
  }
}

function persistOrder(order: PadId[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(order))
}

export function usePadLayout() {
  const [padOrder, setPadOrder] = useState<PadId[]>(loadOrder)

  const swap = useCallback((indexA: number, indexB: number) => {
    if (indexA === indexB) return
    setPadOrder((prev) => {
      const next = [...prev]
      next[indexA] = prev[indexB]
      next[indexB] = prev[indexA]
      persistOrder(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setPadOrder(DEFAULT_PAD_ORDER)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { padOrder, swap, reset }
}
