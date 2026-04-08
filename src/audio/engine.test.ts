import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { installMockAudioContext, MockAudioContext } from '@/test/mocks/audio-context'
import { AudioEngine } from './engine'

describe('AudioEngine', () => {
  let mockCtx: MockAudioContext

  beforeEach(() => {
    mockCtx = installMockAudioContext()
    AudioEngine.reset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('init', () => {
    it('creates an AudioContext', () => {
      AudioEngine.init()
      expect(AudioEngine.getContext()).toBe(mockCtx)
    })

    it('reuses the same context on subsequent calls', () => {
      AudioEngine.init()
      const ctx1 = AudioEngine.getContext()
      AudioEngine.init()
      const ctx2 = AudioEngine.getContext()
      expect(ctx1).toBe(ctx2)
    })
  })

  describe('unlock', () => {
    it('resumes a suspended context', async () => {
      AudioEngine.init()
      mockCtx.state = 'suspended'
      await AudioEngine.unlock()
      expect(mockCtx.resume).toHaveBeenCalled()
    })

    it('is a no-op when context is already running', async () => {
      AudioEngine.init()
      mockCtx.state = 'running'
      await AudioEngine.unlock()
      expect(mockCtx.resume).not.toHaveBeenCalled()
    })
  })

  describe('play', () => {
    it('creates audio nodes when playing kick', () => {
      AudioEngine.init()
      AudioEngine.play('kick')
      expect(mockCtx.createOscillator).toHaveBeenCalled()
      expect(mockCtx.createGain).toHaveBeenCalled()
    })

    it('creates audio nodes when playing snare', () => {
      AudioEngine.init()
      AudioEngine.play('snare')
      expect(mockCtx.createGain).toHaveBeenCalled()
    })

    it('creates audio nodes when playing hihat', () => {
      AudioEngine.init()
      AudioEngine.play('hihat')
      expect(mockCtx.createGain).toHaveBeenCalled()
    })

    it('creates audio nodes when playing openhat', () => {
      AudioEngine.init()
      AudioEngine.play('openhat')
      expect(mockCtx.createGain).toHaveBeenCalled()
    })

    it('creates audio nodes when playing tom', () => {
      AudioEngine.init()
      AudioEngine.play('tom')
      expect(mockCtx.createOscillator).toHaveBeenCalled()
    })

    it('creates audio nodes when playing clap', () => {
      AudioEngine.init()
      AudioEngine.play('clap')
      expect(mockCtx.createGain).toHaveBeenCalled()
    })

    it('allows overlapping playback (creates new nodes each call)', () => {
      AudioEngine.init()
      AudioEngine.play('kick')
      AudioEngine.play('kick')
      AudioEngine.play('kick')
      // Each call should create its own oscillator and gain nodes
      expect(mockCtx.createOscillator.mock.calls.length).toBeGreaterThanOrEqual(3)
    })

    it('auto-initializes if not already initialized', () => {
      AudioEngine.play('kick')
      expect(AudioEngine.getContext()).toBe(mockCtx)
    })
  })
})
