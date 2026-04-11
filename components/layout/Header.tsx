'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'

type TrackNavItem = {
  slug: string
  name: string
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/over-ons', label: 'Over ons' },
  { href: '/agenda', label: 'Agenda' },
]

const featuredLink = { href: '/beurs-2026', label: 'Beurs 2026' }
const moreLinks = [
  { href: '/nieuws', label: 'Nieuws' },
  { href: '/sponsoren', label: 'Sponsoren' },
  { href: '/contact', label: 'Contact' },
]

interface HeaderProps {
  tracks: TrackNavItem[]
}

export function Header({ tracks }: HeaderProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [desktopDropdown, setDesktopDropdown] = useState<'tracks' | 'more' | null>(null)
  const [mobileDropdown, setMobileDropdown] = useState<'tracks' | 'more' | null>(null)

  useEffect(() => {
    setMenuOpen(false)
    setDesktopDropdown(null)
    setMobileDropdown(null)
  }, [pathname])

  const isTracksActive = pathname.startsWith('/onze-banen')
  const isMoreActive = moreLinks.some((link) => pathname === link.href || pathname.startsWith(link.href))

  function closeAllMenus() {
    setMenuOpen(false)
    setDesktopDropdown(null)
    setMobileDropdown(null)
  }

  function renderDesktopLink(href: string, label: string) {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

    return (
      <Link
        href={href}
        className={[
          'px-4 py-2 text-sm font-bold transition-colors duration-150',
          isActive
            ? 'text-[#cc0000] border-b-2 border-[#cc0000]'
            : 'text-[#4d4c4c] hover:text-[#cc0000]',
        ].join(' ')}
      >
        {label}
      </Link>
    )
  }

  function renderDropdownButton(
    label: string,
    isActive: boolean,
    isOpen: boolean,
    onToggle: () => void
  ) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className={[
          'inline-flex items-center gap-1 px-4 py-2 text-sm font-bold transition-colors duration-150',
          isActive || isOpen
            ? 'text-[#cc0000] border-b-2 border-[#cc0000]'
            : 'text-[#4d4c4c] hover:text-[#cc0000]',
        ].join(' ')}
        aria-expanded={isOpen}
      >
        {label}
        <ChevronDown size={14} className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
    )
  }

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
                      : 'text-[#4d4c4c] hover:text-[#cc0000]',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              )
            })}

            <div className="relative">
              {renderDropdownButton(
                'Onze Banen',
                isTracksActive,
                desktopDropdown === 'tracks',
                () => setDesktopDropdown(desktopDropdown === 'tracks' ? null : 'tracks')
              )}
              {desktopDropdown === 'tracks' && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#e2e2e2] shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#f1f1f1]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#926e69]">
                      Alle banen
                    </p>
                  </div>
                  <div className="max-h-[26rem] overflow-auto py-2">
                    <Link
                      href="/onze-banen"
                      onClick={closeAllMenus}
                      className="block px-4 py-2 text-sm font-bold text-[#1a1c1c] hover:bg-[#f9f9f9] hover:text-[#cc0000]"
                    >
                      Overzicht banen
                    </Link>
                    <div className="my-2 h-px bg-[#f1f1f1]" />
                    {tracks.map((track) => (
                      <Link
                        key={track.slug}
                        href={`/onze-banen/${track.slug}`}
                        onClick={closeAllMenus}
                        className={[
                          'block px-4 py-2 text-sm transition-colors',
                          pathname === `/onze-banen/${track.slug}`
                            ? 'bg-[#cc0000]/5 text-[#cc0000] font-bold'
                            : 'text-[#4d4c4c] hover:bg-[#f9f9f9] hover:text-[#1a1c1c]',
                        ].join(' ')}
                      >
                        {track.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              {renderDropdownButton(
                'Meer',
                isMoreActive,
                desktopDropdown === 'more',
                () => setDesktopDropdown(desktopDropdown === 'more' ? null : 'more')
              )}
              {desktopDropdown === 'more' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#e2e2e2] shadow-lg overflow-hidden">
                  <div className="py-2">
                    {moreLinks.map((link) => {
                      const isActive = pathname === link.href || pathname.startsWith(link.href)
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeAllMenus}
                          className={[
                            'block px-4 py-2 text-sm transition-colors',
                            isActive
                              ? 'bg-[#cc0000]/5 text-[#cc0000] font-bold'
                              : 'text-[#4d4c4c] hover:bg-[#f9f9f9] hover:text-[#1a1c1c]',
                          ].join(' ')}
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Member Portal + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href={featuredLink.href}
              className={[
                'hidden md:inline-flex items-center gap-2 text-sm font-bold px-4 py-2 transition-colors duration-150 border',
                pathname.startsWith(featuredLink.href)
                  ? 'bg-[#cc0000] text-white border-[#cc0000]'
                  : 'text-[#cc0000] border-[#cc0000] hover:bg-[#cc0000] hover:text-white',
              ].join(' ')}
            >
              {featuredLink.label}
            </Link>
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
                  onClick={closeAllMenus}
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

            <div className="mt-2 border border-[#e8e8e8] bg-[#f9f9f9]">
              <button
                type="button"
                onClick={() => setMobileDropdown(mobileDropdown === 'tracks' ? null : 'tracks')}
                className={[
                  'w-full flex items-center justify-between px-4 py-3 text-base font-bold border-l-4 transition-colors duration-150',
                  isTracksActive || mobileDropdown === 'tracks'
                    ? 'text-[#cc0000] border-[#cc0000] bg-white'
                    : 'text-[#4d4c4c] border-transparent hover:text-[#1a1c1c]',
                ].join(' ')}
                aria-expanded={mobileDropdown === 'tracks'}
              >
                Onze Banen
                <ChevronDown
                  size={16}
                  className={mobileDropdown === 'tracks' ? 'rotate-180 transition-transform' : 'transition-transform'}
                />
              </button>
              {mobileDropdown === 'tracks' && (
                <div className="border-t border-[#e8e8e8] bg-white">
                  <Link
                    href="/onze-banen"
                    onClick={closeAllMenus}
                    className="block px-4 py-3 pl-7 text-sm font-bold text-[#1a1c1c] hover:bg-[#f9f9f9]"
                  >
                    Overzicht banen
                  </Link>
                  {tracks.map((track) => (
                    <Link
                      key={track.slug}
                      href={`/onze-banen/${track.slug}`}
                      onClick={closeAllMenus}
                      className={[
                        'block px-4 py-3 pl-7 text-sm transition-colors',
                        pathname === `/onze-banen/${track.slug}`
                          ? 'bg-[#cc0000]/5 text-[#cc0000] font-bold'
                          : 'text-[#4d4c4c] hover:bg-[#f9f9f9] hover:text-[#1a1c1c]',
                      ].join(' ')}
                    >
                      {track.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-2 border border-[#e8e8e8] bg-[#f9f9f9]">
              <button
                type="button"
                onClick={() => setMobileDropdown(mobileDropdown === 'more' ? null : 'more')}
                className={[
                  'w-full flex items-center justify-between px-4 py-3 text-base font-bold border-l-4 transition-colors duration-150',
                  isMoreActive || mobileDropdown === 'more'
                    ? 'text-[#cc0000] border-[#cc0000] bg-white'
                    : 'text-[#4d4c4c] border-transparent hover:text-[#1a1c1c]',
                ].join(' ')}
                aria-expanded={mobileDropdown === 'more'}
              >
                Meer
                <ChevronDown
                  size={16}
                  className={mobileDropdown === 'more' ? 'rotate-180 transition-transform' : 'transition-transform'}
                />
              </button>
              {mobileDropdown === 'more' && (
                <div className="border-t border-[#e8e8e8] bg-white">
                  {moreLinks.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(link.href)
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeAllMenus}
                        className={[
                          'block px-4 py-3 pl-7 text-sm transition-colors',
                          isActive
                            ? 'bg-[#cc0000]/5 text-[#cc0000] font-bold'
                            : 'text-[#4d4c4c] hover:bg-[#f9f9f9] hover:text-[#1a1c1c]',
                        ].join(' ')}
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            <Link
              href={featuredLink.href}
              onClick={closeAllMenus}
              className={[
                'px-4 py-3 text-base font-bold border-l-4 transition-colors duration-150',
                pathname.startsWith(featuredLink.href)
                  ? 'text-[#cc0000] border-[#cc0000] bg-[#cc0000]/5'
                  : 'text-[#cc0000] border-[#cc0000]/40 hover:border-[#cc0000] hover:bg-[#cc0000]/5',
              ].join(' ')}
            >
              {featuredLink.label}
            </Link>
            <Link
              href="/leden"
              onClick={closeAllMenus}
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
