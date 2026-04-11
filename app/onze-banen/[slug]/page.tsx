import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { RichText } from '@/components/ui/RichText'
import { getAllTracks, getTrackBySlug } from '@/lib/contentful/queries'
import type { Document } from '@contentful/rich-text-types'

export const revalidate = 1

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const tracks = await getAllTracks()
  return tracks.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const track = await getTrackBySlug(slug)
  if (!track) return { title: 'Baan niet gevonden' }
  return {
    title: track.name,
    description: track.shortDescription,
  }
}

export default async function TrackDetailPage({ params }: Props) {
  const { slug } = await params
  const track = await getTrackBySlug(slug)

  if (!track) notFound()

  const specs = [
    { label: 'Schaal', value: track.scale },
    { label: 'Systeem', value: track.system },
    ...(track.status ? [{ label: 'Status', value: track.status }] : []),
    ...(track.foundedYear ? [{ label: 'Opgericht', value: String(track.foundedYear) }] : []),
    ...(track.moduleCount ? [{ label: 'Modules', value: `${track.moduleCount} stuks` }] : []),
  ]

  return (
    <>
      {/* Back link */}
      <div className="bg-[#f9f9f9] border-b border-[#e2e2e2]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
          <Link
            href="/onze-banen"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#926e69] hover:text-[#cc0000] transition-colors"
          >
            <ArrowLeft size={14} />
            Alle banen
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[#1a1c1c] text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-[#cc0000]/10 skew-x-[-15deg] translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#cc0000]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
              {track.scale} — {track.system}
            </span>
          </div>
          <h1
            className="font-black text-5xl md:text-6xl tracking-tighter mb-3"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {track.name}
          </h1>
          <p className="text-white/50 text-lg mb-6">{track.groupName}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="primary">{track.scale}</Badge>
            <Badge>{track.system}</Badge>
            {track.status && (
              <div className="flex items-center gap-1.5">
                <span
                  className={[
                    'w-2 h-2 rounded-full',
                    track.status === 'Actief' ? 'bg-green-400' : 'bg-amber-400',
                  ].join(' ')}
                />
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                  {track.status}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main rich text */}
            <div className="lg:col-span-2">
              {track.description ? (
                <RichText document={track.description as unknown as Document} />
              ) : (
                <p className="text-[#4d4c4c] leading-relaxed">{track.shortDescription}</p>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Specs */}
              <div className="bg-[#f3f3f3] border-l-4 border-[#cc0000] p-6">
                <h3
                  className="font-black text-sm uppercase tracking-widest text-[#1a1c1c] mb-4"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Specificaties
                </h3>
                <dl className="space-y-3">
                  {specs.map((item) => (
                    <div key={item.label} className="flex justify-between items-baseline gap-4">
                      <dt className="text-xs font-bold uppercase tracking-widest text-[#926e69]">
                        {item.label}
                      </dt>
                      <dd className="text-sm font-bold text-[#1a1c1c]">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Short description as highlight */}
              <div className="bg-[#f3f3f3] p-6">
                <h3
                  className="font-black text-sm uppercase tracking-widest text-[#1a1c1c] mb-3"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  In het kort
                </h3>
                <p className="text-sm text-[#4d4c4c] leading-relaxed">{track.shortDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back CTA */}
      <section className="bg-[#f3f3f3] py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Button href="/onze-banen" variant="secondary">
            <ArrowLeft size={16} />
            Alle banen bekijken
          </Button>
          <Button href="/contact" skewed>
            <span>Word lid &amp; kom rijden</span>
          </Button>
        </div>
      </section>
    </>
  )
}
