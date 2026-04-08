export function synthesizeClap(ctx: AudioContext, when = 0) {
  const now = when || ctx.currentTime
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(2000, now)
  filter.Q.setValueAtTime(1.5, now)

  const masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(0.8, now)
  masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

  filter.connect(masterGain)
  masterGain.connect(ctx.destination)

  const sources: AudioBufferSourceNode[] = []

  // 3 short noise bursts, 20ms apart
  for (let i = 0; i < 3; i++) {
    const offset = i * 0.02
    const bufferSize = Math.floor(ctx.sampleRate * 0.02)
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let j = 0; j < data.length; j++) {
      data[j] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.connect(filter)
    noise.start(now + offset)
    sources.push(noise)
  }

  return { filter, masterGain, sources }
}
