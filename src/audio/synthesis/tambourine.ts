export function synthesizeTambourine(ctx: AudioContext, when = 0) {
  const now = when || ctx.currentTime

  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.setValueAtTime(8000, now)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.5, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

  filter.connect(gain)
  gain.connect(ctx.destination)

  const sources: AudioBufferSourceNode[] = []

  // 3 rapid micro-bursts for jingle character
  for (let i = 0; i < 3; i++) {
    const offset = i * 0.005
    const bufferSize = Math.floor(ctx.sampleRate * 0.01)
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

  return { filter, gain, sources }
}
