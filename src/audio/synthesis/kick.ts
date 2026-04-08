export function synthesizeKick(ctx: AudioContext, when = 0) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const now = when || ctx.currentTime

  osc.frequency.setValueAtTime(150, now)
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.1)

  gain.gain.setValueAtTime(1, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.3)

  return { osc, gain }
}
