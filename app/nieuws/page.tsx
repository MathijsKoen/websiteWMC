import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { PageHero } from '@/components/ui/PageHero'
import { getAllNews } from '@/lib/contentful/queries'

export const metadata: Metadata = {
  title: 'Nieuws',
  description:
    'Het laatste nieuws van De Westfriese Modelspoor Club: beurzen, evenementen en updates over onze banen.',
}

export const revalidate = 60

export default async function NieuwsPage() {
  const articles = await getAllNews()

  return (
    <>
      <PageHero
        eyebrow="Laatste nieuws"
        title="Nieuws"
        lead="Beurzen, open dagen en updates over onze banen — hier lees je waar de club mee bezig is."
      />

      {/* Articles */}
      <section className="bg-[#f3f3f3] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {articles.length === 0 ? (
            <div className="bg-white p-12 text-center border-l-4 border-[#e2e2e2]">
              <p className="text-[#926e69] text-sm font-bold uppercase tracking-widest">
                Geen nieuwsberichten gevonden
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#e2e2e2]">
              {articles.map((article) => (
                <article key={article.id}>
                  <Link
                    href={`/nieuws/${article.slug}`}
                    className="group bg-white p-8 border-l-4 border-[#cc0000] flex flex-col gap-4 h-full hover:bg-[#fafafa] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {article.category && (
                        <Badge variant="primary">{article.category}</Badge>
                      )}
                      <time
                        dateTime={article.publishedAt}
                        className="text-xs text-[#926e69] flex items-center gap-1"
                      >
                        <Calendar size={12} />
                        {new Date(article.publishedAt).toLocaleDateString('nl-NL', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                    <h2 className="font-black text-2xl tracking-tight text-[#1a1c1c] group-hover:text-[#cc0000] transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-[#4d4c4c] text-sm leading-relaxed flex-1">
                      {article.summary}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#cc0000] group-hover:gap-2 transition-all">
                      Lees meer <ArrowRight size={12} />
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
