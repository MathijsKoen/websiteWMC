'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { MapPin, Train, ExternalLink, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { BeursLayout } from '@/lib/contentful/types'

const DESCRIPTION_LIMIT = 120

export function LayoutCard({ layout }: { layout: BeursLayout }) {
  const [open, setOpen] = useState(false)

  const imageUrl = layout.coverImage?.fields.file.url
    ? `https:${layout.coverImage.fields.file.url}?w=800&h=500&fit=fill&f=center`
    : null

  const description = layout.description ?? ''
  const isTruncated = description.length > DESCRIPTION_LIMIT
  const truncated = isTruncated
    ? description.slice(0, DESCRIPTION_LIMIT).trimEnd() + '…'
    : description

  // Sluit popup met Escape-toets
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Vergrendel scrollen als popup open is
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* ── Kaart ─────────────────────────────────────────── */}
      <article className="bg-white group flex flex-col overflow-hidden border border-[#e2e2e2] hover:border-[#cc0000] transition-colors duration-200 h-full">
        <div className="relative w-full aspect-[16/9] bg-[#f3f3f3] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={layout.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Train size={40} className="text-[#e2e2e2]" />
            </div>
          )}
          {layout.scale && (
            <div className="absolute top-3 left-3">
              <span className="bg-[#cc0000] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                {layout.scale}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-6 flex-1">
          <div>
            <h2
              className="font-black text-xl tracking-tight text-[#1a1c1c] group-hover:text-[#cc0000] transition-colors leading-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {layout.name}
            </h2>
            <p className="text-sm text-[#926e69] mt-0.5 font-bold">{layout.club}</p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#926e69]">
            <MapPin size={12} className="shrink-0" />
            <span>{layout.city}</span>
          </div>

          {description && (
            <p className="text-sm text-[#4d4c4c] leading-relaxed mt-1">
              {truncated}
            </p>
          )}

          <div className="mt-auto pt-3 border-t border-[#e8e8e8] flex flex-wrap items-center gap-3">
            {isTruncated && (
              <button
                onClick={() => setOpen(true)}
                className="text-xs font-bold text-[#cc0000] hover:text-[#9e0000] transition-colors"
              >
                Lees meer →
              </button>
            )}
            {layout.website && (
              <a
                href={layout.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#926e69] hover:text-[#cc0000] transition-colors ml-auto"
              >
                Website
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </article>

      {/* ── Popup via portal (omzeilt CSS transform van TiltCard) ──── */}
      <AnimatePresence>
        {open && createPortal(
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-[100] cursor-pointer"
              onClick={() => setOpen(false)}
            />

            {/* Paneel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-6 pointer-events-none"
            >
              <div className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto pointer-events-auto shadow-2xl flex flex-col">
                {/* Afbeelding */}
                {imageUrl && (
                  <div className="relative w-full aspect-[16/9] bg-[#f3f3f3] shrink-0">
                    <Image
                      src={imageUrl}
                      alt={layout.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 512px"
                      className="object-cover"
                    />
                    {layout.scale && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#cc0000] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                          {layout.scale}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Inhoud */}
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3
                        className="font-black text-2xl tracking-tight text-[#1a1c1c] leading-tight"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {layout.name}
                      </h3>
                      <p className="text-sm text-[#926e69] font-bold mt-0.5">{layout.club}</p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      aria-label="Sluiten"
                      className="shrink-0 w-8 h-8 flex items-center justify-center text-[#4d4c4c] hover:text-[#cc0000] hover:bg-[#f3f3f3] transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#926e69]">
                    <MapPin size={12} className="shrink-0" />
                    <span>{layout.city}</span>
                  </div>

                  {description && (
                    <p className="text-sm text-[#4d4c4c] leading-relaxed">
                      {description}
                    </p>
                  )}

                  {layout.website && (
                    <a
                      href={layout.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto pt-4 border-t border-[#e8e8e8] inline-flex items-center gap-1.5 text-xs font-bold text-[#cc0000] hover:text-[#9e0000] transition-colors"
                    >
                      Website vereniging
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>,
          document.body
        )}
      </AnimatePresence>
    </>
  )
}
