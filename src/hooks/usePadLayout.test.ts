import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { usePadLayout } from './usePadLayout'
import { DEFAULT_PAD_ORDER } from '@/config/pads'

const STORAGE_KEY = 'pocket-drums-pad-order'

describe('usePadLayout', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns default pad order when no saved layout exists', () => {
    const { result } = renderHook(() => usePadLayout())
    expect(result.current.padOrder).toEqual(DEFAULT_PAD_ORDER)
  })

  it('loads saved pad order from localStorage', () => {
    const saved = [...DEFAULT_PAD_ORDER].reverse()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    const { result } = renderHook(() => usePadLayout())
    expect(result.current.padOrder).toEqual(saved)
  })

  it('falls back to default if saved order is invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json')
    const { result } = renderHook(() => usePadLayout())
    expect(result.current.padOrder).toEqual(DEFAULT_PAD_ORDER)
  })

  it('falls back to default if saved order has wrong length', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['kick', 'snare']))
    const { result } = renderHook(() => usePadLayout())
    expect(result.current.padOrder).toEqual(DEFAULT_PAD_ORDER)
  })

  it('falls back to default if saved order contains unknown pad ids', () => {
    const bad = [...DEFAULT_PAD_ORDER]
    bad[0] = 'unknown' as never
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bad))
    const { result } = renderHook(() => usePadLayout())
    expect(result.current.padOrder).toEqual(DEFAULT_PAD_ORDER)
  })

  describe('swap', () => {
    it('swaps two pads by index', () => {
      const { result } = renderHook(() => usePadLayout())
      const before = [...result.current.padOrder]
      act(() => {
        result.current.swap(0, 1)
      })
      expect(result.current.padOrder[0]).toBe(before[1])
      expect(result.current.padOrder[1]).toBe(before[0])
    })

    it('persists swapped order to localStorage', () => {
      const { result } = renderHook(() => usePadLayout())
      act(() => {
        result.current.swap(0, 1)
      })
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
      expect(stored).toEqual(result.current.padOrder)
    })

    it('is a no-op when indices are the same', () => {
      const { result } = renderHook(() => usePadLayout())
      const before = [...result.current.padOrder]
      act(() => {
        result.current.swap(2, 2)
      })
      expect(result.current.padOrder).toEqual(before)
    })
  })

  describe('reset', () => {
    it('restores default pad order', () => {
      const { result } = renderHook(() => usePadLayout())
      act(() => {
        result.current.swap(0, 1)
      })
      expect(result.current.padOrder).not.toEqual(DEFAULT_PAD_ORDER)
      act(() => {
        result.current.reset()
      })
      expect(result.current.padOrder).toEqual(DEFAULT_PAD_ORDER)
    })

    it('clears localStorage', () => {
      const { result } = renderHook(() => usePadLayout())
      act(() => {
        result.current.swap(0, 1)
      })
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
      act(() => {
        result.current.reset()
      })
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    })
  })
})
