import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Train, MapPin, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal'
import { HeroReveal } from '@/components/ui/HeroReveal'
import { TiltCard } from '@/components/ui/TiltCard'
import { getAllTracks, getUpcomingEvents, getLatestNews, getSiteSettings } from '@/lib/contentful/queries'
import type { AgendaEvent, TrackScale } from '@/lib/contentful/types'

export const revalidate = 60

type EventCategory = AgendaEvent['category']

const categoryLabels: Record<EventCategory, string> = {
  beurs: 'Beurs',
  clubavond: 'Clubavond',
  opendag: 'Open Dag',
  overig: 'Overig',
  evenement: 'Evenement',
}

const categoryAccent: Record<EventCategory, string> = {
  beurs: 'bg-[#cc0000]',
  clubavond: 'bg-[#4d4c4c]',
  opendag: 'bg-[#0058bb]',
  overig: 'bg-[#926e69]',
  evenement: 'bg-[#16a34a]',
}

function parseDateParts(dateStr: string): { day: string; month: string; year: string } | null {
  try {
    const [year, month, day] = dateStr.substring(0, 10).split('-').map(Number)
    const d = new Date(year, month - 1, day)
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
  const [tracks, events, news, settings] = await Promise.all([
    getAllTracks(),
    getUpcomingEvents(4),
    getLatestNews(3),
    getSiteSettings(),
  ])

  // De hero toont een echte clubbaan in plaats van een decoratief vlak.
  const heroTrack = tracks.find((track) => track.coverImage?.fields?.file?.url)
  const heroImageUrl = heroTrack?.coverImage?.fields?.file?.url
    ? `https:${heroTrack.coverImage.fields.file.url}?w=2000&h=1200&fit=fill&f=center&fm=webp`
    : null

  // Aanwezige schalen, van klein naar groot, afgekort tot 'N' / 'H0' / '0'.
  const scaleOrder: TrackScale[] = ['N (1:160)', 'H0 (1:87)', '0 (1:43,5)']
  const scales = scaleOrder
    .filter((scale) => tracks.some((track) => track.scale === scale))
    .map((scale) => scale.split(' ')[0])

  // "N-, H0- en 0-schaal" — blijft kloppen als er een schaal bij komt of wegvalt.
  const scaleList =
    scales.length > 1
      ? `${scales.slice(0, -1).join('-, ')}- en ${scales[scales.length - 1]}-schaal`
      : scales.length === 1
        ? `${scales[0]}-schaal`
        : 'diverse schalen'

  const heroFacts = [
    { label: 'Clubbanen', value: String(tracks.length) },
    { label: 'Schalen', value: scales.join(' · ') },
    { label: 'Opgericht', value: '1998' },
    { label: settings.openingsDag, value: settings.openingsTijd.replace(/ uur$/, '') },
  ]

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative bg-[#1a1c1c] text-white overflow-hidden">
        {heroImageUrl && (
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src={heroImageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/* Scrim in drie lagen: een lichte tint over het geheel, een
                horizontaal verloop dat de tekstkolom dekkend maakt, en een
                voet die naar de feitenbalk toe wegvalt. De rechterkant blijft
                open zodat de baan zelf zichtbaar is. */}
            <div className="absolute inset-0 bg-[#1a1c1c]/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1c1c] via-[#1a1c1c]/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#1a1c1c] to-transparent" />
          </div>
        )}

        <HeroReveal
          eyebrow={`  ${settings.stad}`}
          headline={['De Westfriese', 'Modelspoor Club']}
          lead={`De Westfriese Modelspoor Club bouwt en onderhoudt ${tracks.length} clubbanen in ${scaleList}. Elke ${settings.openingsDag.toLowerCase()} staat de deur open voor bezoekers en nieuwe leden.`}
          
        />
      </section>

      {/* ===== AGENDA ===== */}
      <section className="bg-white py-20 border-b border-[#e2e2e2]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <Eyebrow className="mb-3">Aankomende evenementen</Eyebrow>
                <h2 className="font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1c]">
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
          </ScrollReveal>

          {events.length === 0 ? (
            <p className="text-[#926e69] text-sm">Geen aankomende evenementen.</p>
          ) : (
            <StaggerContainer className="flex flex-col divide-y divide-[#e2e2e2] border border-[#e2e2e2]">
              {events.map((event, i) => {
                const dateParts = parseDateParts(event.date)
                const isPublic = event.isPublic

                return (
                  <StaggerItem key={event.id} direction="none" className={i >= 2 ? 'hidden md:block' : ''}>
                    <Link href={`/agenda/${event.slug}`} className="flex items-stretch group hover:bg-[#f9f9f9] transition-colors">
                      <div className={`${categoryAccent[event.category]} w-20 md:w-24 shrink-0 flex flex-col items-center justify-center py-6 px-2`}>
                        {dateParts ? (
                          <>
                            <span className="font-headline text-white font-black text-3xl md:text-4xl leading-none">
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
                        <h3 className="font-black text-lg md:text-xl tracking-tight text-[#1a1c1c] group-hover:text-[#cc0000] transition-colors leading-tight">
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

                      <div className="hidden sm:flex items-center pr-6 shrink-0">
                        {event.price == null || event.price === '' ? (
                          <span className="text-xs font-bold text-[#926e69] uppercase tracking-widest">Alleen leden</span>
                        ) : (
                          <span className="font-headline font-black text-xl text-[#1a1c1c]">
                            {event.price}
                          </span>
                        )}
                      </div>

                      <div className="hidden md:flex items-center pr-6 shrink-0">
                        <ChevronRight
                          size={18}
                          className="text-[#e2e2e2] group-hover:text-[#cc0000] group-hover:translate-x-1 transition-all"
                        />
                      </div>
                    </Link>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          )}

          <div className="mt-6 md:hidden">
            <Button href="/agenda" variant="secondary" className="w-full justify-center">
              Bekijk de volledige agenda
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* ===== ONZE BANEN ===== */}
      {tracks.length > 0 && (
        <section className="bg-[#1a1c1c] py-20 overflow-hidden relative">
          {/* Subtiele achtergrond grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 50%),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-6 md:px-8">
            <ScrollReveal>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <Eyebrow className="mb-3">{tracks.length} actieve groepen</Eyebrow>
                  <h2 className="font-black text-4xl md:text-5xl tracking-tighter text-white">
                    Onze Banen
                  </h2>
                </div>
                <Link
                  href="/onze-banen"
                  className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors"
                >
                  Alle banen
                  <ArrowRight size={16} />
                </Link>
              </div>
            </ScrollReveal>

            {/* Kaarten grid */}
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tracks.map((track, i) => {
                const imageUrl = track.coverImage?.fields?.file?.url
                  ? `https:${track.coverImage.fields.file.url}?w=600&h=400&fit=fill&f=center&fm=webp`
                  : null

                return (
                  <StaggerItem key={track.slug} className={i >= 3 ? 'hidden sm:block' : ''}>
                    <TiltCard className="h-full" intensity={5}>
                      <Link
                        href={`/onze-banen/${track.slug}`}
                        className="group relative flex flex-col overflow-hidden bg-white/5 border border-white/10 hover:border-[#cc0000]/60 transition-colors duration-300 h-full"
                      >
                        {/* Afbeelding of decoratief nummer */}
                        <div className="relative h-44 overflow-hidden bg-[#111213]">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={track.name}
                              fill
                              priority={i < 3}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-end p-4">
                              <span className="font-headline font-black text-[80px] leading-none text-white/5 select-none">
                                {String(i + 1).padStart(2, '0')}
                              </span>
                            </div>
                          )}
                          {/* Rood accent streep */}
                          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#cc0000] group-hover:w-full transition-all duration-500" />
                          {/* Schaal badge */}
                          <div className="absolute top-3 left-3">
                            <span className="bg-[#cc0000] text-white text-[9px] font-black uppercase tracking-widest px-2 py-1">
                              {track.scale}
                            </span>
                          </div>
                          {/* Status */}
                          {track.status && (
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 px-2 py-1">
                              <span className={['w-1.5 h-1.5 rounded-full', track.status === 'Actief' ? 'bg-green-400' : 'bg-amber-400'].join(' ')} />
                              <span className="text-[9px] font-bold uppercase tracking-widest text-white/70">{track.status}</span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col gap-2 p-5 flex-1">
                          <h3 className="font-black text-lg text-white group-hover:text-[#cc0000] transition-colors leading-tight">
                            {track.name}
                          </h3>
                          <p className="text-xs text-white/40 font-medium">{track.groupName}</p>

                          {track.shortDescription && (
                            <p className="text-sm text-white/50 leading-relaxed flex-1 line-clamp-2 mt-1">
                              {track.shortDescription}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                            <div className="flex gap-2">
                              <Badge variant="outline">{track.system}</Badge>
                              {track.moduleCount && (
                                <span className="text-[10px] text-white/30 font-bold self-center">
                                  {track.moduleCount} modules
                                </span>
                              )}
                            </div>
                            <ChevronRight
                              size={16}
                              className="text-white/20 group-hover:text-[#cc0000] group-hover:translate-x-1 transition-all"
                            />
                          </div>
                        </div>
                      </Link>
                    </TiltCard>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>

            <div className="mt-8 sm:flex sm:justify-center">
              <Button href="/onze-banen" variant="outline" size="lg" className="w-full sm:w-auto !border-white/20 !text-white hover:!bg-white hover:!text-[#1a1c1c]">
                Bekijk alle {tracks.length} banen
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ===== NIEUWS ===== */}
      {news.length > 0 && (
        <section className="bg-white py-20 border-t border-[#e2e2e2]">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <ScrollReveal>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <Eyebrow className="mb-3">Laatste updates</Eyebrow>
                  <h2 className="font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1c]">
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
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e2e2e2]">
              {news.map((article) => (
                <StaggerItem key={article.id}>
                  <Link
                    href={`/nieuws/${article.slug}`}
                    className="group bg-white p-8 flex flex-col gap-3 border-l-4 border-[#cc0000] h-full hover:bg-[#fafafa] transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      {article.category && <Badge variant="primary">{article.category}</Badge>}
                      <time className="text-xs text-[#926e69]">
                        {new Date(article.publishedAt).toLocaleDateString('nl-NL', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </time>
                    </div>
                    <h3 className="font-black text-xl tracking-tight text-[#1a1c1c] group-hover:text-[#cc0000] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-[#4d4c4c] leading-relaxed flex-1">{article.summary}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#cc0000] group-hover:gap-2 transition-all">
                      Lees meer <ArrowRight size={12} />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
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
        <ScrollReveal className="relative max-w-7xl mx-auto px-6 md:px-8 text-center text-white">
          <Train size={32} className="mx-auto mb-4" />
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter mb-6">
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
        </ScrollReveal>
      </section>
    </>
  )
}
