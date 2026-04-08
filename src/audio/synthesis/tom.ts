export function synthesizeTom(ctx: AudioContext, when = 0) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const now = when || ctx.currentTime

  osc.frequency.setValueAtTime(200, now)
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.15)

  gain.gain.setValueAtTime(0.8, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.25)

  return { osc, gain }
}
