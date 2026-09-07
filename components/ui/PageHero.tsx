import Image from 'next/image'
import type { ReactNode } from 'react'
import { Eyebrow } from './Eyebrow'

interface PageHeroProps {
  /** Klein label boven de titel — tekst of een eigen element (bijv. een Badge). */
  eyebrow?: ReactNode
  title: ReactNode
  /** Inleidende alinea onder de titel. */
  lead?: ReactNode
  /** Extra inhoud onder de titel: metaregels, badges, knoppen. */
  children?: ReactNode
  /** Achtergrondafbeelding; wordt gedempt achter een verloop gezet. */
  image?: { src: string; alt: string }
  /** Stackbit-annotaties voor de contentwrapper en de titel. */
  contentProps?: Record<string, string>
  titleProps?: Record<string, string>
}

/**
 * Paginakop op een donkere ondergrond.
 *
 * Vaste hoogte met verticaal gecentreerde inhoud, zodat elke pagina dezelfde
 * kop krijgt ongeacht de lengte van de titel. Het zwart is niet egaal: twee
 * zeer zachte radialen leggen licht linksboven — waar de tekst staat — en een
 * warme zweem rechtsboven.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  image,
  contentProps,
  titleProps,
}: PageHeroProps) {
  return (
    <section className="relative flex min-h-[24rem] md:min-h-[28rem] items-center overflow-hidden bg-[#1a1c1c] text-white">
      {image ? (
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={image.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#1a1c1c]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1c1c] via-[#1a1c1c]/85 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#1a1c1c] to-transparent" />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(100% 120% at 0% 0%, rgba(255,255,255,0.05), transparent 55%),' +
              'radial-gradient(85% 115% at 100% 15%, rgba(204,0,0,0.20), transparent 62%)',
          }}
        />
      )}

      <div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20"
        {...contentProps}
      >
        <div className="max-w-3xl">
          {eyebrow &&
            (typeof eyebrow === 'string' ? (
              <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
            ) : (
              <div className="mb-5">{eyebrow}</div>
            ))}

          <h1
            className="font-headline font-black text-4xl sm:text-5xl md:text-6xl leading-[0.98] tracking-[-0.03em] text-balance"
            {...titleProps}
          >
            {title}
          </h1>

          {lead && (
            <p className="mt-6 text-white/70 text-lg leading-relaxed text-pretty">{lead}</p>
          )}

          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>

      {/* Rode afsluiting: één strakke lijn die op elke pagina terugkomt en de
          donkere kop scheidt van de witte inhoud eronder. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-20 h-1 bg-[#cc0000]" />
    </section>
  )
}
