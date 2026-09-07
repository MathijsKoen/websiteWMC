'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'

export interface HeroFact {
  label: string
  value: string
}

interface HeroRevealProps {
  eyebrow: string
  /** Twee regels; de tweede krijgt visueel het meeste gewicht. */
  headline: [string, string]
  lead: string
 
}

const ease = [0.22, 1, 0.36, 1] as const

export function HeroReveal({ eyebrow, headline, lead }: HeroRevealProps) {
  const { scrollY } = useScroll()

  // Lichte parallax: de tekst loopt iets achter op de foto, wat diepte geeft
  // zonder dat het als effect opvalt.
  const y = useTransform(scrollY, [0, 600], [0, -60])

  return (
    <div className="relative z-10 flex min-h-[38rem] lg:min-h-[44rem] flex-col">
      <motion.div
        style={{ y, willChange: 'transform' }}
        className="flex flex-1 items-center"
      >
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 py-20 lg:py-24">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease }}
              className="mb-7"
            >
              <Eyebrow>{eyebrow}</Eyebrow>
            </motion.div>

            {/* Regel voor regel omhoog uit een masker: rustig, geen zweefeffect. */}
            <h1 className="font-headline font-black text-4xl sm:text-5xl lg:text-7xl leading-[0.95] tracking-[-0.03em] text-white">
              {headline.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className="block"
                    initial={{ y: '105%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.09, ease }}
                    style={{ willChange: 'transform' }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              className="mt-7 max-w-xl text-lg leading-relaxed text-white/70 text-pretty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.34, ease }}
            >
              {lead}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.44, ease }}
            >
              <Button href="/contact" size="lg">
                Kom een keer langs
                <ArrowRight size={18} />
              </Button>
              <Button
                href="/onze-banen"
                size="lg"
                className="!bg-white/5 !text-white border border-white/25 hover:!bg-white hover:!text-[#1a1c1c] hover:!border-white"
              >
                Bekijk onze banen
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      
    </div>
  )
}
