'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

// Scroll-indicator: bewegende lijn die naar beneden 'vloeit'
export function ScrollHint({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`flex flex-col items-center gap-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
    >
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#926e69]">scroll</span>
      <div className="relative h-12 w-px overflow-hidden bg-[#e2e2e2]">
        <motion.div
          className="absolute inset-x-0 bg-[#cc0000]"
          style={{ height: '55%' }}
          animate={{ top: ['-55%', '100%'] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </motion.div>
  )
}

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
  amount?: number
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.7,
  direction = 'up',
  className = '',
  amount = 0.15,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: direction === 'up' ? 48 : 0,
        x: direction === 'left' ? -48 : direction === 'right' ? 48 : 0,
      }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger container — children worden na elkaar geanimeerd
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  stagger?: number
  delayChildren?: number
}

export function StaggerContainer({
  children,
  className = '',
  stagger = 0.13,
  delayChildren = 0.15,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger item — gebruik binnen StaggerContainer
interface StaggerItemProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'left' | 'right' | 'none'
}

export function StaggerItem({
  children,
  className = '',
  direction = 'up',
}: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: direction === 'up' ? 36 : 0,
          x: direction === 'left' ? -36 : direction === 'right' ? 36 : 0,
        },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
