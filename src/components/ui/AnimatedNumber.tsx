import { useEffect, useState } from 'react'
import { animate, useMotionValue } from 'framer-motion'
import { EASE } from '@/lib/motion'

interface Props {
  value: number
  format?: (n: number) => string
  className?: string
  /** Animation duration in seconds. */
  duration?: number
}

/**
 * Smoothly tweens between numeric values with an expo ease — used for live
 * prices, totals and wattage so figures roll rather than snap.
 */
export function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toString(),
  className,
  duration = 0.6,
}: Props) {
  const mv = useMotionValue(value)
  const [display, setDisplay] = useState(() => format(value))

  useEffect(() => {
    const controls = animate(mv, value, {
      duration,
      ease: EASE,
    })
    const unsubscribe = mv.on('change', (v) => setDisplay(format(v)))
    return () => {
      controls.stop()
      unsubscribe()
    }
    // format is assumed stable; value drives the tween
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  return <span className={className}>{display}</span>
}
