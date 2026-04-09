import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { installMockAudioContext, MockAudioContext } from '@/test/mocks/audio-context'
import { synthesizeTambourine } from './tambourine'

describe('synthesizeTambourine', () => {
  let ctx: MockAudioContext

  beforeEach(() => {
    ctx = installMockAudioContext()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('creates multiple noise burst sources for jingle effect', () => {
    synthesizeTambourine(ctx as unknown as AudioContext)
    expect(ctx.createBufferSource.mock.calls.length).toBeGreaterThanOrEqual(3)
  })

  it('creates a highpass filter at 8000Hz', () => {
    synthesizeTambourine(ctx as unknown as AudioContext)
    const filter = ctx.createBiquadFilter.mock.results[0].value
    expect(filter.type).toBe('highpass')
    expect(filter.frequency.setValueAtTime).toHaveBeenCalledWith(8000, expect.any(Number))
  })

  it('connects to destination', () => {
    synthesizeTambourine(ctx as unknown as AudioContext)
    const gain = ctx.createGain.mock.results[0].value
    expect(gain.connect).toHaveBeenCalledWith(ctx.destination)
  })
})
