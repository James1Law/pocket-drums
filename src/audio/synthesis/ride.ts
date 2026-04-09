export function synthesizeRide(ctx: AudioContext, when = 0) {
  const now = when || ctx.currentTime

  // Noise component — shimmer
  const bufferSize = Math.floor(ctx.sampleRate * 0.8)
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.setValueAtTime(5000, now)

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.3, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8)

  noise.connect(filter)
  filter.connect(noiseGain)

  // Bell component — low sine
  const osc = ctx.createOscillator()
  osc.frequency.setValueAtTime(400, now)

  const oscGain = ctx.createGain()
  oscGain.gain.setValueAtTime(0.15, now)
  oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6)

  osc.connect(oscGain)

  // Master output
  const masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(0.4, now)
  masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8)

  noiseGain.connect(masterGain)
  oscGain.connect(masterGain)
  masterGain.connect(ctx.destination)

  noise.start(now)
  osc.start(now)
  osc.stop(now + 0.8)

  return { noise, osc, filter, noiseGain, oscGain, masterGain }
}
