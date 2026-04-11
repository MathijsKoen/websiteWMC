'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number // maximale kantelhoek in graden
}

/**
 * Wrapper die een 3D perspectief-kantel effect toevoegt bij hover.
 * Gebruik als vervanging van een gewone <div> om kaarten tot leven te brengen.
 */
export function TiltCard({ children, className = '', intensity = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const xSpring = useSpring(x, { stiffness: 260, damping: 28 })
  const ySpring = useSpring(y, { stiffness: 260, damping: 28 })

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`])
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`])

  // Subtiele glans die over het oppervlak beweegt
  const glareX = useTransform(xSpring, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(ySpring, [-0.5, 0.5], ['0%', '100%'])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
      }}
      className={`relative ${className}`}
    >
      {children}

      {/* Glans-overlay — subtiel licht effect */}
      <motion.div
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.08) 0%, transparent 65%)`,
          transformStyle: 'preserve-3d',
          translateZ: 1,
        }}
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
      />
    </motion.div>
  )
}
