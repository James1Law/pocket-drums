export function synthesizeCrash(ctx: AudioContext, when = 0) {
  const now = when || ctx.currentTime

  const bufferSize = Math.floor(ctx.sampleRate * 1.2)
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(3000, now)
  filter.Q.setValueAtTime(0.5, now)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.7, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  noise.start(now)

  return { noise, filter, gain }
}
