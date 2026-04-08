import '@testing-library/jest-dom/vitest'
import { MockAudioContext } from './mocks/audio-context'

// Provide AudioContext globally for all tests
const mockCtx = new MockAudioContext()
globalThis.AudioContext = class {
  constructor() {
    return mockCtx
  }
} as unknown as typeof AudioContext

// Polyfill pointer capture for jsdom (not implemented)
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {}
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {}
}
