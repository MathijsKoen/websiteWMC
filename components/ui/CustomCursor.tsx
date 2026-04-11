'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)

  const rawX = useMotionValue(-200)
  const rawY = useMotionValue(-200)

  // Dot volgt de muis direct
  const dotX = useSpring(rawX, { stiffness: 1000, damping: 40, mass: 0.3 })
  const dotY = useSpring(rawY, { stiffness: 1000, damping: 40, mass: 0.3 })

  // Ring volgt met vertraging — dit geeft het "wow" effect
  const ringX = useSpring(rawX, { stiffness: 180, damping: 22, mass: 0.6 })
  const ringY = useSpring(rawY, { stiffness: 180, damping: 22, mass: 0.6 })

  useEffect(() => {
    // Alleen op pointer-apparaten (desktop), niet op touch
    if (!window.matchMedia('(pointer: fine)').matches) return

    const move = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      setHovering(!!el.closest('a, button, [role="button"], input, textarea, select, label'))
    }

    const down = () => setClicking(true)
    const up = () => setClicking(false)
    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.documentElement.addEventListener('mouseleave', leave)
    document.documentElement.addEventListener('mouseenter', enter)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.documentElement.removeEventListener('mouseleave', leave)
      document.documentElement.removeEventListener('mouseenter', enter)
    }
  }, [rawX, rawY, visible])

  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null
  }

  return (
    <>
      {/* Rood stipje — directe respons */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: clicking ? 0.5 : hovering ? 0 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ scale: { duration: 0.12 }, opacity: { duration: 0.2 } }}
        className="fixed top-0 left-0 z-[9999] w-2.5 h-2.5 bg-[#cc0000] rounded-full pointer-events-none"
      />

      {/* Trager volgende ring — geeft diepte */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: clicking ? 0.7 : hovering ? 2.2 : 1,
          opacity: visible ? 1 : 0,
          backgroundColor: hovering ? 'rgba(204,0,0,0.08)' : 'transparent',
          borderColor: hovering ? 'rgba(204,0,0,0.7)' : 'rgba(204,0,0,0.35)',
        }}
        transition={{
          scale: { type: 'spring', stiffness: 200, damping: 20 },
          opacity: { duration: 0.2 },
          backgroundColor: { duration: 0.2 },
          borderColor: { duration: 0.2 },
        }}
        className="fixed top-0 left-0 z-[9998] w-9 h-9 rounded-full border pointer-events-none"
      />
    </>
  )
}
