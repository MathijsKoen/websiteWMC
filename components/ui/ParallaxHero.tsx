'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'

interface ParallaxHeroProps {
  children: ReactNode
  className?: string
  speed?: number
}

/**
 * Wrapper voor hero-secties met een subtiel parallax-effect op de achtergrond.
 * De inhoud schuift minder snel dan de pagina zodat er diepte ontstaat.
 */
export function ParallaxHero({ children, className = '', speed = 0.25 }: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 40}%`])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        {/* Achtergrond elementen van de hero worden hier in geplaatst via slot */}
      </motion.div>
      {children}
    </div>
  )
}

interface ParallaxLayerProps {
  children: ReactNode
  speed?: number
  className?: string
}

/**
 * Gebruik dit voor de achtergrond-laag van een hero.
 * Moet binnen een element staan dat position:relative heeft.
 */
export function ParallaxLayer({ children, speed = 0.3, className = '' }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ y }} className={`absolute inset-[-20%] will-change-transform ${className}`}>
        {children}
      </motion.div>
    </div>
  )
}
