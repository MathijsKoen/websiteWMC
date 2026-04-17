import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BeursPopup } from '@/components/ui/BeursPopup'
import { getAllTracks } from '@/lib/contentful/queries'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'De WMC — Westfriese Modelspoor Club',
    template: '%s | De WMC',
  },
  description:
    'De Westfriese Modelspoor Club (WMC) is opgericht in 1998 in Hoorn. Wij zijn een actieve modelspoorvereniging met leden die werken aan N-banen, H0-banen, en 0-schaal modellen.',
  keywords: ['modelspoor', 'modeltrein', 'WMC', 'Westfries', 'Noord-Scharwoude', 'Hoorn', 'club', 'N-baan', 'H0-baan'],
  authors: [{ name: 'De Westfriese Modelspoor Club' }],
  creator: 'De WMC',
  metadataBase: new URL('https://dewmc.nl'),
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://dewmc.nl',
    siteName: 'De WMC',
    title: 'De WMC — Westfriese Modelspoor Club',
    description:
      'Actieve modelspoorvereniging opgericht in 1998. Leden werken elke vrijdagavond aan N-banen, H0-banen en 0-schaal modellen in Noord-Scharwoude.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'De WMC — Westfriese Modelspoor Club' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const revalidate = 60

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tracks = await getAllTracks()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsClub',
    name: 'De Westfriese Modelspoor Club',
    alternateName: 'De WMC',
    url: 'https://dewmc.nl',
    email: 'info@dewmc.nl',
    foundingDate: '1998',
    description:
      'De Westfriese Modelspoor Club (WMC) is opgericht in 1998 in Hoorn. Actieve modelspoorvereniging met leden die werken aan N-banen, H0-banen en 0-schaal modellen.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'De Mossel 23e',
      postalCode: '1723 HX',
      addressLocality: 'Noord-Scharwoude',
      addressRegion: 'Noord-Holland',
      addressCountry: 'NL',
    },
    logo: 'https://dewmc.nl/logo-wmc.png',
  }

  return (
    <html lang="nl" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-body antialiased">
        {/* Skip-to-main voor toetsenbordgebruikers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-white focus:text-[#cc0000] focus:font-bold focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:outline-none"
        >
          Ga naar inhoud
        </a>
        <Header tracks={tracks.map((track) => ({ slug: track.slug, name: track.name }))} />
        <main id="main-content" className="flex-1 pt-20">{children}</main>
        <Footer />
        <BeursPopup />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
