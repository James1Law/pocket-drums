import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { installMockAudioContext, MockAudioContext } from '@/test/mocks/audio-context'
import { synthesizeTom3 } from './tom3'

describe('synthesizeTom3 (Floor Tom)', () => {
  let ctx: MockAudioContext

  beforeEach(() => {
    ctx = installMockAudioContext()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('creates an oscillator and gain node', () => {
    synthesizeTom3(ctx as unknown as AudioContext)
    expect(ctx.createOscillator).toHaveBeenCalled()
    expect(ctx.createGain).toHaveBeenCalled()
  })

  it('starts at 100Hz (lowest tom)', () => {
    synthesizeTom3(ctx as unknown as AudioContext)
    const osc = ctx.createOscillator.mock.results[0].value
    expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(100, expect.any(Number))
  })

  it('sweeps frequency down to 40Hz', () => {
    synthesizeTom3(ctx as unknown as AudioContext)
    const osc = ctx.createOscillator.mock.results[0].value
    expect(osc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(40, expect.any(Number))
  })

  it('connects to destination', () => {
    synthesizeTom3(ctx as unknown as AudioContext)
    const gain = ctx.createGain.mock.results[0].value
    expect(gain.connect).toHaveBeenCalledWith(ctx.destination)
  })
})
