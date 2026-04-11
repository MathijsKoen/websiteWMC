'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/over-ons', label: 'Over ons' },
  { href: '/onze-banen', label: 'Onze Banen' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/nieuws', label: 'Nieuws' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2e2e2]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo-wmc.png"
              alt="De WMC — Westfriese Modelspoor Club"
              width={160}
              height={56}
              className="h-14 w-auto object-contain transition-opacity group-hover:opacity-70"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Hoofdnavigatie">
            {navLinks.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'px-4 py-2 text-sm font-bold transition-colors duration-150',
                    isActive
                      ? 'text-[#cc0000] border-b-2 border-[#cc0000]'
                      : 'text-[#4d4c4c] hover:text-[#1a1c1c]',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Member Portal + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/leden"
              className="hidden md:inline-flex items-center gap-2 bg-[#9e0000] text-white text-sm font-bold px-6 py-2 hover:bg-[#cc0000] transition-colors duration-200 skew-15"
            >
              <span className="skew-15-reverse">Ledenportaal</span>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-[#4d4c4c] hover:text-[#1a1c1c] transition-colors"
              aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#e2e2e2]">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1" aria-label="Mobiele navigatie">
            {navLinks.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={[
                    'px-4 py-3 text-base font-bold border-l-4 transition-colors duration-150',
                    isActive
                      ? 'text-[#cc0000] border-[#cc0000] bg-[#cc0000]/5'
                      : 'text-[#4d4c4c] border-transparent hover:border-[#e8e8e8] hover:text-[#1a1c1c]',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/leden"
              onClick={() => setMenuOpen(false)}
              className="mt-4 text-center bg-[#9e0000] text-white font-bold px-6 py-3 hover:bg-[#cc0000] transition-colors"
            >
              Ledenportaal
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
