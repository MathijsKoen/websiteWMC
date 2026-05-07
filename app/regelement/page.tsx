import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Huishoudelijk Regelement',
  description:
    'Samenvatting van het huishoudelijk regelement (2021) van De Westfriese Modelspoor Club, met nadruk op ledenadministratie en declaraties.',
}

const artikelen = [
  {
    nummer: 'Artikel 1',
    titel: 'Algemene en omgangsregels',
    punten: [
      'Leden behandelen elkaar correct, ook bij meningsverschillen.',
      'Bij ernstige conflicten of schade aan club of imago kan het bestuur het lidmaatschap ontzeggen.',
      'Binnen werkgroepen geldt het meerderheidsstandpunt; de coordinator bewaakt dit.',
    ],
  },
  {
    nummer: 'Artikel 2',
    titel: 'Lidmaatschap',
    punten: [
      'Nieuwe leden starten via digitaal informatieformulier en kennismaking met bestuur/werkgroep.',
      'Er geldt een proefperiode van maximaal drie maanden.',
      'Leden geven contactwijzigingen tijdig door; clubcorrespondentie verloopt in principe per e-mail.',
    ],
  },
  {
    nummer: 'Artikel 3',
    titel: 'Contributie',
    punten: [
      'Contributieverzoeken worden per e-mail verstuurd voorafgaand aan het nieuwe kalenderjaar.',
      'Bij niet tijdige betaling volgen herinnering en mogelijk schorsing.',
      'In bijzondere situaties kan in overleg met het bestuur een afspraak worden gemaakt.',
    ],
  },
  {
    nummer: 'Artikel 4',
    titel: 'Aanschafverzoeken',
    punten: [
      'Werkgroepen werken met jaarplan en begroting, vastgesteld door de ledenvergadering.',
      'Budgetoverschrijding of bijzondere aankopen vereisen toestemming van het bestuur via de secretaris.',
      'Aankopen door leden binnen werkgroepbudget verlopen met toestemming van de coordinator.',
    ],
  },
  {
    nummer: 'Artikel 5',
    titel: 'Rollend materiaal',
    punten: [
      'De club richt zich primair op materiaal voor de lay-out.',
      'Bij giften of overnames beslist het bestuur over toewijzing, verdeling of verkoop.',
    ],
  },
  {
    nummer: 'Artikel 6',
    titel: 'Declaratie',
    punten: [
      'Declaraties voor uitgaven binnen artikel 4 worden digitaal via de website ingediend.',
      'Originele aankoopnota wordt zo spoedig mogelijk in de daarvoor bestemde box gedeponeerd.',
      'Onkostendeclaraties worden alleen gehonoreerd bij opdrachten of functies vanuit het bestuur.',
    ],
  },
  {
    nummer: 'Artikel 7',
    titel: 'Bestuur medewerkers en commissies',
    punten: [
      'Bestuur kan leden formeel aanstellen voor taken; bestuur blijft eindverantwoordelijk.',
      'Kascommissie en continuiteitscommissie worden jaarlijks aangesteld.',
      'Bestuursleden zitten niet in deze commissies.',
    ],
  },
  {
    nummer: 'Artikel 8',
    titel: 'Donaties',
    punten: [
      'Bij ontvangen goederen beslist het bestuur over verdeling of verkoop.',
      'Belangstelling en verdeling verlopen volgens procedure via de secretaris.',
    ],
  },
]

export default function RegelementPage() {
  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <h1
          className="font-black text-4xl tracking-tighter text-[#1a1c1c] mb-4"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Huishoudelijk Regelement
        </h1>
        <p className="text-gray-600 leading-7">
          Deze pagina bevat een leesbare samenvatting van het huishoudelijk regelement van De WMC
          (vastgesteld in 2021). Bij twijfel of geschillen geldt altijd de formele, door de ALV
          vastgestelde tekst.
        </p>

        <div className="mt-8 rounded-lg border border-[#e5e5e5] bg-[#f7f7f7] p-5 text-sm text-gray-700 leading-6">
          Voor privacy en gegevensverwerking, zie ook de{' '}
          <Link href="/privacy" className="text-[#cc0000] hover:underline">
            privacyverklaring
          </Link>
          .
        </div>

        <div className="mt-10 space-y-6">
          {artikelen.map((artikel) => (
            <article key={artikel.nummer} className="border border-[#e5e5e5] rounded-xl overflow-hidden">
              <div className="bg-[#1a1c1c] px-5 py-4">
                <p className="text-xs tracking-widest uppercase text-white/70 mb-1">{artikel.nummer}</p>
                <h2 className="text-xl font-bold text-white">{artikel.titel}</h2>
              </div>
              <div className="bg-white px-5 py-5">
                <ul className="list-disc pl-5 space-y-2 text-[15px] leading-7 text-gray-700">
                  {artikel.punten.map((punt) => (
                    <li key={punt}>{punt}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-sm text-gray-500">
          Bron: Huishoudelijk regelement De Westfriese Modelspoor Club, goedgekeurd in mei 2021.
        </p>
      </div>
    </section>
  )
}
