'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExternalLink, Link2 } from 'lucide-react'

interface LinkCardProps {
  url: string
  label: string
  description?: string
  siteName: string
  /** Afbeelding uit Contentful (geoptimaliseerd) of van de externe site (rechtstreeks geladen). */
  image?: { src: string; external: boolean }
}

/** Kaartje met voorbeeldweergave van een externe link, zoals WhatsApp dat toont. */
export function LinkCard({ url, label, description, siteName, image }: LinkCardProps) {
  // Externe sites kunnen het laden van hun afbeelding weigeren; val dan terug op het icoon
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = image && !imageFailed

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col h-full overflow-hidden border border-[#e2e2e2] bg-[#f9f9f9] hover:border-[#cc0000] transition-colors"
    >
      {showImage ? (
        <div className="relative w-full aspect-[1.91/1] bg-[#e2e2e2] overflow-hidden">
          <Image
            src={image.src}
            alt=""
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            // Externe afbeeldingen gaan niet door de Netlify-beeldoptimalisatie (zie lib/linkPreview.ts)
            unoptimized={image.external}
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-full aspect-[1.91/1] bg-[#1a1c1c] flex items-center justify-center">
          <div className="w-12 h-12 bg-[#cc0000] flex items-center justify-center">
            <Link2 size={22} className="text-white" />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5 p-6 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#926e69] truncate">{siteName}</p>
        <p className="font-headline font-black text-lg text-[#1a1c1c] group-hover:text-[#cc0000] transition-colors leading-tight">
          {label}
          <ExternalLink size={14} className="inline-block ml-2 -mt-0.5 shrink-0" aria-hidden="true" />
          <span className="sr-only"> (opent in een nieuw tabblad)</span>
        </p>
        {description && (
          <p className="text-sm text-[#4d4c4c] leading-relaxed line-clamp-3">{description}</p>
        )}
      </div>
    </a>
  )
}
