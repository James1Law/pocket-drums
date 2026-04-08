import { vi } from 'vitest'

function createMockGainNode() {
  const gain = {
    value: 1,
    setValueAtTime: vi.fn().mockReturnThis(),
    linearRampToValueAtTime: vi.fn().mockReturnThis(),
    exponentialRampToValueAtTime: vi.fn().mockReturnThis(),
    setTargetAtTime: vi.fn().mockReturnThis(),
  }
  return {
    gain,
    connect: vi.fn().mockReturnThis(),
    disconnect: vi.fn(),
  }
}

function createMockOscillator() {
  const frequency = {
    value: 440,
    setValueAtTime: vi.fn().mockReturnThis(),
    linearRampToValueAtTime: vi.fn().mockReturnThis(),
    exponentialRampToValueAtTime: vi.fn().mockReturnThis(),
    setTargetAtTime: vi.fn().mockReturnThis(),
  }
  return {
    type: 'sine' as OscillatorType,
    frequency,
    connect: vi.fn().mockReturnThis(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }
}

function createMockBiquadFilter() {
  const frequency = {
    value: 350,
    setValueAtTime: vi.fn().mockReturnThis(),
    linearRampToValueAtTime: vi.fn().mockReturnThis(),
    exponentialRampToValueAtTime: vi.fn().mockReturnThis(),
    setTargetAtTime: vi.fn().mockReturnThis(),
  }
  return {
    type: 'lowpass' as BiquadFilterType,
    frequency,
    Q: { value: 1, setValueAtTime: vi.fn().mockReturnThis() },
    connect: vi.fn().mockReturnThis(),
    disconnect: vi.fn(),
  }
}

function createMockBufferSource() {
  return {
    buffer: null as AudioBuffer | null,
    loop: false,
    connect: vi.fn().mockReturnThis(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }
}

export class MockAudioContext {
  state: AudioContextState = 'running'
  currentTime = 0
  destination = { connect: vi.fn() }

  createGain = vi.fn(() => createMockGainNode())
  createOscillator = vi.fn(() => createMockOscillator())
  createBiquadFilter = vi.fn(() => createMockBiquadFilter())
  createBufferSource = vi.fn(() => createMockBufferSource())
  createBuffer = vi.fn(
    (channels: number, length: number, sampleRate: number) => ({
      numberOfChannels: channels,
      length,
      sampleRate,
      duration: length / sampleRate,
      getChannelData: vi.fn(() => new Float32Array(length)),
    }),
  )
  resume = vi.fn(() => {
    this.state = 'running'
    return Promise.resolve()
  })
  close = vi.fn(() => Promise.resolve())
}

export function installMockAudioContext() {
  const mock = new MockAudioContext()
  // Use a class wrapper so `new AudioContext()` works
  const FakeAudioContext = class {
    constructor() {
      return mock
    }
  }
  vi.stubGlobal('AudioContext', FakeAudioContext)
  vi.stubGlobal('webkitAudioContext', FakeAudioContext)
  return mock
}
