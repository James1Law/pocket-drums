export function synthesizeTom3(ctx: AudioContext, when = 0) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const now = when || ctx.currentTime

  osc.frequency.setValueAtTime(100, now)
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.25)

  gain.gain.setValueAtTime(0.8, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.45)

  return { osc, gain }
}
