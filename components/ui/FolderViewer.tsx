'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react'

interface FolderViewerProps {
  /** Wordt getoond als trigger op de pagina */
  className?: string
}

export function FolderSection() {
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState<'voor' | 'achter'>('voor')

  return (
    <>
      {/* ── Sectie op de pagina ─────────────────────────────── */}
      <section className="bg-[#f3f3f3] py-20 border-t border-[#e2e2e2]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Tekst */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#cc0000]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                  Digitale folder
                </span>
              </div>
              <h2
                className="font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1c] mb-4"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Bekijk onze
                <br />beursfolder
              </h2>
              <p className="text-[#4d4c4c] leading-relaxed mb-8">
                Alles wat je moet weten over de WMC Beurs 2026 in één overzichtelijke folder.
                Sla hem op of druk hem af voor later.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#cc0000] hover:bg-[#9e0000] text-white font-black text-sm px-6 py-3.5 transition-colors"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Folder bekijken
                </button>
                <a
                  href="/PRINT_VOOR_WMC_Flyer_100_.pdf"
                  download
                  className="inline-flex items-center gap-2 border border-[#1a1c1c] text-[#1a1c1c] hover:bg-[#1a1c1c] hover:text-white font-bold text-sm px-6 py-3.5 transition-colors"
                >
                  <Download size={15} />
                  Downloaden
                </a>
              </div>
            </div>

            {/* Voorkant preview — klikbaar */}
            <button
              onClick={() => setOpen(true)}
              className="group relative w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto shadow-xl hover:shadow-2xl transition-shadow duration-300 focus:outline-none"
              aria-label="Folder vergroten"
            >
              <iframe
                src="/PRINT_VOOR_WMC_Flyer_100_.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
                className="w-full aspect-[3/4] pointer-events-none border-0"
                title="WMC Beurs 2026 folder voorkant"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#cc0000]/0 group-hover:bg-[#cc0000]/10 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#cc0000] text-white text-xs font-black uppercase tracking-widest px-4 py-2">
                  Vergroten
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ── Lightbox modal ──────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="lightbox"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="relative w-full max-w-2xl pointer-events-auto bg-[#1a1c1c] shadow-2xl flex flex-col"
                style={{ maxHeight: '90vh' }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
                  <div className="flex gap-1">
                    {(['voor', 'achter'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSide(s)}
                        className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-colors ${
                          side === s
                            ? 'bg-[#cc0000] text-white'
                            : 'text-white/40 hover:text-white'
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
                      onClick={() => setOpen(false)}
                      className="p-1 text-white/40 hover:text-white transition-colors"
                      aria-label="Sluiten"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* PDF embed */}
                <div className="flex-1 overflow-hidden">
                  <iframe
                    key={side}
                    src={
                      side === 'voor'
                        ? '/PRINT_VOOR_WMC_Flyer_100_.pdf#toolbar=0&navpanes=0'
                        : '/PRINT_ACHTER_WMC_Flyer_100_.pdf#toolbar=0&navpanes=0'
                    }
                    className="w-full h-full border-0"
                    style={{ minHeight: '60vh' }}
                    title={`WMC Beurs 2026 folder ${side}kant`}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
