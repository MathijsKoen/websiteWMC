import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Calendar, MapPin, Train, ArrowRight, Users, ExternalLink } from 'lucide-react'
import { getAllBeursLayouts } from '@/lib/contentful/queries'
import { Button } from '@/components/ui/Button'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal'
import { TiltCard } from '@/components/ui/TiltCard'
import { FolderSection } from '@/components/ui/FolderViewer'
import { LayoutCard } from '@/components/ui/LayoutCard'

export const metadata: Metadata = {
  title: 'WMC Beurs 2026 — Modelspoor Tentoonstelling',
  description:
    'Kom naar de WMC Modelspoor Beurs 2026 in Heerhugowaard. Bewonder spectaculaire banen van clubs uit heel Nederland. Gratis toegang voor kinderen.',
}

export const revalidate = 60

// ─── Pas hier de beurs-details aan zodra ze bekend zijn ────────────────────
const BEURS = {
  date: '17 & 18 oktober 2026',        // bijv. '14 & 15 maart 2026'
  time: 'Zaterdag: 10:00 – 16:00, zondag: 10:00 – 15:00',      // bijv. '10:00 – 17:00 uur'
  location: 'Heerhugowaard',
  venue: 'De Waardergolf\nBeukenlaan 1B\n1723 HX Heerhugowaard',
  admission: '€ 6 ,— | kinderen t/m 12jr gratis onder begeleiding',
  mapsUrl: 'https://maps.google.com/?q=Beukenlaan+1B+1723+HX+Heerhugowaard',
}
// ───────────────────────────────────────────────────────────────────────────

