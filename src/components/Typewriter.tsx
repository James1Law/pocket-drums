import { useEffect, useRef, useState } from 'react'

const TEXT = "Captain Chris's Personal Drum Machine"
const CHAR_DELAY = 55
const START_DELAY = 400

export function Typewriter() {
  const [charCount, setCharCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    timerRef.current = setTimeout(
      () => {
        if (charCount < TEXT.length) {
          setCharCount((c) => c + 1)
        }
      },
      charCount === 0 ? START_DELAY : CHAR_DELAY,
    )
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [charCount])

  const done = charCount >= TEXT.length

  return (
    <p className="typewriter-text px-4 pt-2 pb-1 text-base font-bold tracking-wide">
      {TEXT.slice(0, charCount)}
      {!done && <span className="animate-blink ml-0.5">|</span>}
    </p>
  )
}
