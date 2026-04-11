'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { ReactNode } from 'react'

interface MagneticWrapperProps {
  children: ReactNode
  strength?: number  // 0–1, hoe sterk de aantrekking is
  className?: string
}

/**
 * Wikkelt elk element in een magnetisch pull-effect.
 * Bij hover beweegt het element richting de muis en veert terug bij weggaan.
 */
export function MagneticWrapper({ children, strength = 0.35, className = '' }: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.15 })
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.15 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  )
}
