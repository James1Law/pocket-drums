import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useLoopPlayer } from './useLoopPlayer'
import type { Recording } from '@/types/recording'

// Mock the AudioEngine
vi.mock('@/audio/engine', () => ({
  AudioEngine: {
    play: vi.fn(),
    getContext: vi.fn(() => ({ currentTime: 0 })),
  },
}))

describe('useLoopPlayer', () => {
  const testRecording: Recording = {
    hits: [
      { padId: 'kick', timestamp: 0 },
      { padId: 'snare', timestamp: 500 },
    ],
    duration: 1000,
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts as not playing', () => {
    const { result } = renderHook(() => useLoopPlayer())
    expect(result.current.isPlaying).toBe(false)
  })

  it('sets isPlaying to true when started', () => {
    const { result } = renderHook(() => useLoopPlayer())
    act(() => result.current.start(testRecording))
    expect(result.current.isPlaying).toBe(true)
  })

  it('sets isPlaying to false when stopped', () => {
    const { result } = renderHook(() => useLoopPlayer())
    act(() => result.current.start(testRecording))
    act(() => result.current.stop())
    expect(result.current.isPlaying).toBe(false)
  })

  it('can be restarted after stopping', () => {
    const { result } = renderHook(() => useLoopPlayer())
    act(() => result.current.start(testRecording))
    act(() => result.current.stop())
    act(() => result.current.start(testRecording))
    expect(result.current.isPlaying).toBe(true)
  })
})
