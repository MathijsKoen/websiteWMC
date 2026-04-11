'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Train, ArrowRight, MapPin, Calendar } from 'lucide-react'

const SESSION_KEY = 'wmc_beurs2026_popup_shown'

export function BeursPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Toon de popup eenmalig per sessie
    const alreadyShown = sessionStorage.getItem(SESSION_KEY)
    if (!alreadyShown) {
      // Korte vertraging zodat de pagina eerst laadt
      const t = setTimeout(() => setVisible(true), 1400)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, '1')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-lg pointer-events-auto overflow-hidden bg-[#1a1c1c] shadow-2xl">

              {/* Diagonaal rood accent — achtergrond */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-[#cc0000]/15 skew-x-[-12deg] translate-x-1/4 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-0.5 h-3/4 bg-[#cc0000] pointer-events-none" />

              {/* Sluit knop */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 z-10 p-1.5 text-white/40 hover:text-white transition-colors"
                aria-label="Popup sluiten"
              >
                <X size={20} />
              </button>

              {/* Inhoud */}
              <div className="relative z-10 p-8 md:p-10">
                {/* Kicker */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-0.5 bg-[#cc0000]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#cc0000]">
                    Westfriese Modelspoor Club
                  </span>
                </div>

                {/* Titel */}
                <h2
                  className="font-black text-4xl md:text-5xl tracking-tighter text-white leading-none mb-3"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  WMC Beurs
                  <br />
                  <span className="text-[#cc0000]">2026</span>
                </h2>

                <p className="text-white/60 text-sm leading-relaxed mb-7 max-w-xs">
                  De WMC organiseert een modelspoor tentoonstelling met uitgenodigde banen
                  van clubs door heel Nederland. Noteer het alvast in je agenda!
                </p>

                {/* Info chips */}
                <div className="flex flex-col gap-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#cc0000]/20 flex items-center justify-center shrink-0">
                      <Calendar size={14} className="text-[#cc0000]" />
                    </div>
                    <span className="text-sm text-white/70 font-medium">Datum volgt — noteer het alvast!</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#cc0000]/20 flex items-center justify-center shrink-0">
                      <MapPin size={14} className="text-[#cc0000]" />
                    </div>
                    <span className="text-sm text-white/70 font-medium">Noord-Scharwoude</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#cc0000]/20 flex items-center justify-center shrink-0">
                      <Train size={14} className="text-[#cc0000]" />
                    </div>
                    <span className="text-sm text-white/70 font-medium">Banen van clubs uit heel Nederland</span>
                  </div>
                </div>

                {/* CTA knoppen */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/beurs-2026"
                    onClick={dismiss}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#cc0000] hover:bg-[#9e0000] text-white font-black text-sm px-6 py-3.5 transition-colors duration-200"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Meer informatie
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    onClick={dismiss}
                    className="flex-1 text-sm font-bold text-white/40 hover:text-white/70 transition-colors py-3.5 border border-white/10 hover:border-white/20"
                  >
                    Sluiten
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
