import { useCallback, useState } from 'react'

export function usePadInteraction(onHit: () => void) {
  const [active, setActive] = useState(false)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture?.(e.pointerId)
      setActive(true)
      onHit()
    },
    [onHit],
  )

  const onPointerUp = useCallback(() => {
    setActive(false)
  }, [])

  const onPointerCancel = useCallback(() => {
    setActive(false)
  }, [])

  const onPointerLeave = useCallback(() => {
    setActive(false)
  }, [])

  return {
    active,
    handlers: {
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onPointerLeave,
    },
  }
}
