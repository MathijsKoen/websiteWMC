'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [analytics, setAnalytics] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cookieConsent')
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function respond(choice: 'accepted' | 'rejected') {
    const consent = {
      necessary: true,
      analytics: choice === 'accepted' || analytics,
    }
    localStorage.setItem('cookieConsent', JSON.stringify(consent))
    window.dispatchEvent(new CustomEvent('cookieConsentChange', { detail: consent }))
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
          aria-label="Cookievoorkeuren"
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

            <p className="font-headline text-white font-bold text-base mb-1 leading-snug">
              Jouw privacy is belangrijk
            </p>
            <p className="text-white/50 text-[13px] leading-relaxed mb-5">
              We gebruiken noodzakelijke cookies om deze website goed te laten werken.
              Met jouw toestemming gebruiken we daarnaast cookies om anoniem gegevens te verzamelen 
              over de bezoekers van onze website om deze te verbeteren.{' '}
              <Link href="/privacy" className="text-[#cc0000] hover:underline">
                Lees meer in ons privacybeleid
              </Link>
            </p>

            <div className="space-y-3 mb-4 border-y border-white/10 py-3 text-[13px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-white">Noodzakelijke cookies</p>
                  <p className="text-white/50">Altijd actief voor de basisfuncties.</p>
                </div>
                <span className="shrink-0 text-white/40 text-xs pt-1">Altijd aan</span>
              </div>
              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <span>
                  <span className="block font-bold text-white">Analytische cookies</span>
                  <span className="text-white/50">Helpen ons bezoekersaantallen anoniem te begrijpen.</span>
                </span>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(event) => setAnalytics(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#cc0000]"
                />
              </label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <button
                onClick={() => respond('rejected')}
                className="flex-1 border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-bold text-sm py-2.5 transition-colors"
              >
                Alleen noodzakelijk
              </button>
              <button
                onClick={() => respond('accepted')}
                className="font-headline flex-1 bg-[#cc0000] hover:bg-[#9e0000] text-white font-black text-sm py-2.5 transition-colors"
              >
                Alles accepteren
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
