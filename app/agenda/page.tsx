import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { PageHero } from '@/components/ui/PageHero'
import { getAllEvents } from '@/lib/contentful/queries'
import { stripInlineMarkdownLinks } from '@/lib/inlineMarkdown'
import type { AgendaEvent } from '@/lib/contentful/types'

/**
 * Parst "YYYY-MM-DD" als lokale datum (niet UTC).
 * new Date("2026-10-17") = UTC midnight = dag eerder in NL zomertijd.
 */
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.substring(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** Berekent de eerstvolgende datum voor een terugkerend evenement. */
function nextOccurrence(baseDate: Date, interval: AgendaEvent['recurrenceInterval']): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (baseDate >= today) return baseDate

  const d = new Date(baseDate)
  if (interval === 'weekly') {
    const diff = Math.ceil((today.getTime() - d.getTime()) / (7 * 86400000))
    d.setDate(d.getDate() + diff * 7)
  } else if (interval === 'biweekly') {
    const diff = Math.ceil((today.getTime() - d.getTime()) / (14 * 86400000))
    d.setDate(d.getDate() + diff * 14)
  } else if (interval === 'monthly') {
    while (d < today) d.setMonth(d.getMonth() + 1)
  }
  return d
}

/** Geeft de te tonen datum terug (next occurrence voor recurring, anders origineel). */
function displayDate(event: AgendaEvent): Date {
  const base = parseLocalDate(event.date)
  if (event.isRecurring && event.recurrenceInterval) {
    return nextOccurrence(base, event.recurrenceInterval)
  }
  return base
}

export const metadata: Metadata = {
  title: 'Agenda',
  description:
    'Blijf op de hoogte van de aankomende beurzen, open dagen en wekelijkse clubavonden van De Westfriese Modelspoor Club.',
}

export const revalidate = 60

type EventCategory = AgendaEvent['category']

const categoryConfig: Record<EventCategory, { label: string; variant: 'primary' | 'secondary' | 'default' | 'outline'; accentClass: string }> = {
  beurs: { label: 'Beurs', variant: 'primary', accentClass: 'border-l-4 border-[#cc0000]' },
  opendag: { label: 'Open Dag', variant: 'secondary', accentClass: 'border-l-4 border-[#0058bb]' },
  clubavond: { label: 'Clubavond', variant: 'default', accentClass: 'border-l-4 border-[#e2e2e2]' },
  overig: { label: 'Overig', variant: 'outline', accentClass: 'border-l-4 border-[#926e69]' },
  evenement: { label: 'Evenement', variant: 'secondary', accentClass: 'border-l-4 border-[#16a34a]' },
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function AgendaPage() {
  const allEvents = await getAllEvents()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Toekomstige events: éénmalige events na vandaag + terugkerende events altijd
  const upcomingEvents = allEvents
    .filter((e) => e.isRecurring || new Date(e.date) >= today)
    .sort((a, b) => displayDate(a).getTime() - displayDate(b).getTime())

  const publicEvents = upcomingEvents.filter((e) => e.isPublic)
  const memberEvents = upcomingEvents.filter((e) => !e.isPublic)

  return (
    <>
      <PageHero
        eyebrow="Beurzen • Open dagen • Clubavonden"
        title="Agenda"
        lead="Blijf op de hoogte van aankomende beurzen, open dagen en wekelijkse clubavonden."
      />

      {/* Vaste clubavonden — staat bovenaan omdat dit het vaste ritme van de
          club is; de losse evenementen eronder wisselen per seizoen. */}
      {memberEvents.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <h2 className="font-black text-2xl tracking-tighter mb-8 text-[#1a1c1c] flex items-center gap-3">
              <div className="w-8 h-0.5 bg-[#cc0000]" />
              Vaste clubavonden
            </h2>

            <div className="flex flex-col gap-px bg-[#e2e2e2] border border-[#e2e2e2]">
              {memberEvents.map((event) => (
                <div key={event.id} className="bg-white p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="sm:w-28 shrink-0">
                    <Badge>{categoryConfig[event.category].label}</Badge>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg tracking-tight text-[#1a1c1c]">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-1.5 text-sm text-[#4d4c4c]">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#cc0000]" />
                        {formatDate(displayDate(event))}
                        {event.isRecurring && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#926e69] ml-1">
                            terugkerend
                          </span>
                        )}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-[#cc0000]" />
                        {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#cc0000]" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Publieke evenementen */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="font-black text-2xl tracking-tighter mb-8 text-[#1a1c1c] flex items-center gap-3">
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
                        <h3 className="font-black text-xl tracking-tight text-[#1a1c1c] group-hover:text-[#cc0000] transition-colors mb-3">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-[#4d4c4c] mb-4">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-[#cc0000]" />
                            {formatDate(displayDate(event))}
                            {event.isRecurring && (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#926e69] ml-1">
                                terugkerend
                              </span>
                            )}
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
                          <p className="text-sm text-[#4d4c4c] leading-relaxed line-clamp-2">
                            {stripInlineMarkdownLinks(event.description)}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 mt-3 text-xs font-bold uppercase tracking-widest text-[#cc0000] group-hover:gap-2 transition-all">
                          Meer info <ArrowRight size={12} />
                        </span>
                      </div>
                      <div className="md:w-24 md:text-right shrink-0">
                        {event.price == null || event.price === '' ? (
                          <span className="text-xs font-bold text-[#926e69] uppercase tracking-widest">zie website</span>
                        ) : (
                          <span className="font-headline font-black text-lg text-[#1a1c1c]"
                          >{event.price}</span>
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
    </>
  )
}
