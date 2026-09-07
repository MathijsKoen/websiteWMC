import type { Metadata } from 'next'
import { Mail, MapPin, Clock, ExternalLink } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { getSiteSettings } from '@/lib/contentful/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Neem contact op met De Westfriese Modelspoor Club. Stuur een e-mail of kom langs op onze vrijdagavond in Noord-Scharwoude.',
}

export default async function ContactPage() {
  const s = await getSiteSettings()

  return (
    <>
      <PageHero
        eyebrow="We horen graag van je"
        title="Contact"
        lead={`Heb je vragen over de club, het lidmaatschap of wil je een keer langskomen? Stuur ons een bericht of kom gewoon een ${s.openingsDag.toLowerCase()} langs.`}
      />

      {/* Contact info */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Left: Contact details */}
            <div>
              <h2 className="font-black text-3xl tracking-tighter mb-8 text-[#1a1c1c]">
                Contactgegevens
              </h2>

              <div className="flex flex-col gap-6">
                {/* Email */}
                <div className="bg-white border-l-4 border-[#cc0000] p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#cc0000] flex items-center justify-center text-white shrink-0">
                      <Mail size={16} />
                    </div>
                    <span className="font-headline font-black text-sm uppercase tracking-widest text-[#1a1c1c]">
                      E-mail
                    </span>
                  </div>
                  <a
                    href={`mailto:${s.email}`}
                    className="text-[#cc0000] font-bold hover:text-[#9e0000] transition-colors flex items-center gap-1"
                  >
                    {s.email}
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
                    <span className="font-headline font-black text-sm uppercase tracking-widest text-[#1a1c1c]">
                      Locatie
                    </span>
                  </div>
                  <address className="not-italic text-[#4d4c4c] font-bold">
                    {s.adres}<br />
                    {s.postcode} {s.stad}<br />
                    {s.provincie}
                  </address>
                </div>

                {/* Opening hours */}
                <div className="bg-white border-l-4 border-[#e2e2e2] p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#e8e8e8] flex items-center justify-center text-[#4d4c4c] shrink-0">
                      <Clock size={16} />
                    </div>
                    <span className="font-headline font-black text-sm uppercase tracking-widest text-[#1a1c1c]">
                      Openingstijden
                    </span>
                  </div>
                  <p className="text-[#4d4c4c]">
                    <strong>{s.openingsDag}</strong><br />
                    {s.openingsTijd}
                  </p>
                  <p className="text-xs text-[#926e69] mt-2">
                    Kom gerust langs — een rondleiding is altijd mogelijk!
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Member info */}
            <div>
              <h2 className="font-black text-3xl tracking-tighter mb-8 text-[#1a1c1c]">
                Lid worden
              </h2>

              <div className="bg-[#cc0000] text-white p-8 mb-6">
                <h3 className="font-black text-xl tracking-tight mb-4">
                  Hoe werkt het?
                </h3>
                <ol className="space-y-4">
                  {s.lidWordenStappen.map((stap, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="font-headline w-6 h-6 bg-white/20 text-white text-xs font-black flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-white/90 text-sm leading-relaxed">{stap}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Contributie */}
              <div className="bg-white border border-[#e2e2e2] p-6">
                <h3 className="font-black text-sm uppercase tracking-widest text-[#1a1c1c] mb-4">
                  Contributie {s.contributieJaar}
                </h3>
                <div className="font-headline text-4xl font-black text-[#cc0000] tracking-tighter">
                  € {s.contributie},—
                </div>
                <p className="text-xs text-[#926e69] mt-2">
                  Jeugdleden: € 75,—
                </p>
                <p className="text-xs text-[#926e69] mt-1">
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
