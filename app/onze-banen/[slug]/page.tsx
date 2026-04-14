import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Images } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { RichText } from '@/components/ui/RichText'
import { getAllTracks, getTrackBySlug } from '@/lib/contentful/queries'
import type { Document } from '@contentful/rich-text-types'
import type { ContentfulImage } from '@/lib/contentful/types'

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
    ...(track.status        ? [{ label: 'Status',         value: track.status }] : []),
    ...(track.foundedYear   ? [{ label: 'Opgericht',      value: String(track.foundedYear) }] : []),
    ...(track.moduleCount   ? [{ label: 'Modules',        value: `${track.moduleCount} stuks` }] : []),
    ...(track.railLengte    ? [{ label: 'Raillengte',     value: track.railLengte }] : []),
    ...(track.tijdperk      ? [{ label: 'Tijdperk',       value: track.tijdperk }] : []),
    ...(track.merk          ? [{ label: 'Merk',           value: track.merk }] : []),
    ...(track.landcontinent ? [{ label: 'Land/Continent', value: track.landcontinent }] : []),
    ...(track.aantalLeden   ? [{ label: 'Leden',          value: `${track.aantalLeden} personen` }] : []),
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
      <section className="bg-[#1a1c1c] text-white relative overflow-hidden">
        {/* Cover afbeelding als hero-achtergrond */}
        {track.coverImage && (
          <div className="absolute inset-0">
            <Image
              src={`https:${(track.coverImage as ContentfulImage).fields.file.url}?w=1600&h=700&fit=fill&f=center`}
              alt={track.name}
              fill
              priority
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1c1c] via-[#1a1c1c]/80 to-transparent" />
          </div>
        )}
        <div className="absolute top-0 right-0 w-1/4 h-full bg-[#cc0000]/10 skew-x-[-15deg] translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 py-20">
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

      {/* Fotogalerij */}
      {track.images && (track.images as ContentfulImage[]).length > 0 && (
        <section className="bg-[#f3f3f3] py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Images size={18} className="text-[#cc0000]" />
              <h2
                className="font-black text-2xl tracking-tight text-[#1a1c1c]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Fotogalerij
              </h2>
              <span className="text-sm text-[#926e69] font-bold ml-1">
                {(track.images as ContentfulImage[]).length} foto&apos;s
              </span>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {(track.images as ContentfulImage[]).map((img, i) => {
                const url = `https:${img.fields.file.url}?w=900&fm=webp&q=80`
                const w = img.fields.file.details.image?.width ?? 900
                const h = img.fields.file.details.image?.height ?? 600

                return (
                  <div
                    key={i}
                    className="group relative overflow-hidden break-inside-avoid bg-[#e2e2e2]"
                  >
                    <Image
                      src={url}
                      alt={img.fields.title || `${track.name} foto ${i + 1}`}
                      width={w}
                      height={h}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Rood accent bij hover */}
                    <div className="absolute inset-0 border-2 border-[#cc0000] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    {img.fields.description && (
                      <div className="absolute bottom-0 left-0 right-0 bg-[#1a1c1c]/80 px-4 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-xs text-white/80">{img.fields.description}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

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
