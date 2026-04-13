import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, Euro } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getAllEvents, getEventBySlug } from '@/lib/contentful/queries'
import type { AgendaEvent } from '@/lib/contentful/types'
import { sbObject, sbField } from '@/lib/stackbit'

export const revalidate = 1

type EventCategory = AgendaEvent['category']

const categoryConfig: Record<EventCategory, { label: string; variant: 'primary' | 'secondary' | 'default' | 'outline'; accentClass: string }> = {
  beurs: { label: 'Beurs', variant: 'primary', accentClass: 'border-l-4 border-[#cc0000]' },
  opendag: { label: 'Open Dag', variant: 'secondary', accentClass: 'border-l-4 border-[#0058bb]' },
  clubavond: { label: 'Clubavond', variant: 'default', accentClass: 'border-l-4 border-[#e2e2e2]' },
  overig: { label: 'Overig', variant: 'outline', accentClass: 'border-l-4 border-[#926e69]' },
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('nl-NL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const events = await getAllEvents()
  return events.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: 'Evenement niet gevonden' }
  return {
    title: event.title,
    description: event.description ?? `${event.title} op ${formatDate(event.date)} in ${event.location}`,
  }
}

export default async function AgendaDetailPage({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) notFound()

  const config = categoryConfig[event.category]

  return (
    <>
      {/* Back link */}
      <div className="bg-[#f9f9f9] border-b border-[#e2e2e2]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
          <Link
            href="/agenda"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#926e69] hover:text-[#cc0000] transition-colors"
          >
            <ArrowLeft size={14} />
            Alle evenementen
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[#1a1c1c] text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-[#cc0000]/10 skew-x-[-15deg] translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10" {...sbObject(event.id)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#cc0000]" />
            <span {...sbField(event.id, 'category')}><Badge variant={config.variant}>{config.label}</Badge></span>
          </div>
          <h1
            className="font-black text-4xl md:text-5xl tracking-tighter max-w-3xl mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            {...sbField(event.id, 'title')}
          >
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-white/70 text-sm">
            <span className="flex items-center gap-2" {...sbField(event.id, 'date')}>
              <Calendar size={16} className="text-[#cc0000]" />
              {formatDate(event.date)}
              {event.endDate && event.endDate !== event.date && (
                <> – {formatDate(event.endDate)}</>
              )}
            </span>
            <span className="flex items-center gap-2" {...sbField(event.id, 'startTime')}>
              <Clock size={16} className="text-[#cc0000]" />
              {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
            </span>
            <span className="flex items-center gap-2" {...sbField(event.id, 'location')}>
              <MapPin size={16} className="text-[#cc0000]" />
              {event.location}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Description */}
            <div className="lg:col-span-2" {...sbField(event.id, 'description')}>
              {event.description ? (
                <p className="text-[#4d4c4c] leading-relaxed text-lg">{event.description}</p>
              ) : (
                <p className="text-[#926e69] text-sm font-bold uppercase tracking-widest">
                  Geen verdere beschrijving beschikbaar.
                </p>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className={`bg-[#f3f3f3] ${config.accentClass} p-6 space-y-4`}>
                <h3
                  className="font-black text-sm uppercase tracking-widest text-[#1a1c1c]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Details
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#926e69]">Categorie</span>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#926e69]">Datum</span>
                    <span className="text-sm font-bold text-[#1a1c1c] text-right">
                      {formatDate(event.date)}
                      {event.endDate && event.endDate !== event.date && (
                        <><br />t/m {formatDate(event.endDate)}</>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#926e69]">Tijd</span>
                    <span className="text-sm font-bold text-[#1a1c1c]">
                      {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#926e69]">Locatie</span>
                    <span className="text-sm font-bold text-[#1a1c1c] text-right">{event.location}</span>
                  </div>
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#926e69]">Toegang</span>
                    <span className="text-sm font-bold text-[#1a1c1c]">
                      {event.isPublic ? 'Publiek' : 'Alleen leden'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#926e69]">Entree</span>
                    {event.price == null ? (
                      <span className="text-sm font-bold text-[#926e69]">—</span>
                    ) : event.price === 0 ? (
                      <span className="font-black text-green-600" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Gratis</span>
                    ) : (
                      <span className="flex items-center gap-1 font-black text-[#1a1c1c]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        <Euro size={14} className="text-[#cc0000]" />
                        {event.price},—
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back CTA */}
      <section className="bg-[#f3f3f3] py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Button href="/agenda" variant="secondary">
            <ArrowLeft size={16} />
            Alle evenementen
          </Button>
          <Button href="/contact" skewed>
            <span>Neem contact op</span>
          </Button>
        </div>
      </section>
    </>
  )
}
