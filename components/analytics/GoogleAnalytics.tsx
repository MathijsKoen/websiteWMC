'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

const GA_ID = 'G-CP8W9JKLPF'

export function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (consent === 'accepted') {
      setHasConsent(true)
    }

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail
      setHasConsent(detail === 'accepted')
    }
    window.addEventListener('cookieConsentChange', handler)
    return () => window.removeEventListener('cookieConsentChange', handler)
  }, [])

  if (!hasConsent) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
