import Link from 'next/link'
import type { Metadata } from 'next'
import { PageHero } from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Huishoudelijk Reglement',
  description:
    'Samenvatting van het huishoudelijk reglement (2021) van De Westfriese Modelspoor Club, met nadruk op ledenadministratie en declaraties.',
  alternates: {
    canonical: 'https://dewmc.nl/reglement',
  },
}

const artikelen = [
  {
    nummer: 'Artikel 1',
    titel: 'Algemene en omgangsregels',
    punten: [
      'Leden behandelen elkaar correct, ook bij meningsverschillen.',
      'Bij ernstige conflicten of schade aan club of imago kan het bestuur het lidmaatschap ontzeggen.',
      'Binnen werkgroepen geldt het meerderheidsstandpunt; de coördinator bewaakt dit.',
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
      'Aankopen door leden binnen werkgroepbudget verlopen met toestemming van de coördinator.',
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
      'Kascommissie en continuïteitscommissie worden jaarlijks aangesteld.',
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

export default function ReglementPage() {
  return (
    <>
      <PageHero
        eyebrow="Vastgesteld in 2021"
        title="Huishoudelijk Reglement"
        lead="Een leesbare samenvatting van het huishoudelijk reglement van De WMC. Bij twijfel of geschillen geldt altijd de formele, door de ALV vastgestelde tekst."
      />

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-16 md:py-20 space-y-10 text-[15px] leading-7 text-[#4d4c4c]">
          <div className="border-l-4 border-[#e2e2e2] bg-[#f9f9f9] p-5 text-sm leading-6">
            Voor privacy en gegevensverwerking, zie ook de{' '}
            <Link href="/privacy" className="text-[#cc0000] font-bold underline underline-offset-2 hover:text-[#9e0000] transition-colors">
              privacyverklaring
            </Link>
            .
          </div>

          {artikelen.map((artikel) => (
            <section key={artikel.nummer}>
              <h2 className="font-headline font-black text-2xl tracking-tight text-[#1a1c1c] mb-3 pl-4 border-l-4 border-[#cc0000]">
                {artikel.nummer} — {artikel.titel}
              </h2>
              <ul className="list-disc pl-6 space-y-1">
                {artikel.punten.map((punt) => (
                  <li key={punt}>{punt}</li>
                ))}
              </ul>
            </section>
          ))}

          <p className="text-sm text-[#926e69]">
            Bron: Huishoudelijk reglement De Westfriese Modelspoor Club, goedgekeurd in mei 2021.
          </p>
        </div>
      </section>
    </>
  )
}
