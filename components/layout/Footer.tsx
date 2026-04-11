import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Clock } from 'lucide-react'

const footerLinks = {
  club: [
    { href: '/over-ons', label: 'Over ons' },
    { href: '/onze-banen', label: 'Onze Banen' },
    { href: '/agenda', label: 'Agenda' },
    { href: '/nieuws', label: 'Nieuws' },
  ],
  info: [
    { href: '/contact', label: 'Contact' },
    { href: '/leden', label: 'Ledenportaal' },
    { href: '/privacy', label: 'Privacybeleid' },
    { href: '/reglement', label: 'Reglement' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#1a1c1c] text-[#f1f1f1]">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex mb-6 group">
              <Image
                src="/logo-wmc.png"
                alt="De WMC — Westfriese Modelspoor Club"
                width={160}
                height={56}
                className="h-14 w-auto object-contain brightness-0 invert transition-opacity group-hover:opacity-70"
              />
            </Link>

            <p className="text-[#e8e8e8]/70 text-sm leading-relaxed max-w-sm mb-6">
              Opgericht op 1 maart 1998 in Hoorn. Wij bieden onderdak aan
              modelspoorhobbyisten van alle schalen en schermen onze modules op
              beurzen door heel Nederland.
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-3 text-sm text-[#e8e8e8]/60">
              <a
                href="mailto:info@dewmc.nl"
                className="flex items-center gap-2 hover:text-[#cc0000] transition-colors"
              >
                <Mail size={14} />
                info@dewmc.nl
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>De Mossel 23e, 1723 HX Noord-Scharwoude</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>Vrijdagavond 19:30 – 22:00 uur</span>
              </div>
            </div>
          </div>

          {/* Club links */}
          <div>
            <h3
              className="font-headline font-black text-sm uppercase tracking-widest text-[#cc0000] mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              De Club
            </h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.club.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#e8e8e8]/60 hover:text-white transition-colors border-b border-transparent hover:border-[#cc0000] pb-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <h3
              className="font-headline font-black text-sm uppercase tracking-widest text-[#cc0000] mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Informatie
            </h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#e8e8e8]/60 hover:text-white transition-colors border-b border-transparent hover:border-[#cc0000] pb-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#926e69] mb-3">
                Lid worden?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#cc0000] text-white text-sm font-bold px-5 py-2.5 hover:bg-[#9e0000] transition-colors"
              >
                <Mail size={14} />
                Neem contact op
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#e8e8e8]/40">
            © {new Date().getFullYear()} De Westfriese Modelspoor Club. Alle rechten voorbehouden.
          </p>
          <p className="text-xs text-[#e8e8e8]/30">
            Ingeschreven bij de Kamer van Koophandel
          </p>
        </div>
      </div>
    </footer>
  )
}
