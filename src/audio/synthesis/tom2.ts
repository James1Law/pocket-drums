export function synthesizeTom2(ctx: AudioContext, when = 0) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const now = when || ctx.currentTime

  osc.frequency.setValueAtTime(150, now)
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.2)

  gain.gain.setValueAtTime(0.8, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.35)

  return { osc, gain }
}
