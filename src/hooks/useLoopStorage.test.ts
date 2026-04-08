import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useLoopStorage } from './useLoopStorage'
import type { Recording } from '@/types/recording'

const STORAGE_KEY = 'pocket-drums-loops'

const testRecording: Recording = {
  hits: [
    { padId: 'kick', timestamp: 0 },
    { padId: 'snare', timestamp: 500 },
  ],
  duration: 1000,
}

describe('useLoopStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with empty loops', () => {
    const { result } = renderHook(() => useLoopStorage())
    expect(result.current.loops).toEqual([])
  })

  it('saves a loop', () => {
    const { result } = renderHook(() => useLoopStorage())
    act(() => result.current.save(testRecording, 'My Loop'))

    expect(result.current.loops).toHaveLength(1)
    expect(result.current.loops[0].name).toBe('My Loop')
    expect(result.current.loops[0].recording).toEqual(testRecording)
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useLoopStorage())
    act(() => result.current.save(testRecording, 'My Loop'))

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored).toHaveLength(1)
    expect(stored[0].name).toBe('My Loop')
  })

  it('loads from localStorage on mount', () => {
    const savedData = [
      {
        id: 'test-id',
        name: 'Saved Loop',
        recording: testRecording,
        createdAt: Date.now(),
      },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData))

    const { result } = renderHook(() => useLoopStorage())
    expect(result.current.loops).toHaveLength(1)
    expect(result.current.loops[0].name).toBe('Saved Loop')
  })

  it('deletes a loop by id', () => {
    const { result } = renderHook(() => useLoopStorage())
    act(() => result.current.save(testRecording, 'Loop 1'))
    act(() => result.current.save(testRecording, 'Loop 2'))

    const idToDelete = result.current.loops[0].id
    act(() => result.current.remove(idToDelete))

    expect(result.current.loops).toHaveLength(1)
    expect(result.current.loops[0].name).toBe('Loop 2')
  })

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid json{{{')
    const { result } = renderHook(() => useLoopStorage())
    expect(result.current.loops).toEqual([])
  })
})
