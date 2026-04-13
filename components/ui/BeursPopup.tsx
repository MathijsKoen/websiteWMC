'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Train, ArrowRight, MapPin, Calendar, FileText, Download } from 'lucide-react'

const SESSION_KEY = 'wmc_beurs2026_popup_shown'

export function BeursPopup() {
  const [visible, setVisible] = useState(false)
  const [folderOpen, setFolderOpen] = useState(false)
  const [side, setSide] = useState<'voor' | 'achter'>('voor')

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY)
    if (!alreadyShown) {
      const t = setTimeout(() => setVisible(true), 700)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, '1')
    setVisible(false)
    setFolderOpen(false)
  }

  function openFolder() {
    setSide('voor')
    setFolderOpen(true)
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
            <AnimatePresence mode="wait">
              {!folderOpen ? (
                /* ── Info-kaart ─────────────────────────────────── */
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-full max-w-lg pointer-events-auto overflow-hidden bg-[#1a1c1c] shadow-2xl"
                >
                  {/* Decoratie */}
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-[#cc0000]/15 skew-x-[-12deg] translate-x-1/4 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-0.5 h-3/4 bg-[#cc0000] pointer-events-none" />

                  {/* Sluitknop — z-20 zodat hij boven de content div uitkomt */}
                  <button
                    onClick={dismiss}
                    className="absolute top-4 right-4 z-20 p-1.5 text-white/40 hover:text-white transition-colors"
                    aria-label="Popup sluiten"
                  >
                    <X size={20} />
                  </button>

                  <div className="relative z-10 p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-6 h-0.5 bg-[#cc0000]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#cc0000]">
                        Westfriese Modelspoor Club
                      </span>
                    </div>

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

                    <div className="flex flex-col gap-3 mb-8">
                      {[
                        { icon: Calendar, text: '17 & 18 oktober 2026' },
                        { icon: MapPin,   text: 'Heerhugowaard, sporthal "De Waardergolf" ' },
                        { icon: Train,    text: 'Banen van clubs uit heel Nederland' },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#cc0000]/20 flex items-center justify-center shrink-0">
                            <Icon size={14} className="text-[#cc0000]" />
                          </div>
                          <span className="text-sm text-white/70 font-medium">{text}</span>
                        </div>
                      ))}
                    </div>

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
                        onClick={openFolder}
                        className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-bold text-white/60 hover:text-white transition-colors py-3.5 border border-white/10 hover:border-white/20"
                      >
                        <FileText size={15} />
                        Bekijk folder
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* ── Folder lightbox ────────────────────────────── */
                <motion.div
                  key="folder"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-full max-w-2xl pointer-events-auto bg-[#1a1c1c] shadow-2xl flex flex-col"
                  style={{ maxHeight: '90vh' }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-2">
                      {/* Terug */}
                      <button
                        onClick={() => setFolderOpen(false)}
                        className="text-white/40 hover:text-white transition-colors text-xs font-bold mr-2"
                      >
                        ← Terug
                      </button>
                      {/* Tabs */}
                      {(['voor', 'achter'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setSide(s)}
                          className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-colors ${
                            side === s ? 'bg-[#cc0000] text-white' : 'text-white/40 hover:text-white'
                          }`}
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                          {s === 'voor' ? 'Voorkant' : 'Achterkant'}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={side === 'voor'
                          ? '/PRINT_VOOR_WMC_Flyer_100_.pdf'
                          : '/PRINT_ACHTER_WMC_Flyer_100_.pdf'}
                        download
                        className="flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white transition-colors"
                      >
                        <Download size={14} />
                        Download
                      </a>
                      <button
                        onClick={dismiss}
                        className="p-1 text-white/40 hover:text-white transition-colors"
                        aria-label="Sluiten"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  {/* PDF */}
                  <div className="flex-1 overflow-hidden">
                    <iframe
                      key={side}
                      src={
                        side === 'voor'
                          ? '/PRINT_VOOR_WMC_Flyer_100_.pdf#toolbar=0&navpanes=0'
                          : '/PRINT_ACHTER_WMC_Flyer_100_.pdf#toolbar=0&navpanes=0'
                      }
                      className="w-full border-0"
                      style={{ height: '75vh' }}
                      title={`WMC Beurs 2026 folder ${side}kant`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
