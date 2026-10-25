import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Document } from '@contentful/rich-text-types'
import { ArrowRight, Camera, Images } from 'lucide-react'
import { getAllBeursLayouts, getBeursHighlights, getSponsors } from '@/lib/contentful/queries'
import type { ContentfulRichText } from '@/lib/contentful/types'
import { Button } from '@/components/ui/Button'
import { LinkCard } from '@/components/ui/LinkCard'
import { PageHero } from '@/components/ui/PageHero'
import { PhotoGallery } from '@/components/ui/PhotoGallery'
import { RichText } from '@/components/ui/RichText'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal'
import { TiltCard } from '@/components/ui/TiltCard'
import { LayoutCard } from '@/components/ui/LayoutCard'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { getLinkPreview } from '@/lib/linkPreview'
import { showBeursPage } from '@/lib/site-config'

export const revalidate = 300

const DEFAULT_DESCRIPTION =
  'Terugblik op de WMC Modelspoor Beurs 2026 in Heerhugowaard: foto’s van de banen, de demonstraties en de bezoekers.'

/** Een rich-text-veld dat alleen uit lege alinea's bestaat, telt als leeg. */
function hasContent(doc?: ContentfulRichText): doc is ContentfulRichText {
  const hasText = (node: unknown): boolean => {
    const n = node as { nodeType?: string; value?: string; content?: unknown[] }
    if (n.nodeType === 'text') return Boolean(n.value?.trim())
    if (n.nodeType && n.nodeType !== 'paragraph' && n.nodeType !== 'document') return true
    return (n.content ?? []).some(hasText)
  }
  return Boolean(doc && hasText(doc))
}

export async function generateMetadata(): Promise<Metadata> {
  const highlights = await getBeursHighlights()
  const description = highlights.seoOmschrijving || highlights.intro?.slice(0, 160) || DEFAULT_DESCRIPTION
  const cover = highlights.fotos[0]

  return {
    title: highlights.titel,
    description,
    alternates: {
      canonical: 'https://dewmc.nl/beurs-2026',
    },
    // openGraph uit de root layout wordt hier volledig vervangen, niet samengevoegd
    openGraph: {
      type: 'website',
      locale: 'nl_NL',
      siteName: 'De WMC',
      title: `${highlights.titel} | De WMC`,
      description,
      url: 'https://dewmc.nl/beurs-2026',
      images: [
        cover
          ? {
              url: `https:${cover.fields.file.url}?w=1200&h=630&fit=fill&fm=jpg&q=80`,
              width: 1200,
              height: 630,
              alt: cover.fields.description || cover.fields.title || highlights.titel,
            }
          : { url: '/og-image.jpg', width: 1200, height: 630, alt: 'De WMC — Westfriese Modelspoor Club' },
      ],
    },
  }
}

