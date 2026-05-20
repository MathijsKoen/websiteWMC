'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const GA_ID = 'G-CP8W9JKLPF'

function updateConsent(granted: boolean) {
  window.gtag?.('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  })
}

export function GoogleAnalytics() {
  useEffect(() => {
    const stored = localStorage.getItem('cookieConsent')
    if (stored) updateConsent(stored === 'accepted')

    const handler = (e: Event) => {
      updateConsent((e as CustomEvent<string>).detail === 'accepted')
    }
    window.addEventListener('cookieConsentChange', handler)
    return () => window.removeEventListener('cookieConsentChange', handler)
  }, [])

  return (
    <>
      {/* Consent Mode v2: tag altijd aanwezig, tracking standaard geweigerd */}
      <Script id="google-analytics-consent" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            wait_for_update: 500
          });
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  )
}
