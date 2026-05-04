import type { Metadata } from 'next'
import { ArrowRight, Users, Calendar, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TimelineReveal } from '@/components/ui/TimelineReveal'
import { getSiteSettings } from '@/lib/contentful/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Over ons',
  description:
    'Leer meer over De Westfriese Modelspoor Club (WMC), opgericht in 1998 in Hoorn. Onze doelstellingen, clubgebouw en lidmaatschap.',
}

export default async function OverOnsPage() {
  const s = await getSiteSettings()

  return (
    <>
      {/* Page Hero */}
      <section className="bg-[#1a1c1c] text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-[#cc0000]/10 skew-x-[-15deg] translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#cc0000]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
              Opgericht 1 maart 1998
            </span>
          </div>
          <h1
            className="font-black text-5xl md:text-6xl tracking-tighter mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Over de WMC
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            {s.overOnsIntro}
          </p>
        </div>
      </section>

      {/* Geschiedenis */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-0.5 bg-[#cc0000]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                  Onze geschiedenis
                </span>
              </div>
              <h2
                className="font-black text-4xl tracking-tighter mb-6 text-[#1a1c1c]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Een rijke geschiedenis
                <br />in modeltreinen
              </h2>
              <div className="space-y-4 text-[#4d4c4c] leading-relaxed">
                {s.geschiedenisAlineas.map((alinea, i) => (
                  <p key={i}>{alinea}</p>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <TimelineReveal items={s.tijdlijn} />
          </div>
        </div>
      </section>

      {/* Doelstellingen */}
      <section className="bg-[#f3f3f3] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#cc0000]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
              Wat wij nastreven
            </span>
          </div>
          <h2
            className="font-black text-4xl tracking-tighter mb-12 text-[#1a1c1c]"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Doelstellingen
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#e2e2e2]">
            {s.doelstellingen.map((doel, i) => (
              <div key={i} className="bg-white p-6 flex items-start gap-4">
                <div className="w-8 h-8 bg-[#cc0000] text-white flex items-center justify-center font-black text-sm shrink-0"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {i + 1}
                </div>
                <p className="text-[#4d4c4c] leading-relaxed">{doel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clubgebouw & Info */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e2e2e2]">
            {[
              {
                icon: <Building2 size={20} />,
                title: 'Clubgebouw',
                content: (
                  <>
                    <p className="text-[#4d4c4c] text-sm leading-relaxed">
                      Ons clubgebouw staat in {s.stad}:
                    </p>
                    <address className="not-italic text-sm text-[#1a1c1c] font-bold mt-2">
                      {s.adres}<br />
                      {s.postcode} {s.stad}
                    </address>
                  </>
                ),
              },
              {
                icon: <Calendar size={20} />,
                title: 'Openingstijden',
                content: (
                  <>
                    <p className="text-[#4d4c4c] text-sm leading-relaxed">
                      We zijn wekelijks open op:
                    </p>
                    <p className="text-sm text-[#1a1c1c] font-bold mt-2">
                      {s.openingsDag}<br />
                      {s.openingsTijd}
                    </p>
                  </>
                ),
              },
              {
                icon: <Users size={20} />,
                title: 'Lidmaatschap',
                content: (
                  <>
                    <p className="text-[#4d4c4c] text-sm leading-relaxed">
                      Jaarlijkse contributie {s.contributieJaar}:
                    </p>
                    <p className="text-2xl font-black text-[#cc0000] mt-2"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      € {s.contributie},—
                    </p>
                    <p className="text-xs text-[#926e69] mt-1">Jeugdleden: € 75,—</p>
                    <p className="text-xs text-[#926e69] mt-1">Inclusief rondleiding</p>
                  </>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#cc0000] text-white flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <h3
                    className="font-black text-sm uppercase tracking-widest text-[#1a1c1c]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {item.title}
                  </h3>
                </div>
                {item.content}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lid worden CTA */}
      <section className="bg-[#f9f9f9] py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-3xl tracking-tighter mb-4 text-[#1a1c1c]"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Interesse om lid te worden?
          </h2>
          <p className="text-[#4d4c4c] mb-8 max-w-lg mx-auto">
            Stuur ons een e-mail of kom een {s.openingsDag.toLowerCase()} langs voor een gratis rondleiding
            door het clubgebouw.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/contact" size="lg" skewed>
              <span>Contact opnemen</span>
              <ArrowRight size={18} />
            </Button>
            <Button href={`mailto:${s.email}`} variant="secondary" size="lg">
              {s.email}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
