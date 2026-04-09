import { useEffect, useState } from 'react'

const TEXT = "Captain Chris's Personal Drum Machine"
const CHAR_DELAY = 60
const STORAGE_KEY = 'pocket-drums-typewriter-done'

export function Typewriter() {
  const [displayed, setDisplayed] = useState(() => {
    if (localStorage.getItem(STORAGE_KEY)) return TEXT
    return ''
  })
  const [done, setDone] = useState(() => !!localStorage.getItem(STORAGE_KEY))

  useEffect(() => {
    if (done) return
    if (displayed.length >= TEXT.length) {
      setDone(true)
      localStorage.setItem(STORAGE_KEY, '1')
      return
    }
    const timer = setTimeout(() => {
      setDisplayed(TEXT.slice(0, displayed.length + 1))
    }, CHAR_DELAY)
    return () => clearTimeout(timer)
  }, [displayed, done])

  return (
    <p className="px-4 pt-2 pb-1 text-sm font-medium text-muted-foreground">
      {displayed}
      {!done && <span className="animate-blink">|</span>}
    </p>
  )
}
