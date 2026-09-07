import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal'
import { TiltCard } from '@/components/ui/TiltCard'
import { PageHero } from '@/components/ui/PageHero'
import { getAllTracks } from '@/lib/contentful/queries'

export const metadata: Metadata = {
  title: 'Onze Banen',
  description:
    'Ontdek de zes unieke modelspoorbanen van De WMC: van N-schaal tot 0-schaal. Elke groep heeft zijn eigen specialiteit en stijl.',
}

// Revalideer elke 60 minuten
export const revalidate = 60

export default async function OnzeBanenPage() {
  const tracks = await getAllTracks()

  return (
    <>
      <PageHero
        eyebrow={`${tracks.length} actieve groepen`}
        title="Onze Banen"
        lead={`De WMC telt ${tracks.length} actieve groepen, elk met hun eigen specialiteit. Van de fijngevoelige N-schaal (1:160) tot de imposante 0-schaal (1:43,5) — voor elke modelspoorliefhebber is er een plek.`}
      />

      {/* Tracks grid */}
      <section className="bg-[#f3f3f3] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {tracks.length === 0 ? (
            <div className="bg-white border-l-4 border-[#e2e2e2] p-12 text-center">
              <p className="text-[#926e69] text-sm font-bold uppercase tracking-widest">
                Geen banen gevonden
              </p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#e2e2e2]">
              {tracks.map((track) => (
                <StaggerItem key={track.slug}>
                <TiltCard className="h-full">
                <Link
                  href={`/onze-banen/${track.slug}`}
                  className="group bg-white p-8 flex flex-col gap-6 hover:bg-[#cc0000]/5 transition-colors duration-200 h-full block"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000] block mb-1">
                        {track.scale}
                      </span>
                      <h2 className="font-black text-2xl tracking-tight text-[#1a1c1c] group-hover:text-[#cc0000] transition-colors">
                        {track.name}
                      </h2>
                      <p className="text-sm text-[#926e69] mt-0.5">{track.groupName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
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
                      <Badge>{track.system}</Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[#4d4c4c] text-sm leading-relaxed flex-1">
                    {track.shortDescription}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {track.scale && (
                      <span className="px-3 py-1 text-xs font-bold bg-[#f3f3f3] text-[#4d4c4c] border-l-2 border-[#cc0000]">
                        {track.scale}
                      </span>
                    )}
                    {track.system && (
                      <span className="px-3 py-1 text-xs font-bold bg-[#f3f3f3] text-[#4d4c4c] border-l-2 border-[#cc0000]">
                        {track.system}
                      </span>
                    )}
                    {track.foundedYear && (
                      <span className="px-3 py-1 text-xs font-bold bg-[#f3f3f3] text-[#4d4c4c] border-l-2 border-[#cc0000]">
                        Gestart {track.foundedYear}
                      </span>
                    )}
                    {track.moduleCount && (
                      <span className="px-3 py-1 text-xs font-bold bg-[#f3f3f3] text-[#4d4c4c] border-l-2 border-[#cc0000]">
                        {track.moduleCount} modules
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end pt-4 border-t border-[#e8e8e8]">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Meer informatie
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
                </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </>
  )
}
