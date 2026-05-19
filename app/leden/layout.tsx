import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Ledenportaal',
  description: 'Toegang voor leden van De Westfriese Modelspoor Club. Bekijk aankondigingen, documenten en clubinformatie.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LedenLayout({ children }: { children: ReactNode }) {
  return children
}
