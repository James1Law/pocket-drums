export function synthesizeRimshot(ctx: AudioContext, when = 0) {
  const now = when || ctx.currentTime

  // Tone component — short triangle wave
  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(350, now)

  const oscGain = ctx.createGain()
  oscGain.gain.setValueAtTime(0.9, now)
  oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.03)

  osc.connect(oscGain)
  oscGain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.08)

  // Noise component — cracking transient
  const bufferSize = Math.floor(ctx.sampleRate * 0.05)
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(2500, now)
  filter.Q.setValueAtTime(2, now)

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.8, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

  noise.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(ctx.destination)
  noise.start(now)

  return { osc, noise, oscGain, noiseGain, filter }
}
