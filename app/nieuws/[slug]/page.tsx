import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { RichText } from '@/components/ui/RichText'
import { getAllNews, getNewsBySlug } from '@/lib/contentful/queries'
import type { Document } from '@contentful/rich-text-types'
import type { ContentfulImage } from '@/lib/contentful/types'

export const revalidate = 1

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

      {/* Hero */}
      <section className="bg-[#1a1c1c] text-white relative overflow-hidden">
        {coverImage && (
          <div className="absolute inset-0">
            <Image
              src={`https:${coverImage.fields.file.url}?w=1600&h=600&fit=fill&f=center`}
              alt={article.title}
              fill
              priority
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1c1c] via-[#1a1c1c]/80 to-transparent" />
          </div>
        )}
        <div className="absolute top-0 right-0 w-1/4 h-full bg-[#cc0000]/10 skew-x-[-15deg] translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#cc0000]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#cc0000]">
              Nieuws
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {article.category && <Badge variant="primary">{article.category}</Badge>}
            <time
              dateTime={article.publishedAt}
              className="text-xs text-white/50 flex items-center gap-1"
            >
              <Calendar size={12} />
              {new Date(article.publishedAt).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>
          <h1
            className="font-black text-4xl md:text-5xl tracking-tighter max-w-3xl"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {article.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main body */}
            <div className="lg:col-span-2">
              {article.body ? (
                <RichText document={article.body as unknown as Document} />
              ) : (
                <p className="text-[#4d4c4c] leading-relaxed text-lg">{article.summary}</p>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-[#f3f3f3] border-l-4 border-[#cc0000] p-6">
                <h3
                  className="font-black text-sm uppercase tracking-widest text-[#1a1c1c] mb-3"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Samenvatting
                </h3>
                <p className="text-sm text-[#4d4c4c] leading-relaxed">{article.summary}</p>
              </div>

              <div className="bg-[#f3f3f3] p-6 space-y-3">
                <h3
                  className="font-black text-sm uppercase tracking-widest text-[#1a1c1c] mb-3"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
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
