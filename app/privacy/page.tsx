import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacyverklaring',
  description:
    'Privacyverklaring van De Westfriese Modelspoor Club (De WMC) over verwerking van persoonsgegevens via website, ledenportaal en declaratieproces.',
}

export default function PrivacyPage() {
  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <h1
          className="font-black text-4xl tracking-tighter text-[#1a1c1c] mb-4"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Privacyverklaring
        </h1>

        <p className="text-sm text-gray-500 mb-10">Versie: mei 2026</p>

        <div className="space-y-8 text-[15px] leading-7 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-3">1. Wie zijn wij?</h2>
            <p>
              De Westfriese Modelspoor Club (De WMC) is verantwoordelijk voor de verwerking van
              persoonsgegevens zoals beschreven in deze verklaring.
            </p>
            <p className="mt-3">
              Contact: info@dewmc.nl<br />
              Locatie clubgebouw: De Mossel 23e, 1723 HX Noord-Scharwoude
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-3">2. Welke gegevens verwerken wij?</h2>
            <p>Wij verwerken alleen gegevens die nodig zijn voor onze verenigingsactiviteiten.</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>Contactgegevens zoals naam, e-mailadres, telefoonnummer en adresgegevens.</li>
              <li>Lidmaatschapsgegevens en communicatie met leden of aspirant-leden.</li>
              <li>Declaratiegegevens: naam, e-mailadres, bedrag, kostenplaats, omschrijving en IBAN.</li>
              <li>Technische gegevens zoals inlog- en sessiegegevens voor het ledenportaal.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-3">3. Waarom verwerken wij gegevens?</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Voor ledenadministratie en communicatie binnen de vereniging.</li>
              <li>Voor behandeling van declaraties volgens het huishoudelijk regelement.</li>
              <li>Voor toegang tot het ledenportaal en beveiliging van accounts.</li>
              <li>Voor organisatie van activiteiten, werkgroepen en bestuurswerkzaamheden.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-3">4. Rechtsgronden (AVG)</h2>
            <p>Wij verwerken persoonsgegevens op basis van een of meer van de volgende AVG-grondslagen:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>Toestemming (bijvoorbeeld voor specifieke formulieren).</li>
              <li>Uitvoering van de overeenkomst (het lidmaatschap en verenigingsdiensten).</li>
              <li>Wettelijke verplichting (bijvoorbeeld fiscale bewaarplicht voor administratie).</li>
              <li>Gerechtvaardigd belang (interne organisatie, communicatie en beveiliging).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-3">5. Bewaartermijnen</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Gegevens worden niet langer bewaard dan nodig is voor het doel van verwerking.</li>
              <li>Administratieve gegevens (zoals declaraties) bewaren wij conform wettelijke termijnen.</li>
              <li>Inactieve account- en contactgegevens worden periodiek opgeschoond.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-3">6. Delen van gegevens met derden</h2>
            <p>
              Wij verkopen geen persoonsgegevens. Wij delen gegevens alleen wanneer dat nodig is voor
              onze dienstverlening of wettelijke verplichtingen.
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>Hosting en websiteplatform (Netlify).</li>
              <li>E-mailverzending voor declaraties en communicatie (Resend).</li>
              <li>Beveiliging tegen misbruik van formulieren (Google reCAPTCHA).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-3">7. Beveiliging</h2>
            <p>
              De WMC treft passende technische en organisatorische maatregelen om persoonsgegevens te
              beschermen tegen verlies, misbruik en onbevoegde toegang.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-3">8. Jouw rechten</h2>
            <p>Je hebt op grond van de AVG onder meer recht op:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>Inzage in je persoonsgegevens.</li>
              <li>Correctie van onjuiste gegevens.</li>
              <li>Verwijdering van gegevens (voor zover wettelijk mogelijk).</li>
              <li>Beperking van verwerking en bezwaar tegen verwerking.</li>
              <li>Overdraagbaarheid van gegevens (dataportabiliteit).</li>
            </ul>
            <p className="mt-3">Voor een verzoek kun je mailen naar info@dewmc.nl.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-3">9. Cookies en sessies</h2>
            <p>
              Voor het ledenportaal gebruiken wij functionele sessie- en beveiligingscookies die nodig
              zijn om inloggen en beveiligde toegang te laten werken.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1a1c1c] mb-3">10. Relatie met ons regelement</h2>
            <p>
              Deze privacyverklaring sluit aan op het huishoudelijk regelement van De WMC. Specifiek
              rondom ledenadministratie en digitale communicatie (artikel 2.6) en declaraties (artikel 6).
            </p>
            <p className="mt-3">
              Lees ook het volledige <Link href="/regelement" className="text-[#cc0000] hover:underline">regelement</Link>.
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
