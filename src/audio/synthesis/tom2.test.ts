import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { installMockAudioContext, MockAudioContext } from '@/test/mocks/audio-context'
import { synthesizeTom2 } from './tom2'

describe('synthesizeTom2 (Low Tom)', () => {
  let ctx: MockAudioContext

  beforeEach(() => {
    ctx = installMockAudioContext()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('creates an oscillator and gain node', () => {
    synthesizeTom2(ctx as unknown as AudioContext)
    expect(ctx.createOscillator).toHaveBeenCalled()
    expect(ctx.createGain).toHaveBeenCalled()
  })

  it('starts lower than the high tom (150Hz)', () => {
    synthesizeTom2(ctx as unknown as AudioContext)
    const osc = ctx.createOscillator.mock.results[0].value
    expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(150, expect.any(Number))
  })

  it('sweeps frequency down to 60Hz', () => {
    synthesizeTom2(ctx as unknown as AudioContext)
    const osc = ctx.createOscillator.mock.results[0].value
    expect(osc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(60, expect.any(Number))
  })

  it('connects to destination', () => {
    synthesizeTom2(ctx as unknown as AudioContext)
    const gain = ctx.createGain.mock.results[0].value
    expect(gain.connect).toHaveBeenCalledWith(ctx.destination)
  })
})
