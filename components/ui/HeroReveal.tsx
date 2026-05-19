'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface HeroRevealProps {
  tracksCount: number
}

const ease = [0.22, 1, 0.36, 1] as const

export function HeroReveal({ tracksCount }: HeroRevealProps) {
  const { scrollY } = useScroll()

  // Parallax: tekst beweegt trager dan de pagina zodat er diepte ontstaat
  const y = useTransform(scrollY, [0, 600], [0, -100])
  // Scroll-indicator verdwijnt snel
  const hintOpacity = useTransform(scrollY, [0, 180], [1, 0])

  return (
    <>
      {/* Animated hero content */}
      <motion.div
        style={{ y, willChange: 'transform' }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 py-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            {/* Label */}
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              <div className="w-8 h-0.5 bg-[#cc0000]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                Noord-Scharwoude
              </span>
            </motion.div>

            {/* Heading — elke regel apart voor stagger */}
            <div className="font-black text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-none mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {['Westfriese', 'Modelspoor', 'Club'].map((word, i) => (
                <div key={word} style={{ overflow: 'hidden' }}>
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.6, delay: 0.08 + i * 0.1, ease }}
                    style={{ willChange: 'transform' }}
                  >
                    <span className={word === 'Modelspoor' ? 'text-[#cc0000]' : ''}>
                      {word}
                    </span>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Beschrijving */}
            <motion.div
              className="text-base text-[#4d4c4c] leading-relaxed mb-10 md:pr-8 flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38, ease }}
              style={{ willChange: 'transform, opacity' }}
            >
              <p>De WMC heeft zijn clubgebouw in Noord-Scharwoude aan de Mossel 23e, waar we op de vrijdagavond clubavond hebben van 19.30 uur tot 22.00 uur.</p>
              <p>Hier zijn de clubleden bezig om de banen die we hebben in diverse schalen, te onderhouden en eventueel te vernieuwen. Ook kunnen we op deze avond belangstellenden ontvangen en laten zien waar we mee bezig zijn op trein gebied.</p>
              <p>Ook aspirant leden zijn op die avond van harte welkom.</p>
            </motion.div>

            {/* Knoppen */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.48, ease }}
              style={{ willChange: 'transform, opacity' }}
            >
              <Button href="/contact" size="lg" skewed>
                <span>Wordt lid</span>
                <ArrowRight size={18} />
              </Button>
              <Button href="/over-ons" variant="secondary" size="lg">
                Over de club
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll-indicator: verdwijnt zodra je begint te scrollen */}
      <motion.div
        style={{ opacity: hintOpacity }}
        className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
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
    </>
  )
}
