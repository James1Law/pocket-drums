import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useKeyboardPads } from './useKeyboardPads'
import type { PadId } from '@/types/pad'

describe('useKeyboardPads', () => {
  const padOrder: PadId[] = [
    'hihat', 'ride', 'snare', 'clap', 'tom', 'tom2', 'tom3', 'cowbell', 'kick', 'openhat',
  ]

  it('maps Q key to the first pad in order (position 0)', () => {
    const onHit = vi.fn()
    renderHook(() => useKeyboardPads(onHit, padOrder))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }))
    expect(onHit).toHaveBeenCalledWith('hihat')
  })

  it('maps W key to the second pad in order (position 1)', () => {
    const onHit = vi.fn()
    renderHook(() => useKeyboardPads(onHit, padOrder))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }))
    expect(onHit).toHaveBeenCalledWith('ride')
  })

  it('maps all 10 position keys correctly', () => {
    const onHit = vi.fn()
    renderHook(() => useKeyboardPads(onHit, padOrder))
    const keys = ['q', 'w', 'a', 's', 'z', 'x', 'e', 'd', 'c', 'v']
    keys.forEach((key, i) => {
      onHit.mockClear()
      window.dispatchEvent(new KeyboardEvent('keydown', { key }))
      expect(onHit).toHaveBeenCalledWith(padOrder[i])
    })
  })

  it('follows grid position, not pad identity', () => {
    const onHit = vi.fn()
    const reordered: PadId[] = ['kick', 'snare', ...padOrder.slice(2)]
    renderHook(() => useKeyboardPads(onHit, reordered))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }))
    expect(onHit).toHaveBeenCalledWith('kick')
  })

  it('ignores key repeats', () => {
    const onHit = vi.fn()
    renderHook(() => useKeyboardPads(onHit, padOrder))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q', repeat: true }))
    expect(onHit).not.toHaveBeenCalled()
  })

  it('ignores unmapped keys', () => {
    const onHit = vi.fn()
    renderHook(() => useKeyboardPads(onHit, padOrder))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }))
    expect(onHit).not.toHaveBeenCalled()
  })
})
