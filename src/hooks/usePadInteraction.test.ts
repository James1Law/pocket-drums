import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { usePadInteraction } from './usePadInteraction'

describe('usePadInteraction', () => {
  it('returns active false initially', () => {
    const { result } = renderHook(() => usePadInteraction(vi.fn()))
    expect(result.current.active).toBe(false)
  })

  it('fires onHit callback on pointer down', () => {
    const onHit = vi.fn()
    const { result } = renderHook(() => usePadInteraction(onHit))

    act(() => {
      result.current.handlers.onPointerDown({
        pointerId: 1,
        currentTarget: { setPointerCapture: vi.fn() },
      } as unknown as React.PointerEvent)
    })

    expect(onHit).toHaveBeenCalledTimes(1)
  })

  it('sets active on pointer down', () => {
    const { result } = renderHook(() => usePadInteraction(vi.fn()))

    act(() => {
      result.current.handlers.onPointerDown({
        pointerId: 1,
        currentTarget: { setPointerCapture: vi.fn() },
      } as unknown as React.PointerEvent)
    })

    expect(result.current.active).toBe(true)
  })

  it('clears active on pointer up', () => {
    const { result } = renderHook(() => usePadInteraction(vi.fn()))

    act(() => {
      result.current.handlers.onPointerDown({
        pointerId: 1,
        currentTarget: { setPointerCapture: vi.fn() },
      } as unknown as React.PointerEvent)
    })

    act(() => {
      result.current.handlers.onPointerUp()
    })

    expect(result.current.active).toBe(false)
  })

  it('clears active on pointer cancel', () => {
    const { result } = renderHook(() => usePadInteraction(vi.fn()))

    act(() => {
      result.current.handlers.onPointerDown({
        pointerId: 1,
        currentTarget: { setPointerCapture: vi.fn() },
      } as unknown as React.PointerEvent)
    })

    act(() => {
      result.current.handlers.onPointerCancel()
    })

    expect(result.current.active).toBe(false)
  })

  it('calls setPointerCapture on pointer down', () => {
    const setPointerCapture = vi.fn()
    const { result } = renderHook(() => usePadInteraction(vi.fn()))

    act(() => {
      result.current.handlers.onPointerDown({
        pointerId: 42,
        currentTarget: { setPointerCapture },
      } as unknown as React.PointerEvent)
    })

    expect(setPointerCapture).toHaveBeenCalledWith(42)
  })

  it('does not debounce rapid hits', () => {
    const onHit = vi.fn()
    const { result } = renderHook(() => usePadInteraction(onHit))

    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.handlers.onPointerDown({
          pointerId: 1,
          currentTarget: { setPointerCapture: vi.fn() },
        } as unknown as React.PointerEvent)
      })
      act(() => {
        result.current.handlers.onPointerUp()
      })
    }

    expect(onHit).toHaveBeenCalledTimes(10)
  })
})
