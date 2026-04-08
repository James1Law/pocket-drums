import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useRecorder } from './useRecorder'

describe('useRecorder', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts in idle state with no recording', () => {
    const { result } = renderHook(() => useRecorder())
    expect(result.current.state).toBe('idle')
    expect(result.current.recording).toBeNull()
  })

  it('transitions to recording on startRecording', () => {
    const { result } = renderHook(() => useRecorder())
    act(() => result.current.startRecording())
    expect(result.current.state).toBe('recording')
  })

  it('captures hits with timestamps relative to recording start', () => {
    let time = 1000
    vi.spyOn(performance, 'now').mockImplementation(() => time)

    const { result } = renderHook(() => useRecorder())

    act(() => result.current.startRecording())

    time = 1200
    act(() => result.current.recordHit('kick'))

    time = 1500
    act(() => result.current.recordHit('snare'))

    time = 2000
    act(() => result.current.stopRecording())

    expect(result.current.state).toBe('stopped')
    expect(result.current.recording).not.toBeNull()
    expect(result.current.recording!.hits).toHaveLength(2)
    expect(result.current.recording!.hits[0]).toEqual({
      padId: 'kick',
      timestamp: 200,
    })
    expect(result.current.recording!.hits[1]).toEqual({
      padId: 'snare',
      timestamp: 500,
    })
    expect(result.current.recording!.duration).toBe(1000)
  })

  it('ignores recordHit when not recording', () => {
    const { result } = renderHook(() => useRecorder())
    act(() => result.current.recordHit('kick'))
    expect(result.current.recording).toBeNull()
  })

  it('clears recording and returns to idle', () => {
    let time = 0
    vi.spyOn(performance, 'now').mockImplementation(() => time)

    const { result } = renderHook(() => useRecorder())
    act(() => result.current.startRecording())
    time = 100
    act(() => result.current.stopRecording())
    act(() => result.current.clear())

    expect(result.current.state).toBe('idle')
    expect(result.current.recording).toBeNull()
  })
})
