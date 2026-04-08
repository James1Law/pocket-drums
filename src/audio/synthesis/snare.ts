export function synthesizeSnare(ctx: AudioContext, when = 0) {
  const now = when || ctx.currentTime

  // Noise component
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer

  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.setValueAtTime(3000, now)

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(1, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(ctx.destination)
  noise.start(now)

  // Tone component
  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(180, now)
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.08)

  const oscGain = ctx.createGain()
  oscGain.gain.setValueAtTime(0.7, now)
  oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

  osc.connect(oscGain)
  oscGain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.15)

  return { noise, osc, noiseGain, oscGain }
}
