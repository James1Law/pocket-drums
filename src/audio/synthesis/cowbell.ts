export function synthesizeCowbell(ctx: AudioContext, when = 0) {
  const now = when || ctx.currentTime

  const osc1 = ctx.createOscillator()
  osc1.type = 'square'
  osc1.frequency.setValueAtTime(587, now)

  const osc2 = ctx.createOscillator()
  osc2.type = 'square'
  osc2.frequency.setValueAtTime(845, now)

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(700, now)
  filter.Q.setValueAtTime(2, now)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.6, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

  osc1.connect(filter)
  osc2.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc1.start(now)
  osc1.stop(now + 0.2)
  osc2.start(now)
  osc2.stop(now + 0.2)

  return { osc1, osc2, filter, gain }
}
