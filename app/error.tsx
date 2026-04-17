'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Geef foutmeldingen door aan een eventueel logging-systeem
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-0.5 bg-[#cc0000]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
            Er is iets misgegaan
          </span>
          <div className="w-8 h-0.5 bg-[#cc0000]" />
        </div>
        <h1
          className="font-black text-5xl tracking-tighter text-[#1a1c1c] mb-4"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Pagina kon niet laden
        </h1>
        <p className="text-[#4d4c4c] leading-relaxed mb-8">
          Er is een onverwachte fout opgetreden. Probeer de pagina opnieuw te laden of ga terug naar de homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} skewed>
            Opnieuw proberen
          </Button>
          <Button href="/" variant="secondary">
            Terug naar home
          </Button>
        </div>
      </div>
    </div>
  )
}
