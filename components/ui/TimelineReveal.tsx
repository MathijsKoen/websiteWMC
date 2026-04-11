'use client'

import { motion } from 'framer-motion'

interface TimelineItem {
  year: string
  event: string
}

interface TimelineRevealProps {
  items: TimelineItem[]
}

export function TimelineReveal({ items }: TimelineRevealProps) {
  return (
    <div className="relative pl-8">
      {/* Vertical line — draws itself from top to bottom */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#e2e2e2] origin-top"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="space-y-8">
        {items.map((item, i) => (
          <motion.div
            key={item.year}
            className="relative"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.65,
              delay: i * 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Dot */}
            <motion.div
              className="absolute -left-10 top-1 w-4 h-4 bg-[#cc0000]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.4,
                delay: i * 0.18 + 0.2,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            />

            <span
              className="text-[#cc0000] font-black text-sm tracking-widest"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {item.year}
            </span>
            <p className="text-[#4d4c4c] text-sm mt-1">{item.event}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
