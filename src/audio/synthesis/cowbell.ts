export function synthesizeCowbell(ctx: AudioContext, when = 0) {
  const now = when || ctx.currentTime

  // Two inharmonic square oscillators (classic 808 cowbell frequencies)
  const osc1 = ctx.createOscillator()
  osc1.type = 'square'
  osc1.frequency.setValueAtTime(545, now)

  const osc2 = ctx.createOscillator()
  osc2.type = 'square'
  osc2.frequency.setValueAtTime(815, now)

  // Highpass filter keeps the metallic brightness
  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.setValueAtTime(400, now)

  // Two-stage decay: sharp initial drop then longer ring
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.7, now)
  gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

  osc1.connect(filter)
  osc2.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc1.start(now)
  osc1.stop(now + 0.3)
  osc2.start(now)
  osc2.stop(now + 0.3)

  return { osc1, osc2, filter, gain }
}
