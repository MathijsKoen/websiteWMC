'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ContentfulImage } from '@/lib/contentful/types'

interface PhotoGalleryProps {
  photos: ContentfulImage[]
  /** Gebruikt als alt-tekst wanneer een foto geen titel of beschrijving heeft. */
  fallbackAlt: string
}

/** Beschrijving van de foto in Contentful gaat voor; anders de titel. */
function altText(photo: ContentfulImage, index: number, fallbackAlt: string) {
  return (
    photo.fields.description?.trim() ||
    photo.fields.title?.trim() ||
    `${fallbackAlt} — foto ${index + 1}`
  )
}

export function PhotoGallery({ photos, fallbackAlt }: PhotoGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastOpenedRef = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)

  const isOpen = openIndex !== null
  const count = photos.length

  const close = useCallback(() => setOpenIndex(null), [])
  const show = useCallback(
    (delta: number) => setOpenIndex((i) => (i === null ? i : (i + delta + count) % count)),
    [count]
  )

  // Toetsenbord: Escape sluit, pijltjes bladeren, Tab blijft binnen de lightbox
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') show(-1)
      else if (e.key === 'ArrowRight') show(1)
      else if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button')
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, close, show])

  // Vergrendel scrollen en zet de focus in de lightbox; bij sluiten terug op de foto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      closeRef.current?.focus()
    } else {
      document.body.style.overflow = ''
      if (lastOpenedRef.current !== null) thumbRefs.current[lastOpenedRef.current]?.focus()
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function open(index: number) {
    lastOpenedRef.current = index
    setOpenIndex(index)
  }

  const current = openIndex !== null ? photos[openIndex] : null

  return (
    <>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {photos.map((photo, i) => (
          <li key={`${photo.fields.file.url}-${i}`}>
            <button
              type="button"
              ref={(el) => { thumbRefs.current[i] = el }}
              onClick={() => open(i)}
              className="group relative block w-full aspect-[4/3] overflow-hidden bg-[#e2e2e2] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#cc0000]"
              aria-label={`Vergroot foto ${i + 1} van ${count}: ${altText(photo, i, fallbackAlt)}`}
            >
              <Image
                src={`https:${photo.fields.file.url}?w=800&fm=webp&q=75`}
                alt={altText(photo, i, fallbackAlt)}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Rood accent bij hover */}
              <div className="absolute inset-0 border-2 border-[#cc0000] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </button>
          </li>
        ))}
      </ul>

      {/* ── Lightbox via portal (opent pas na een klik, dus altijd in de browser) ── */}
      {current && openIndex !== null && createPortal(
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${openIndex + 1} van ${count}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-[#1a1c1c]/95 flex flex-col"
          onClick={close}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return
            const dx = e.changedTouches[0].clientX - touchStartX.current
            if (Math.abs(dx) > 50) show(dx < 0 ? 1 : -1)
            touchStartX.current = null
          }}
        >
          {/* Bovenbalk */}
          <div className="flex items-center justify-between px-4 md:px-8 h-16 shrink-0 text-white">
            <p className="text-sm font-bold tabular-nums" aria-live="polite">
              {openIndex + 1} / {count}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Sluiten"
              className="w-10 h-10 flex items-center justify-center hover:bg-[#cc0000] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={22} />
            </button>
          </div>

          {/* Foto */}
          <div className="relative flex-1 mx-4 md:mx-20">
            <Image
              key={current.fields.file.url}
              src={`https:${current.fields.file.url}?w=2000&fm=webp&q=85`}
              alt={altText(current, openIndex, fallbackAlt)}
              fill
              sizes="100vw"
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Bijschrift */}
          <div className="min-h-16 shrink-0 px-4 md:px-8 py-4 text-center">
            {current.fields.description && (
              <p className="text-sm text-white/80 max-w-3xl mx-auto">{current.fields.description}</p>
            )}
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); show(-1) }}
                aria-label="Vorige foto"
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/40 text-white hover:bg-[#cc0000] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); show(1) }}
                aria-label="Volgende foto"
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-black/40 text-white hover:bg-[#cc0000] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </motion.div>,
        document.body
      )}
    </>
  )
}
