import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { installMockAudioContext, MockAudioContext } from '@/test/mocks/audio-context'
import { synthesizeCrash } from './crash'

describe('synthesizeCrash', () => {
  let ctx: MockAudioContext

  beforeEach(() => {
    ctx = installMockAudioContext()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('creates a noise buffer source', () => {
    synthesizeCrash(ctx as unknown as AudioContext)
    expect(ctx.createBufferSource).toHaveBeenCalled()
  })

  it('creates a bandpass filter at 3000Hz', () => {
    synthesizeCrash(ctx as unknown as AudioContext)
    const filter = ctx.createBiquadFilter.mock.results[0].value
    expect(filter.type).toBe('bandpass')
    expect(filter.frequency.setValueAtTime).toHaveBeenCalledWith(3000, expect.any(Number))
  })

  it('has a long sustain (1.2s decay)', () => {
    synthesizeCrash(ctx as unknown as AudioContext)
    const gain = ctx.createGain.mock.results[0].value
    expect(gain.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.01, expect.any(Number))
  })

  it('connects to destination', () => {
    synthesizeCrash(ctx as unknown as AudioContext)
    const gain = ctx.createGain.mock.results[0].value
    expect(gain.connect).toHaveBeenCalledWith(ctx.destination)
  })
})
