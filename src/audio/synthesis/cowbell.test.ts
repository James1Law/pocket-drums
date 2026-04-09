import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { installMockAudioContext, MockAudioContext } from '@/test/mocks/audio-context'
import { synthesizeCowbell } from './cowbell'

describe('synthesizeCowbell', () => {
  let ctx: MockAudioContext

  beforeEach(() => {
    ctx = installMockAudioContext()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('creates two oscillators for detuned metallic sound', () => {
    synthesizeCowbell(ctx as unknown as AudioContext)
    expect(ctx.createOscillator).toHaveBeenCalledTimes(2)
  })

  it('uses square wave oscillators', () => {
    synthesizeCowbell(ctx as unknown as AudioContext)
    const osc1 = ctx.createOscillator.mock.results[0].value
    const osc2 = ctx.createOscillator.mock.results[1].value
    expect(osc1.type).toBe('square')
    expect(osc2.type).toBe('square')
  })

  it('creates a bandpass filter', () => {
    synthesizeCowbell(ctx as unknown as AudioContext)
    expect(ctx.createBiquadFilter).toHaveBeenCalled()
    const filter = ctx.createBiquadFilter.mock.results[0].value
    expect(filter.type).toBe('bandpass')
  })

  it('connects to destination', () => {
    synthesizeCowbell(ctx as unknown as AudioContext)
    const gain = ctx.createGain.mock.results[0].value
    expect(gain.connect).toHaveBeenCalledWith(ctx.destination)
  })
})
