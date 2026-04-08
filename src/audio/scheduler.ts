import type { PadId } from '@/types/pad'
import type { Recording } from '@/types/recording'

export type ScheduleHitCallback = (padId: PadId, when: number) => void

const INTERVAL_MS = 25
const LOOK_AHEAD_S = 0.1

export class LoopScheduler {
  private intervalId: ReturnType<typeof setInterval> | null = null
  private recording: Recording | null = null
  private loopStartTime = 0
  private nextHitIndex = 0
  private currentIteration = 0
  private onScheduleHit: ScheduleHitCallback
  private getTime: () => number

  constructor(onScheduleHit: ScheduleHitCallback, getTime: () => number) {
    this.onScheduleHit = onScheduleHit
    this.getTime = getTime
  }

  start(recording: Recording, audioContextTime: number) {
    this.stop()
    this.recording = recording
    this.loopStartTime = audioContextTime
    this.nextHitIndex = 0
    this.currentIteration = 0

    this.schedule()
    this.intervalId = setInterval(() => this.schedule(), INTERVAL_MS)
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.recording = null
  }

  private schedule() {
    if (!this.recording) return

    const { hits, duration } = this.recording
    if (hits.length === 0) return

    const durationS = duration / 1000
    const now = this.getTime()
    const lookAheadEnd = now + LOOK_AHEAD_S

    for (let safety = 0; safety < 1000; safety++) {
      const iterationStart = this.loopStartTime + this.currentIteration * durationS
      const hit = hits[this.nextHitIndex]
      const hitTime = iterationStart + hit.timestamp / 1000

      if (hitTime > lookAheadEnd) break

      this.onScheduleHit(hit.padId, hitTime)
      this.nextHitIndex++

      if (this.nextHitIndex >= hits.length) {
        this.currentIteration++
        this.nextHitIndex = 0
      }
    }
  }
}
