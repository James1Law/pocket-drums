import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { installMockAudioContext, MockAudioContext } from '@/test/mocks/audio-context'
import { synthesizeRimshot } from './rimshot'

describe('synthesizeRimshot', () => {
  let ctx: MockAudioContext

  beforeEach(() => {
    ctx = installMockAudioContext()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('creates a triangle oscillator for the tone', () => {
    synthesizeRimshot(ctx as unknown as AudioContext)
    expect(ctx.createOscillator).toHaveBeenCalled()
    const osc = ctx.createOscillator.mock.results[0].value
    expect(osc.type).toBe('triangle')
  })

  it('sets oscillator frequency to 350Hz', () => {
    synthesizeRimshot(ctx as unknown as AudioContext)
    const osc = ctx.createOscillator.mock.results[0].value
    expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(350, expect.any(Number))
  })

  it('creates a noise burst through bandpass filter', () => {
    synthesizeRimshot(ctx as unknown as AudioContext)
    expect(ctx.createBufferSource).toHaveBeenCalled()
    expect(ctx.createBiquadFilter).toHaveBeenCalled()
    const filter = ctx.createBiquadFilter.mock.results[0].value
    expect(filter.type).toBe('bandpass')
  })

  it('connects to destination', () => {
    synthesizeRimshot(ctx as unknown as AudioContext)
    const gains = ctx.createGain.mock.results
    // At least one gain node should connect to destination
    const connectedToDestination = gains.some((r) =>
      r.value.connect.mock.calls.some(
        (call: unknown[]) => call[0] === ctx.destination,
      ),
    )
    expect(connectedToDestination).toBe(true)
  })
})
