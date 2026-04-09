import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { installMockAudioContext, MockAudioContext } from '@/test/mocks/audio-context'
import { synthesizeRide } from './ride'

describe('synthesizeRide', () => {
  let ctx: MockAudioContext

  beforeEach(() => {
    ctx = installMockAudioContext()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('creates a noise buffer source', () => {
    synthesizeRide(ctx as unknown as AudioContext)
    expect(ctx.createBufferSource).toHaveBeenCalled()
  })

  it('creates a highpass filter at 5000Hz', () => {
    synthesizeRide(ctx as unknown as AudioContext)
    const filter = ctx.createBiquadFilter.mock.results[0].value
    expect(filter.type).toBe('highpass')
    expect(filter.frequency.setValueAtTime).toHaveBeenCalledWith(5000, expect.any(Number))
  })

  it('creates a sine oscillator for bell component', () => {
    synthesizeRide(ctx as unknown as AudioContext)
    expect(ctx.createOscillator).toHaveBeenCalled()
    const osc = ctx.createOscillator.mock.results[0].value
    expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(400, expect.any(Number))
  })

  it('connects to destination', () => {
    synthesizeRide(ctx as unknown as AudioContext)
    const gains = ctx.createGain.mock.results
    const masterGain = gains[gains.length - 1].value
    expect(masterGain.connect).toHaveBeenCalledWith(ctx.destination)
  })
})
