import Link from 'next/link'
import { ArrowRight, Train, MapPin, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getAllTracks, getUpcomingEvents, getLatestNews } from '@/lib/contentful/queries'
import type { AgendaEvent } from '@/lib/contentful/types'

export const revalidate = 1

type EventCategory = AgendaEvent['category']

const categoryLabels: Record<EventCategory, string> = {
  beurs: 'Beurs',
  clubavond: 'Clubavond',
  opendag: 'Open Dag',
  overig: 'Overig',
}

const categoryAccent: Record<EventCategory, string> = {
  beurs: 'bg-[#cc0000]',
  clubavond: 'bg-[#4d4c4c]',
  opendag: 'bg-[#0058bb]',
  overig: 'bg-[#926e69]',
}

function parseDateParts(dateStr: string): { day: string; month: string; year: string } | null {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return null
    return {
      day: d.toLocaleDateString('nl-NL', { day: 'numeric' }),
      month: d.toLocaleDateString('nl-NL', { month: 'short' }).replace('.', '').toUpperCase(),
      year: d.toLocaleDateString('nl-NL', { year: 'numeric' }),
    }
  } catch {
    return null
  }
}

export default async function HomePage() {
  const [tracks, events, news] = await Promise.all([
    getAllTracks(),
    getUpcomingEvents(4),
    getLatestNews(3),
  ])

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative bg-[#1a1c1c] text-white overflow-hidden min-h-[85vh] flex items-center">
        {/* Grid achtergrond */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 50%),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Diagonaal rood accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#cc0000]/10 skew-x-[-15deg] translate-x-1/4" />
        <div className="absolute bottom-0 left-1/4 w-1 h-3/4 bg-[#cc0000]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-24">
          <div className="max-w-3xl">
            {/* Headline */}
            <h1
              className="font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none mb-8"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Westfriese
              <br />
              <span className="text-[#cc0000]">Modelspoor</span>
              <br />
              Club
            </h1>

            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-xl mb-10">
              Wij bieden onderdak aan modelspoorbouwers van alle schalen. Elke vrijdagavond
              werken onze leden samen aan {tracks.length > 0 ? tracks.length : 'zes'} unieke banen in Noord-Scharwoude.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Button href="/contact" size="lg" skewed>
                <span>Wordt lid</span>
                <ArrowRight size={18} />
              </Button>
              <Button href="/over-ons" variant="ghost" size="lg">
                Over de club
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AGENDA ===== */}
      <section className="bg-white py-20 border-b border-[#e2e2e2]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-0.5 bg-[#cc0000]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                  Aankomende evenementen
                </span>
              </div>
              <h2
                className="font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1c]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Agenda
              </h2>
            </div>
            <Link
              href="/agenda"
              className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-[#cc0000] hover:text-[#9e0000] transition-colors"
            >
              Volledige agenda
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Event kaarten */}
          {events.length === 0 ? (
            <p className="text-[#926e69] text-sm">Geen aankomende evenementen.</p>
          ) : (
            <div className="flex flex-col divide-y divide-[#e2e2e2] border border-[#e2e2e2]">
              {events.map((event) => {
                const dateParts = parseDateParts(event.date)
                const isPublic = event.isPublic

                return (
                  <div
                    key={event.id}
                    className="flex items-stretch group hover:bg-[#f9f9f9] transition-colors"
                  >
                    {/* Datum blok */}
                    <div className={`${categoryAccent[event.category]} w-20 md:w-24 shrink-0 flex flex-col items-center justify-center py-6 px-2`}>
                      {dateParts ? (
                        <>
                          <span
                            className="text-white font-black text-3xl md:text-4xl leading-none"
                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                          >
                            {dateParts.day}
                          </span>
                          <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1">
                            {dateParts.month}
                          </span>
                          <span className="text-white/50 text-[9px] font-bold mt-0.5">
                            {dateParts.year}
                          </span>
                        </>
                      ) : (
                        <span className="text-white text-xs font-bold uppercase tracking-widest text-center leading-tight px-1">
                          {event.date}
                        </span>
                      )}
                    </div>

                    {/* Inhoud */}
                    <div className="flex-1 px-6 py-5 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#926e69]">
                          {categoryLabels[event.category]}
                        </span>
                        {!isPublic && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#926e69] border border-[#e2e2e2] px-1.5 py-0.5">
                            Leden
                          </span>
                        )}
                      </div>
                      <h3
                        className="font-black text-lg md:text-xl tracking-tight text-[#1a1c1c] group-hover:text-[#cc0000] transition-colors leading-tight"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-[#926e69]">
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} />
                          {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} />
                          {event.location}
                        </span>
                      </div>
                    </div>

                    {/* Prijs */}
                    <div className="hidden sm:flex items-center pr-6 shrink-0">
                      {event.price == null ? (
                        <span className="text-xs font-bold text-[#926e69] uppercase tracking-widest">Alleen leden</span>
                      ) : event.price === 0 ? (
                        <span
                          className="font-black text-lg text-green-600"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                          Gratis
                        </span>
                      ) : (
                        <span
                          className="font-black text-xl text-[#1a1c1c]"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                          € {event.price},—
                        </span>
                      )}
                    </div>

                    {/* Pijl */}
                    <div className="hidden md:flex items-center pr-6 shrink-0">
                      <ChevronRight
                        size={18}
                        className="text-[#e2e2e2] group-hover:text-[#cc0000] group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Mobile link */}
          <div className="mt-6 md:hidden">
            <Button href="/agenda" variant="secondary" className="w-full justify-center">
              Volledige agenda
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* ===== ONZE BANEN ===== */}
      {tracks.length > 0 && (
        <section className="bg-[#f3f3f3] py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            {/* Header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-0.5 bg-[#cc0000]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                    {tracks.length} groepen
                  </span>
                </div>
                <h2
                  className="font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1c]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Onze Banen
                </h2>
              </div>
              <Link
                href="/onze-banen"
                className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-[#cc0000] hover:text-[#9e0000] transition-colors"
              >
                Meer info
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Compacte lijst */}
            <div className="bg-white border border-[#e2e2e2] divide-y divide-[#e2e2e2]">
              {tracks.map((track, i) => (
                <Link
                  key={track.slug}
                  href={`/onze-banen/${track.slug}`}
                  className="group flex items-center gap-4 md:gap-6 px-6 py-5 hover:bg-[#cc0000]/5 transition-colors"
                >
                  {/* Volgnummer */}
                  <span
                    className="text-[#e2e2e2] font-black text-xl w-6 shrink-0 select-none"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Naam */}
                  <div className="flex-1 min-w-0">
                    <span
                      className="font-black text-lg text-[#1a1c1c] group-hover:text-[#cc0000] transition-colors block truncate"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {track.name}
                    </span>
                    <span className="text-xs text-[#926e69]">{track.groupName}</span>
                  </div>

                  {/* Badges — verborgen op mobile */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <Badge>{track.scale}</Badge>
                    <Badge>{track.system}</Badge>
                  </div>

                  {/* Status dot */}
                  {track.status && (
                    <div className="hidden md:flex items-center gap-1.5 shrink-0 w-20">
                      <span
                        className={[
                          'w-1.5 h-1.5 rounded-full shrink-0',
                          track.status === 'Actief' ? 'bg-green-500' : 'bg-amber-400',
                        ].join(' ')}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#926e69]">
                        {track.status}
                      </span>
                    </div>
                  )}

                  {/* Pijl */}
                  <ChevronRight
                    size={18}
                    className="text-[#e2e2e2] group-hover:text-[#cc0000] group-hover:translate-x-1 transition-all shrink-0"
                  />
                </Link>
              ))}
            </div>

            {/* Mobile link */}
            <div className="mt-6 md:hidden">
              <Button href="/onze-banen" variant="secondary" className="w-full justify-center">
                Meer over onze banen
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ===== NIEUWS ===== */}
      {news.length > 0 && (
        <section className="bg-white py-20 border-t border-[#e2e2e2]">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-0.5 bg-[#cc0000]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                    Laatste updates
                  </span>
                </div>
                <h2
                  className="font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1c]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Nieuws
                </h2>
              </div>
              <Link
                href="/nieuws"
                className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-[#cc0000] hover:text-[#9e0000] transition-colors"
              >
                Alle berichten
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e2e2e2]">
              {news.map((article) => (
                <article key={article.id} className="bg-white p-8 flex flex-col gap-3 border-l-4 border-[#cc0000]">
                  <div className="flex items-center gap-2 flex-wrap">
                    {article.category && <Badge variant="primary">{article.category}</Badge>}
                    <time className="text-xs text-[#926e69]">
                      {new Date(article.publishedAt).toLocaleDateString('nl-NL', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </time>
                  </div>
                  <h3
                    className="font-black text-xl tracking-tight text-[#1a1c1c]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {article.title}
                  </h3>
                  <p className="text-sm text-[#4d4c4c] leading-relaxed flex-1">{article.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA — LID WORDEN ===== */}
      <section className="bg-[#cc0000] py-20 overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 text-center text-white">
          <Train size={32} className="mx-auto mb-4" />
          <h2
            className="font-black text-4xl md:text-6xl tracking-tighter mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Word lid van de WMC
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Geïnteresseerd in modeltreinen? Kom een vrijdagavond langs voor een
            rondleiding en ontdek onze unieke banen.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/contact" variant="secondary" size="lg" skewed>
              <span>Neem contact op</span>
              <ArrowRight size={18} />
            </Button>
            <Button
              href="/over-ons"
              size="lg"
              className="!bg-white/10 !text-white hover:!bg-white/20 border border-white/30"
            >
              Meer over de club
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
