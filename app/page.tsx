import Link from 'next/link'
import { ArrowRight, Train, Calendar, MapPin, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getAllTracks, getUpcomingEvents, getLatestNews } from '@/lib/contentful/queries'
import type { AgendaEvent } from '@/lib/contentful/types'

export const revalidate = 3600

type EventCategory = AgendaEvent['category']

const categoryLabels: Record<EventCategory, string> = {
  beurs: 'Beurs',
  clubavond: 'Clubavond',
  opendag: 'Open Dag',
  overig: 'Overig',
}

const categoryBadgeVariant: Record<EventCategory, 'primary' | 'secondary' | 'default' | 'outline'> = {
  beurs: 'primary',
  clubavond: 'default',
  opendag: 'secondary',
  overig: 'outline',
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export default async function HomePage() {
  // Parallel fetchen voor snelheid
  const [tracks, events, news] = await Promise.all([
    getAllTracks(),
    getUpcomingEvents(4),
    getLatestNews(3),
  ])

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative bg-[#1a1c1c] text-white overflow-hidden min-h-[85vh] flex items-center">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 0, transparent 50%), repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#cc0000]/10 skew-x-[-15deg] translate-x-1/4" />
        <div className="absolute bottom-0 left-1/4 w-1 h-3/4 bg-[#cc0000]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-[#cc0000]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                Opgericht 1998 — Noord-Scharwoude
              </span>
            </div>

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
              Een passie voor modeltreinen. Elke vrijdagavond bouwen en rijden onze leden
              aan {tracks.length > 0 ? tracks.length : 'zes'} unieke banen — van N-schaal tot het imposante 0-schaal.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="/onze-banen" size="lg" skewed>
                <span>Bekijk onze banen</span>
                <ArrowRight size={18} />
              </Button>
              <Button href="/over-ons" variant="ghost" size="lg">
                Over de club
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10">
              {[
                { value: '1998', label: 'Opgericht' },
                { value: String(tracks.length || 6), label: 'Actieve banen' },
                { value: 'Vr.', label: 'Clubavond' },
                { value: '€175', label: 'Contributie/jaar' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-3xl font-black text-[#cc0000] tracking-tighter"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-white/40 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#f9f9f9] clip-diagonal-bottom" />
      </section>

      {/* ===== QUICK INFO ===== */}
      <section className="bg-[#f9f9f9] py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#e2e2e2]">
            {[
              {
                icon: <MapPin size={20} />,
                title: 'Locatie',
                body: 'De Mossel 23e\n1723 HX Noord-Scharwoude',
              },
              {
                icon: <Clock size={20} />,
                title: 'Openingstijden',
                body: 'Vrijdagavond\n19:30 – 22:00 uur',
              },
              {
                icon: <Train size={20} />,
                title: 'Lid worden',
                body: 'Contributie 2025\n€175,— per jaar',
                cta: { label: 'Contact opnemen', href: '/contact' },
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={[
                  'p-8 bg-white flex flex-col gap-4',
                  i < 2 ? 'border-b md:border-b-0 md:border-r border-[#e2e2e2]' : '',
                ].join(' ')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#cc0000] flex items-center justify-center text-white shrink-0">
                    {item.icon}
                  </div>
                  <h3
                    className="font-black text-sm uppercase tracking-widest text-[#1a1c1c]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {item.title}
                  </h3>
                </div>
                <p className="text-[#4d4c4c] text-sm leading-relaxed whitespace-pre-line">{item.body}</p>
                {item.cta && (
                  <Link
                    href={item.cta.href}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#cc0000] hover:text-[#9e0000] transition-colors mt-auto"
                  >
                    {item.cta.label}
                    <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ONZE BANEN ===== */}
      {tracks.length > 0 && (
        <section className="bg-[#f3f3f3] py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-0.5 bg-[#cc0000]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                    {tracks.length} actieve groepen
                  </span>
                </div>
                <h2
                  className="font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1c]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Onze Banen
                </h2>
              </div>
              <Button href="/onze-banen" variant="ghost" className="hidden md:inline-flex">
                Alle banen
                <ArrowRight size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e2e2e2]">
              {tracks.map((track) => (
                <Link
                  key={track.slug}
                  href={`/onze-banen/${track.slug}`}
                  className="group bg-white p-8 flex flex-col gap-4 hover:bg-[#cc0000]/5 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                        {track.scale}
                      </span>
                      <h3
                        className="font-black text-xl tracking-tight text-[#1a1c1c] group-hover:text-[#cc0000] transition-colors"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {track.name}
                      </h3>
                    </div>
                    {track.status && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className={[
                            'w-2 h-2 rounded-full',
                            track.status === 'Actief' ? 'bg-green-500' : 'bg-amber-400',
                          ].join(' ')}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#926e69]">
                          {track.status}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-[#4d4c4c] leading-relaxed flex-1">
                    {track.shortDescription}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#e8e8e8]">
                    <Badge>{track.system}</Badge>
                    <ChevronRight
                      size={16}
                      className="text-[#926e69] group-hover:text-[#cc0000] group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 md:hidden">
              <Button href="/onze-banen" variant="secondary" className="w-full justify-center">
                Alle banen bekijken
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ===== AGENDA ===== */}
      {events.length > 0 && (
        <section className="bg-[#1a1c1c] py-24 text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-0.5 bg-[#cc0000]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                    Aankomende evenementen
                  </span>
                </div>
                <h2
                  className="font-black text-4xl md:text-5xl tracking-tighter"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Agenda
                </h2>
              </div>
              <Button href="/agenda" variant="ghost" className="hidden md:inline-flex !text-white hover:!text-[#cc0000]">
                Volledige agenda
                <ArrowRight size={16} />
              </Button>
            </div>

            <div className="flex flex-col gap-px bg-white/10">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#1a1c1c] p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-white/5 transition-colors group"
                >
                  <div className="sm:w-28 shrink-0">
                    <Badge variant={categoryBadgeVariant[event.category]}>
                      {categoryLabels[event.category]}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-black text-lg tracking-tight group-hover:text-[#cc0000] transition-colors"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-white/50">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(event.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div className="sm:w-24 text-right shrink-0">
                    {event.price == null ? (
                      <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Leden</span>
                    ) : event.price === 0 ? (
                      <span className="text-sm font-bold text-green-400">Gratis</span>
                    ) : (
                      <span className="text-sm font-bold text-white">€ {event.price},—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 md:hidden">
              <Button href="/agenda" className="w-full justify-center">
                Volledige agenda
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ===== NIEUWS ===== */}
      {news.length > 0 && (
        <section className="bg-[#f9f9f9] py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
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
              <Button href="/nieuws" variant="ghost" className="hidden md:inline-flex">
                Alle berichten
                <ArrowRight size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e2e2e2]">
              {news.map((article) => (
                <article key={article.id} className="bg-white p-8 flex flex-col gap-4 border-l-4 border-[#cc0000]">
                  <div className="flex items-center gap-2">
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

      {/* ===== CTA ===== */}
      <section className="bg-[#cc0000] py-20 overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
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
            <Button href="/over-ons" size="lg" className="!bg-white/10 !text-white hover:!bg-white/20 border border-white/30">
              Meer over de club
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
