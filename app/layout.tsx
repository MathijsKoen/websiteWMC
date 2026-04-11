import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
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
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const revalidate = 1

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tracks = await getAllTracks()

  return (
    <html lang="nl" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-body antialiased">
        <Header tracks={tracks.map((track) => ({ slug: track.slug, name: track.name }))} />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