export default async function BeursHighlightsPage() {
  if (!showBeursPage) notFound()

  const highlights = await getBeursHighlights()
  const [layouts, sponsors] = await Promise.all([
    highlights.toonBanen ? getAllBeursLayouts() : [],
    highlights.toonSponsoren ? getSponsors() : [],
  ])
  const sponsorsWithLogo = sponsors.filter((sponsor) => sponsor.logo?.fields?.file?.url)
  const links = await Promise.all(
    highlights.links.map(async (link) => ({ link, preview: await getLinkPreview(link.url) }))
  )

  const hasStory = hasContent(highlights.verhaal)
  const hasPhotos = highlights.fotos.length > 0
  const hasLinks = links.length > 0

  return (
    <>
      <PageHero
        eyebrow="Terugblik · 17 & 18 oktober 2026"
        title={highlights.titel}
        lead={highlights.intro}
      >
        {hasPhotos && (
          <Button href="#fotos" size="lg" skewed>
            <span>Bekijk de foto&apos;s</span>
            <ArrowRight size={18} />
          </Button>
        )}
      </PageHero>

      {/* ===== TERUGBLIK ===== */}
      {hasStory && (
        <section className="bg-white py-16 md:py-20 border-b border-[#e2e2e2]">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <Eyebrow className="mb-6">Terugblik</Eyebrow>
            <div className="text-base md:text-lg">
              <RichText document={highlights.verhaal as unknown as Document} />
            </div>
          </div>
        </section>
      )}

      {/* ===== FOTOGALERIJ ===== */}
      <section id="fotos" className="bg-[#f3f3f3] py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Images size={18} className="text-[#cc0000]" />
            <h2 className="font-black text-2xl md:text-3xl tracking-tight text-[#1a1c1c]">
              Fotogalerij
            </h2>
            {hasPhotos && (
              <span className="text-sm text-[#926e69] font-bold ml-1">
                {highlights.fotos.length} foto&apos;s
              </span>
            )}
          </div>

          {hasPhotos ? (
            <PhotoGallery photos={highlights.fotos} fallbackAlt="WMC Beurs 2026" />
          ) : (
            <div className="bg-white border border-[#e2e2e2] p-16 text-center">
              <Camera size={40} className="mx-auto text-[#e2e2e2] mb-4" />
              <p className="font-headline font-black text-xl text-[#1a1c1c] mb-2">
                Foto&apos;s volgen binnenkort
              </p>
              <p className="text-sm text-[#926e69] max-w-sm mx-auto">
                We zijn de mooiste foto&apos;s van de beurs aan het uitzoeken. Kom snel nog eens kijken.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== LINKS ===== */}
      {hasLinks && (
        <section className="bg-white py-20 border-t border-[#e2e2e2]">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <ScrollReveal className="mb-10">
              <Eyebrow className="mb-4">Links</Eyebrow>
              <h2 className="font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1c]">
                {highlights.linksKop || 'Meer zien'}
              </h2>
            </ScrollReveal>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map(({ link, preview }) => (
                <li key={link.id}>
                  <LinkCard
                    url={link.url}
                    label={link.label}
                    description={link.omschrijving || preview.description}
                    siteName={preview.siteName}
                    image={
                      link.afbeelding
                        ? { src: `https:${link.afbeelding.fields.file.url}?w=800&h=420&fit=fill&f=center&fm=webp&q=80`, external: false }
                        : preview.image
                          ? { src: preview.image, external: true }
                          : undefined
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ===== DEZE BANEN WAREN TE ZIEN ===== */}
      {layouts.length > 0 && (
        <section className="bg-[#f3f3f3] py-20 border-t border-[#e2e2e2]">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <ScrollReveal className="mb-12">
              <Eyebrow className="mb-4">Gastclubs</Eyebrow>
              <h2 className="font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1c]">
                Deze banen waren te zien
              </h2>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {layouts.map((layout) => (
                <StaggerItem key={layout.id}>
                  <TiltCard className="h-full" intensity={3}>
                    <LayoutCard layout={layout} />
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ===== SPONSOREN ===== */}
      {sponsorsWithLogo.length > 0 && (
        <section className="bg-white py-20 border-t border-[#e2e2e2]">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <ScrollReveal className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <Eyebrow className="mb-4">Sponsoren</Eyebrow>
                <h2 className="font-black text-4xl md:text-5xl tracking-tighter text-[#1a1c1c]">
                  Met dank aan onze sponsoren
                </h2>
              </div>
              <Button href="/sponsoren" variant="outline" size="sm">
                Alle sponsoren
                <ArrowRight size={14} />
              </Button>
            </ScrollReveal>

            <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-[#e2e2e2] border border-[#e2e2e2]">
              {sponsorsWithLogo.map((sponsor) => (
                <li key={sponsor.id} className="relative h-28 bg-white">
                  <Image
                    src={`https:${sponsor.logo.fields.file.url}?w=400&fit=fill&f=center&fm=webp`}
                    alt={sponsor.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-contain p-5"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="bg-[#1a1c1c] py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <p className="font-headline font-black text-2xl text-white tracking-tight">
            Zelf ook meebouwen aan de volgende beurs?
          </p>
          <Button href="/contact" skewed>
            <span>Word lid van de WMC</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </>
  )
}
