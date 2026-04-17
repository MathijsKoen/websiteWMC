import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getSponsors } from '@/lib/contentful/queries'
import type { Sponsor } from '@/lib/contentful/types'

export const metadata: Metadata = {
  title: 'Sponsoren',
  description:
    'Bekijk de sponsoren en partners die De Westfriese Modelspoor Club ondersteunen.',
}

export const revalidate = 60

type SponsorGroup = 'gold' | 'silver' | 'bronze' | 'onbekend'

const tierLabels: Record<SponsorGroup, string> = {
  gold: 'Hoofdsponsors',
  silver: 'Partners',
  bronze: 'Ondersteuners',
  onbekend: 'Overige sponsors',
}

const tierStyles: Record<SponsorGroup, string> = {
  gold: 'bg-[#cc0000] text-white',
  silver: 'bg-[#1a1c1c] text-white',
  bronze: 'bg-[#926e69] text-white',
  onbekend: 'bg-[#f3f3f3] text-[#1a1c1c]',
}

function getSponsorGroup(sponsor: Sponsor): SponsorGroup {
  return sponsor.tier ?? 'onbekend'
}

function getLogoUrl(sponsor: Sponsor) {
  const url = sponsor.logo?.fields.file.url
  return url ? `https:${url}?w=600&fit=fill&f=center` : null
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const logoUrl = getLogoUrl(sponsor)
  const group = getSponsorGroup(sponsor)
  const content = (
    <>
      <div className="h-44 bg-[#f9f9f9] relative flex items-center justify-center p-6">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={sponsor.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-3">
            <Sparkles size={28} className="text-[#e2e2e2]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#926e69]">Logo volgt</span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="primary">{tierLabels[group]}</Badge>
            {sponsor.tier && (
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${tierStyles[group]}`}>
                {sponsor.tier}
              </span>
            )}
          </div>
          <h2
            className="font-black text-2xl tracking-tight text-[#1a1c1c] group-hover:text-[#cc0000] transition-colors"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {sponsor.name}
          </h2>
        </div>

        <div className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#cc0000]">
          {sponsor.website ? 'Bezoek website' : 'Website niet beschikbaar'}
          {sponsor.website && <ExternalLink size={12} />}
        </div>
      </div>
    </>
  )

  if (sponsor.website) {
    return (
      <a
        href={sponsor.website}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#cc0000] focus-visible:ring-offset-2"
      >
        <article className="group bg-white border border-[#e2e2e2] hover:border-[#cc0000] transition-colors duration-200 overflow-hidden flex flex-col">
          {content}
        </article>
      </a>
    )
  }

  return (
    <article className="group bg-white border border-[#e2e2e2] hover:border-[#cc0000] transition-colors duration-200 overflow-hidden flex flex-col">
      {content}
    </article>
  )
}

export default async function SponsorenPage() {
  const sponsors = await getSponsors()
  const groupedSponsors = sponsors.reduce<Record<SponsorGroup, Sponsor[]>>(
    (accumulator, sponsor) => {
      const group = getSponsorGroup(sponsor)
      accumulator[group].push(sponsor)
      return accumulator
    },
    { gold: [], silver: [], bronze: [], onbekend: [] }
  )

  const visibleGroups = (['gold', 'silver', 'bronze', 'onbekend'] as SponsorGroup[]).filter(
    (group) => groupedSponsors[group].length > 0
  )

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1a1c1c] text-white overflow-hidden min-h-[60vh] flex items-center">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 50%),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#cc0000]/10 skew-x-[-15deg] translate-x-1/4" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-24 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#cc0000]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                Met dank aan onze partners
              </span>
            </div>
            <h1
              className="font-black text-5xl md:text-6xl lg:text-7xl tracking-tighter mb-6"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Sponsoren
            </h1>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
              Deze bedrijven en partners helpen De WMC bij het bouwen, onderhouden en presenteren
              van onze modelspoorbanen. Zonder hun steun was een deel van het werk simpelweg niet
              mogelijk.
            </p>
          </div>
        </div>
      </section>

      {/* Intro strip */}
      <section className="bg-[#cc0000] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">
              Sponsoren en partners
            </p>
            <p className="text-sm md:text-base font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {sponsors.length} {sponsors.length === 1 ? 'sponsor' : 'sponsoren'} zichtbaar in Contentful
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-white/80 transition-colors"
          >
            Word sponsor of neem contact op
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Sponsors */}
      <section className="bg-[#f3f3f3] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {sponsors.length === 0 ? (
            <div className="bg-white border-l-4 border-[#e2e2e2] p-12 text-center">
              <p className="text-[#926e69] text-sm font-bold uppercase tracking-widest mb-3">
                Nog geen sponsoren gevonden
              </p>
              <p className="text-[#4d4c4c] text-sm leading-relaxed max-w-xl mx-auto mb-8">
                Voeg een sponsor toe in Contentful met de content type <span className="font-bold text-[#1a1c1c]">Sponsor</span> en vul ten minste een naam en logo in.
              </p>
              <Button href="/contact" skewed>
                <span>Interesse? Neem contact op</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          ) : (
            <div className="space-y-14">
              {visibleGroups.map((group) => (
                <section key={group}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-0.5 bg-[#cc0000]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
                      {tierLabels[group]}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {groupedSponsors[group].map((sponsor) => (
                      <SponsorCard key={sponsor.id} sponsor={sponsor} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
