import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHero } from '@/components/ui/PageHero'
import { RichText } from '@/components/ui/RichText'
import { getAllNews, getNewsBySlug } from '@/lib/contentful/queries'
import type { Document } from '@contentful/rich-text-types'
import type { ContentfulImage } from '@/lib/contentful/types'
import { sbObject, sbField } from '@/lib/stackbit'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const articles = await getAllNews()
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsBySlug(slug)
  if (!article) return { title: 'Artikel niet gevonden' }
  return {
    title: article.title,
    description: article.summary,
    alternates: {
      canonical: `https://dewmc.nl/nieuws/${slug}`,
    },
  }
}

export default async function NieuwsDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await getNewsBySlug(slug)

  if (!article) notFound()

  const coverImage = article.coverImage as ContentfulImage | undefined

  return (
    <>
      {/* Back link */}
      <div className="bg-[#f9f9f9] border-b border-[#e2e2e2]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
          <Link
            href="/nieuws"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#926e69] hover:text-[#cc0000] transition-colors"
          >
            <ArrowLeft size={14} />
            Alle nieuws
          </Link>
        </div>
      </div>

      <PageHero
        eyebrow="Nieuws"
        title={article.title}
        contentProps={sbObject(article.id)}
        titleProps={sbField(article.id, 'title')}
        image={
          coverImage
            ? {
                src: `https:${coverImage.fields.file.url}?w=1600&h=600&fit=fill&f=center`,
                alt: article.title,
              }
            : undefined
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          {article.category && (
            <span {...sbField(article.id, 'category')}>
              <Badge variant="primary">{article.category}</Badge>
            </span>
          )}
          <time
            dateTime={article.publishedAt}
            className="text-xs text-white/60 flex items-center gap-1.5"
            {...sbField(article.id, 'publishedAt')}
          >
            <Calendar size={12} />
            {new Date(article.publishedAt).toLocaleDateString('nl-NL', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </div>
      </PageHero>

      {/* Content */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main body */}
            <div className="lg:col-span-2" {...sbField(article.id, 'body')}>
              {article.body ? (
                <RichText document={article.body as unknown as Document} />
              ) : (
                <p className="text-[#4d4c4c] leading-relaxed text-lg">{article.summary}</p>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-[#f3f3f3] border-l-4 border-[#cc0000] p-6">
                <h3 className="font-black text-sm uppercase tracking-widest text-[#1a1c1c] mb-3">
                  Samenvatting
                </h3>
                <p className="text-sm text-[#4d4c4c] leading-relaxed" {...sbField(article.id, 'summary')}>{article.summary}</p>
              </div>

              <div className="bg-[#f3f3f3] p-6 space-y-3">
                <h3 className="font-black text-sm uppercase tracking-widest text-[#1a1c1c] mb-3">
                  Details
                </h3>
                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#926e69]">
                    Datum
                  </span>
                  <span className="text-sm font-bold text-[#1a1c1c]">
                    {new Date(article.publishedAt).toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {article.category && (
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#926e69]">
                      Categorie
                    </span>
                    <span className="text-sm font-bold text-[#1a1c1c]">{article.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back CTA */}
      <section className="bg-[#f3f3f3] py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Button href="/nieuws" variant="secondary">
            <ArrowLeft size={16} />
            Alle nieuwsberichten
          </Button>
          <Button href="/contact" skewed>
            <span>Neem contact op</span>
          </Button>
        </div>
      </section>
    </>
  )
}
