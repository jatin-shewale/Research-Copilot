import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

export default function CountUp({ value = 0, duration = 1.1 }) {
  const [display, setDisplay] = useState(0)
  const target = Number(value) || 0
  const prevRef = useRef(0)

  useEffect(() => {
    const controls = animate(prevRef.current, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    prevRef.current = target
    return () => controls.stop()
  }, [target, duration])

  return <>{display.toLocaleString('en-US')}</>
}
