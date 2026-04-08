import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { LoopScheduler, type ScheduleHitCallback } from './scheduler'
import type { Recording } from '@/types/recording'
import type { Mock } from 'vitest'

describe('LoopScheduler', () => {
  let onScheduleHit: Mock<ScheduleHitCallback>
  let scheduler: LoopScheduler
  let currentTime: number

  const testRecording: Recording = {
    hits: [
      { padId: 'kick', timestamp: 0 },
      { padId: 'snare', timestamp: 500 },
      { padId: 'hihat', timestamp: 1000 },
    ],
    duration: 2000,
  }

  beforeEach(() => {
    vi.useFakeTimers()
    currentTime = 0
    onScheduleHit = vi.fn()
    scheduler = new LoopScheduler(onScheduleHit, () => currentTime)
  })

  afterEach(() => {
    scheduler.stop()
    vi.useRealTimers()
  })

  it('schedules hits within the look-ahead window on start', () => {
    scheduler.start(testRecording, 0)
    // The first hit at timestamp 0 should be scheduled immediately
    expect(onScheduleHit).toHaveBeenCalledWith('kick', 0)
  })

  it('does not schedule hits beyond the look-ahead window', () => {
    scheduler.start(testRecording, 0)
    // snare at 0.5s is beyond 0.1s look-ahead
    const snareCalls = onScheduleHit.mock.calls.filter(
      (call) => call[0] === 'snare',
    )
    expect(snareCalls).toHaveLength(0)
  })

  it('schedules later hits as time advances', () => {
    scheduler.start(testRecording, 0)
    onScheduleHit.mockClear()

    currentTime = 0.45
    vi.advanceTimersByTime(25)

    expect(onScheduleHit).toHaveBeenCalledWith('snare', 0.5)
  })

  it('stops scheduling when stop is called', () => {
    scheduler.start(testRecording, 0)
    const callCount = onScheduleHit.mock.calls.length
    scheduler.stop()
    currentTime = 1
    vi.advanceTimersByTime(100)
    expect(onScheduleHit.mock.calls.length).toBe(callCount)
  })

  it('loops back to beginning after duration', () => {
    scheduler.start(testRecording, 0)
    onScheduleHit.mockClear()

    // Advance to just before second iteration
    currentTime = 1.95
    vi.advanceTimersByTime(25)

    // Advance into second iteration
    currentTime = 2.05
    vi.advanceTimersByTime(25)

    // Kick from second iteration at time 2.0 should be scheduled
    const kickCalls = onScheduleHit.mock.calls.filter(
      (call) => call[0] === 'kick',
    )
    expect(kickCalls.length).toBeGreaterThanOrEqual(1)
    // The scheduled time should be 2.0 (start of second iteration)
    expect(kickCalls[0][1]).toBeCloseTo(2.0)
  })

  it('does not double-schedule the same hit', () => {
    scheduler.start(testRecording, 0)
    // Kick should be scheduled once initially
    const initialKickCalls = onScheduleHit.mock.calls.filter(
      (call) => call[0] === 'kick',
    )
    expect(initialKickCalls).toHaveLength(1)

    // Advance time but stay before snare
    currentTime = 0.05
    vi.advanceTimersByTime(25)

    // Kick should still only be scheduled once total
    const allKickCalls = onScheduleHit.mock.calls.filter(
      (call) => call[0] === 'kick',
    )
    expect(allKickCalls).toHaveLength(1)
  })
})
