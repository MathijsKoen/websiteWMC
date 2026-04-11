'use client'

import { motion } from 'framer-motion'

const ITEMS = [
  'WMC Beurs 2026',
  'Westfriese Modelspoor Club',
  'N-Schaal · 1:160',
  'H0-Schaal · 1:87',
  '0-Schaal · 1:43,5',
  'Noord-Scharwoude',
  'Opgericht 1998',
  'Elke vrijdagavond',
]

const SEPARATOR = '✦'

interface MarqueeProps {
  variant?: 'dark' | 'red'
  speed?: number // seconden voor één cyclus
}

export function Marquee({ variant = 'dark', speed = 28 }: MarqueeProps) {
  const isDark = variant === 'dark'

  // Verdubbel de items zodat het naadloos loopt
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div
      className={[
        'overflow-hidden py-3.5 select-none',
        isDark ? 'bg-[#1a1c1c]' : 'bg-[#cc0000]',
      ].join(' ')}
      aria-hidden="true"
    >
      <motion.div
        className="flex whitespace-nowrap will-change-transform"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className={[
              'inline-flex items-center gap-5 mx-5 text-[11px] font-black uppercase tracking-[0.2em]',
              isDark ? 'text-white/40' : 'text-white/80',
            ].join(' ')}
          >
            {item}
            <span className={isDark ? 'text-[#cc0000]' : 'text-white/40'}>
              {SEPARATOR}
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
