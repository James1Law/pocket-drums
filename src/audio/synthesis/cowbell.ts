export function synthesizeCowbell(ctx: AudioContext, when = 0) {
  const now = when || ctx.currentTime

  // Canonical TR-808 cowbell: two inharmonic square oscillators
  // Ratio ~1:1.48 creates metallic beating
  const osc1 = ctx.createOscillator()
  osc1.type = 'square'
  osc1.frequency.setValueAtTime(540, now)

  const osc2 = ctx.createOscillator()
  osc2.type = 'square'
  osc2.frequency.setValueAtTime(800, now)

  // Bandpass centered just above the higher oscillator — this is what
  // shapes the 808 cowbell tone by cutting lows and boosting the metallic range
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(800, now)
  filter.Q.setValueAtTime(3.5, now)

  // Two-stage decay: sharp transient hit, then longer ring-out
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(1.0, now)
  gain.gain.exponentialRampToValueAtTime(0.4, now + 0.025)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)

  osc1.connect(filter)
  osc2.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc1.start(now)
  osc1.stop(now + 0.5)
  osc2.start(now)
  osc2.stop(now + 0.5)

  return { osc1, osc2, filter, gain }
}
