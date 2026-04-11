import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, MapPin, Euro } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { getAllEvents } from '@/lib/contentful/queries'
import type { AgendaEvent } from '@/lib/contentful/types'

export const metadata: Metadata = {
  title: 'Agenda',
  description:
    'Blijf op de hoogte van de aankomende beurzen, open dagen en wekelijkse clubavonden van De Westfriese Modelspoor Club.',
}

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

export default async function AgendaPage() {
  const allEvents = await getAllEvents()

  const publicEvents = allEvents.filter((e) => e.isPublic)
  const memberEvents = allEvents.filter((e) => !e.isPublic)

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1a1c1c] text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-[#cc0000]/10 skew-x-[-15deg] translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#cc0000]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
              Beurzen • Open Dagen • Clubavonden
            </span>
          </div>
          <h1
            className="font-black text-5xl md:text-6xl tracking-tighter mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Agenda
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Blijf op de hoogte van aankomende beurzen, open dagen en wekelijkse clubavonden.
          </p>
        </div>
      </section>

      {/* Publieke evenementen */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2
            className="font-black text-2xl tracking-tighter mb-8 text-[#1a1c1c] flex items-center gap-3"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            <div className="w-8 h-0.5 bg-[#cc0000]" />
            Aankomende evenementen
          </h2>

          {publicEvents.length === 0 ? (
            <div className="bg-white border-l-4 border-[#e2e2e2] p-8 text-center">
              <p className="text-[#926e69] text-sm font-bold uppercase tracking-widest">
                Geen aankomende evenementen
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {publicEvents.map((event) => {
                const config = categoryConfig[event.category]
                return (
                  <Link
                    key={event.id}
                    href={`/agenda/${event.slug}`}
                    className={`group bg-white ${config.accentClass} p-6 md:p-8 hover:bg-[#fafafa] transition-colors`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="md:w-28 shrink-0">
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      <div className="flex-1">
                        <h3
                          className="font-black text-xl tracking-tight text-[#1a1c1c] group-hover:text-[#cc0000] transition-colors mb-3"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-[#4d4c4c] mb-4">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-[#cc0000]" />
                            {formatDate(event.date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} className="text-[#cc0000]" />
                            {event.startTime}
                            {event.endTime ? ` – ${event.endTime}` : ''}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-[#cc0000]" />
                            {event.location}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-[#4d4c4c] leading-relaxed line-clamp-2">{event.description}</p>
                        )}
                        <span className="inline-flex items-center gap-1 mt-3 text-xs font-bold uppercase tracking-widest text-[#cc0000] group-hover:gap-2 transition-all">
                          Meer info <ArrowRight size={12} />
                        </span>
                      </div>
                      <div className="md:w-24 md:text-right shrink-0">
                        {event.price == null ? (
                          <span className="text-xs font-bold text-[#926e69] uppercase tracking-widest">Gratis</span>
                        ) : event.price === 0 ? (
                          <span className="font-black text-lg text-green-600"
                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                          >Gratis</span>
                        ) : (
                          <div className="flex items-center md:justify-end gap-1">
                            <Euro size={16} className="text-[#cc0000]" />
                            <span className="font-black text-xl text-[#1a1c1c]"
                              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                            >
                              {event.price},—
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Leden clubavonden */}
      {memberEvents.length > 0 && (
        <section className="bg-[#1a1c1c] text-white py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <h2
              className="font-black text-2xl tracking-tighter mb-2 flex items-center gap-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <div className="w-8 h-0.5 bg-[#cc0000]" />
              Vaste clubavonden
            </h2>
            <p className="text-white/50 text-sm mb-8 ml-11">Alleen voor leden</p>

            <div className="flex flex-col gap-px bg-white/10">
              {memberEvents.map((event) => (
                <div key={event.id} className="bg-[#1a1c1c] p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="sm:w-28 shrink-0">
                    <Badge>{categoryConfig[event.category].label}</Badge>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-black text-lg tracking-tight"
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
                  <span className="text-xs font-bold text-[#926e69] uppercase tracking-widest shrink-0">
                    Alleen leden
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