export default async function Beurs2026Page() {
  const layouts = await getAllBeursLayouts()

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative bg-[#1a1c1c] text-white overflow-hidden min-h-[70vh] flex items-center">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 50%),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#cc0000]/10 skew-x-[-15deg] translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-1 h-3/4 bg-[#cc0000]" />
        <div className="absolute top-0 right-1/4 w-0.5 h-1/2 bg-[#cc0000]/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-24">
          <div className="max-w-3xl">
            <ScrollReveal duration={0.7}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-0.5 bg-[#cc0000]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                  Westfriese Modelspoor Club
                </span>
              </div>
              <h1
                className="font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none mb-4"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                WMC
                <br />
                <span className="text-[#cc0000]">Beurs</span>
                <br />
                2026
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-xl mb-10">
                Beleef hoe modelspoorbouwers uit Nederland, België, Duitsland en Frankrijk hun meesterwerken tot leven wekken. Doe mee aan de Booknook-wedstrijd, laat je inspireren door diverse modelbouw-demonstraties of steek zelf de handen uit de mouwen. Ook voor de jonge bezoekers is er volop plezier met knutselactiviteiten, zelf treinen besturen en een springkussen!
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <div className="flex flex-wrap gap-6 mb-10">
                {[
                  { icon: Calendar, label: 'Datum', value: BEURS.date },
                  { icon: Clock, label: 'Tijden', value: BEURS.time },
                  { icon: MapPin, label: 'Locatie', value: BEURS.location },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#cc0000] flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5">{label}</p>
                      <p className="text-sm font-bold text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.35}>
              <div className="flex flex-wrap gap-4">
                <Button href="#banen" size="lg" skewed>
                  <span>Bekijk de banen</span>
                  <ArrowRight size={18} />
                </Button>
                <Button href="#route" variant="ghost" size="lg">
                  Route &amp; info
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== INFO STRIP ===== */}
      <section className="bg-[#cc0000]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
          <div className="flex flex-wrap gap-8 md:gap-12 items-center justify-between">
            <div className="flex flex-wrap gap-8 md:gap-12">
              {[
                { label: 'Datum', value: BEURS.date },
                { label: 'Openingstijden', value: BEURS.time },
                { label: 'Locatie', value: BEURS.location },
                { label: 'Toegang', value: BEURS.admission },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-0.5">{label}</p>
                  <p className="text-sm font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{value}</p>
                </div>
              ))}
            </div>
            {layouts.length > 0 && (
              <div className="flex items-center gap-2">
                <Users size={16} className="text-white/70" />
                <span className="text-sm font-bold text-white">
                  {layouts.length} uitgenodigde {layouts.length === 1 ? 'baan' : 'banen'}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== UITGENODIGDE BANEN ===== */}
      <section id="banen" className="bg-[#f3f3f3] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <ScrollReveal className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#cc0000]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                Uitgenodigde clubs
              </span>
            </div>
            <h2
              className="font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1c] mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Uitgenodigde Banen
            </h2>
            <p className="text-[#4d4c4c] text-lg max-w-2xl leading-relaxed">
              Hieronder vind je een voorproefje van wat je kunt verwachten.
            </p>
          </ScrollReveal>

          {layouts.length === 0 ? (
            <ScrollReveal>
              <div className="bg-white border border-[#e2e2e2] p-16 text-center">
                <Train size={40} className="mx-auto text-[#e2e2e2] mb-4" />
                <p className="font-black text-xl text-[#1a1c1c] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Banen worden binnenkort bekendgemaakt
                </p>
                <p className="text-sm text-[#926e69] max-w-sm mx-auto">
                  De uitgenodigde clubs worden binnenkort aangekondigd. Houd deze pagina
                  en onze agenda in de gaten.
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {layouts.map((layout) => (
                <StaggerItem key={layout.id}>
                  <TiltCard className="h-full" intensity={3}>
                    <LayoutCard layout={layout} />
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* ===== OVER DE BEURS ===== */}
      <section className="bg-white py-20 border-t border-[#e2e2e2]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#cc0000]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                  Over de beurs
                </span>
              </div>
              <h2
                className="font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1c] mb-6"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Een dag vol<br />modeltreinen
              </h2>
              <div className="flex flex-col gap-4 text-[#4d4c4c] text-base leading-relaxed">
                <p>
                  De Westfriese Modelspoor Club organiseert een grote modelspoor en modelbouw evenement,
                  waarbij exposanten uit Nederland, Belgie, Duitsland en Frankrijk hun banen presenteren.
                </p>
                <p>
                  Of je nu een fervent modelspoor of modelbouw fan bent, of gewoon benieuwd bent naar
                  deze bijzondere hobby - de beurs is toegankelijk voor iedereen. Kom kijken, stel vragen
                  en laat je inspireren.
                </p>
                <p>
                  Naast de tentoonstelling is er ook de mogelijkheid om in contact te
                  komen met onze leden over het lidmaatschap van de WMC.
                </p>
              </div>
              <div className="mt-8">
                <Button href="/contact" skewed>
                  <span>Vragen? Neem contact op</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </ScrollReveal>

            <StaggerContainer className="flex flex-col gap-4">
              {[
                { icon: Calendar, label: 'Datum', value: BEURS.date, sub: 'Noteer het alvast in je agenda' },
                { icon: Clock, label: 'Openingstijden', value: BEURS.time, sub: 'Zorg dat je op tijd bent' },
                { icon: MapPin, label: 'Locatie', value: BEURS.location, sub: BEURS.venue.replace('\n', ', ') },
              ].map(({ icon: Icon, label, value, sub }) => (
                <StaggerItem key={label} direction="left">
                  <div className="flex items-start gap-5 p-6 border border-[#e2e2e2] bg-[#f9f9f9]">
                    <div className="w-12 h-12 bg-[#cc0000] flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#926e69] mb-1">{label}</p>
                      <p className="font-black text-lg text-[#1a1c1c] leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {value}
                      </p>
                      <p className="text-xs text-[#926e69] mt-0.5">{sub}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ===== FOLDER ===== */}
      <FolderSection />

      {/* ===== ROUTE ===== */}
      <section id="route" className="bg-[#1a1c1c] py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#cc0000]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                Bereikbaarheid
              </span>
            </div>
            <h2
              className="font-black text-4xl md:text-5xl tracking-tighter text-white mb-8"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Hoe kom je er?
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StaggerItem>
              <div className="bg-white/5 border border-white/10 p-8">
                <h3 className="font-black text-xl text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Adres
                </h3>
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line mb-6">
                  {BEURS.venue}
                </p>
                <a
                  href={BEURS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#cc0000] text-white text-sm font-bold px-5 py-2.5 hover:bg-[#9e0000] transition-colors"
                >
                  <MapPin size={14} />
                  Open in Google Maps
                  <ExternalLink size={12} />
                </a>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white/5 border border-white/10 p-8">
                <h3 className="font-black text-xl text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Per OV
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Vanaf station Alkmaar met buslijn 160. Deze bus stopt voor de sporthal/zwembad.
                </p>
                <h3 className="font-black text-xl text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Vragen?
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Stuur ons een e-mail via{' '}
                  <a href="mailto:info@dewmc.nl" className="text-[#cc0000] hover:text-white transition-colors font-bold">
                    info@dewmc.nl
                  </a>
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>
    </>
  )
}
