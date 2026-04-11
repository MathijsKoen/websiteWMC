import type { Metadata } from 'next'
import { Mail, MapPin, Clock, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Neem contact op met De Westfriese Modelspoor Club. Stuur een e-mail of kom langs op onze vrijdagavond in Noord-Scharwoude.',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#1a1c1c] text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-[#cc0000]/10 skew-x-[-15deg] translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#cc0000]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
              We horen graag van je
            </span>
          </div>
          <h1
            className="font-black text-5xl md:text-6xl tracking-tighter mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Contact
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Heb je vragen over de club, het lidmaatschap of wil je een keer langs komen?
            Stuur ons een bericht of kom gewoon een vrijdagavond langs.
          </p>
        </div>
      </section>

      {/* Contact info */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Left: Contact details */}
            <div>
              <h2
                className="font-black text-3xl tracking-tighter mb-8 text-[#1a1c1c]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Contactgegevens
              </h2>

              <div className="flex flex-col gap-6">
                {/* Email */}
                <div className="bg-white border-l-4 border-[#cc0000] p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#cc0000] flex items-center justify-center text-white shrink-0">
                      <Mail size={16} />
                    </div>
                    <span
                      className="font-black text-sm uppercase tracking-widest text-[#1a1c1c]"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      E-mail
                    </span>
                  </div>
                  <a
                    href="mailto:info@dewmc.nl"
                    className="text-[#cc0000] font-bold hover:text-[#9e0000] transition-colors flex items-center gap-1"
                  >
                    info@dewmc.nl
                    <ExternalLink size={14} />
                  </a>
                  <p className="text-xs text-[#926e69] mt-1">
                    Voor vragen over lidmaatschap, informatie of overig
                  </p>
                </div>

                {/* Address */}
                <div className="bg-white border-l-4 border-[#e2e2e2] p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#e8e8e8] flex items-center justify-center text-[#4d4c4c] shrink-0">
                      <MapPin size={16} />
                    </div>
                    <span
                      className="font-black text-sm uppercase tracking-widest text-[#1a1c1c]"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      Locatie
                    </span>
                  </div>
                  <address className="not-italic text-[#4d4c4c] font-bold">
                    De Mossel 23e<br />
                    1723 HX Noord-Scharwoude<br />
                    Noord-Holland
                  </address>
                </div>

                {/* Opening hours */}
                <div className="bg-white border-l-4 border-[#e2e2e2] p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#e8e8e8] flex items-center justify-center text-[#4d4c4c] shrink-0">
                      <Clock size={16} />
                    </div>
                    <span
                      className="font-black text-sm uppercase tracking-widest text-[#1a1c1c]"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      Openingstijden
                    </span>
                  </div>
                  <p className="text-[#4d4c4c]">
                    <strong>Vrijdagavond</strong><br />
                    19:30 – 22:00 uur
                  </p>
                  <p className="text-xs text-[#926e69] mt-2">
                    Kom gerust langs — een rondleiding is altijd mogelijk!
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Member info */}
            <div>
              <h2
                className="font-black text-3xl tracking-tighter mb-8 text-[#1a1c1c]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Lid worden
              </h2>

              <div className="bg-[#cc0000] text-white p-8 mb-6">
                <h3
                  className="font-black text-xl tracking-tight mb-4"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Hoe werkt het?
                </h3>
                <ol className="space-y-4">
                  {[
                    'Stuur een e-mail naar info@dewmc.nl',
                    'Ontvang een uitnodiging voor een rondleiding',
                    'Kom een vrijdagavond langs om kennis te maken',
                    'Sluit je aan bij een van onze zes groepen',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="w-6 h-6 bg-white/20 text-white text-xs font-black flex items-center justify-center shrink-0"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-white/90 text-sm leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Contributie */}
              <div className="bg-white border border-[#e2e2e2] p-6">
                <h3
                  className="font-black text-sm uppercase tracking-widest text-[#1a1c1c] mb-4"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Contributie 2025
                </h3>
                <div
                  className="text-4xl font-black text-[#cc0000] tracking-tighter"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  € 175,—
                </div>
                <p className="text-xs text-[#926e69] mt-2">
                  Jaarlijkse bijdrage. Inclusief toegang tot alle banen en activiteiten.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
