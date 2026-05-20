'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cookieConsent')
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function respond(choice: 'accepted' | 'rejected') {
    localStorage.setItem('cookieConsent', choice)
    window.dispatchEvent(new CustomEvent('cookieConsentChange', { detail: choice }))
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Cookietoestemming"
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[90] bg-[#1a1c1c] shadow-2xl overflow-hidden"
        >
          {/* Rode accentlijn links */}
          <div className="absolute top-0 left-0 w-0.5 h-full bg-[#cc0000]" />

          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-0.5 bg-[#cc0000]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#cc0000]">
                Cookies
              </span>
            </div>

            <p
              className="text-white font-bold text-base mb-1 leading-snug"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Mogen wij analytische cookies plaatsen?
            </p>
            <p className="text-white/50 text-[13px] leading-relaxed mb-5">
              Wij gebruiken Google Analytics om het gebruik van onze website anoniem bij te houden.
              Functionele cookies (inloggen) worden altijd geplaatst.{' '}
              <Link href="/privacy" className="text-[#cc0000] hover:underline">
                Privacyverklaring
              </Link>
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => respond('accepted')}
                className="flex-1 bg-[#cc0000] hover:bg-[#9e0000] text-white font-black text-sm py-2.5 transition-colors"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Accepteren
              </button>
              <button
                onClick={() => respond('rejected')}
                className="flex-1 border border-white/20 hover:border-white/40 text-white/60 hover:text-white font-bold text-sm py-2.5 transition-colors"
              >
                Weigeren
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
