import { defineStackbitConfig, SiteMapEntry } from '@stackbit/types'
import { ContentfulContentSource } from '@stackbit/cms-contentful'

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'nextjs',
  nodeVersion: '18',

  contentSources: [
    new ContentfulContentSource({
      spaceId: process.env['CONTENTFUL_SPACE_ID']!,
      environment: process.env['CONTENTFUL_ENVIRONMENT'] ?? 'master',
      previewToken: process.env['CONTENTFUL_PREVIEW_TOKEN']!,
      accessToken: process.env['CONTENTFUL_MANAGEMENT_TOKEN']!,
    }),
  ],

  // Welke modellen vertegenwoordigen pagina's (met een eigen URL)
  modelExtensions: [
    // Nieuws artikelen: /nieuws/[slug]
    {
      name: 'newsArticle',
      type: 'page',
      urlPath: '/nieuws/{slug}',
    },
    // Agenda evenementen: /agenda/[slug]
    {
      name: 'agendaEvent',
      type: 'page',
      urlPath: '/agenda/{slug}',
    },
    // Banen / tracks: /onze-banen/[slug]
    {
      name: 'track',
      type: 'page',
      urlPath: '/onze-banen/{slug}',
    },
    // Beurs 2026 banen: /beurs-2026/[slug]
    {
      name: 'beursLayout',
      type: 'page',
      urlPath: '/beurs-2026/{slug}',
    },
  ],

  // Volledige siteMap voor de visuele editor
  siteMap: ({ documents, models }) => {
    const pageModelNames = models
      .filter((m) => m.type === 'page')
      .map((m) => m.name)

    const entries: (SiteMapEntry | null)[] = documents
      .filter((doc) => pageModelNames.includes(doc.modelName))
      .map((document) => {
        const slug = (document.fields?.['slug'] as { value?: string } | undefined)?.value

        switch (document.modelName) {
          case 'newsArticle':
            return {
              stableId: document.id,
              urlPath: `/nieuws/${slug ?? document.id}`,
              document,
              isHomePage: false,
            }
          case 'agendaEvent':
            return {
              stableId: document.id,
              urlPath: `/agenda/${slug ?? document.id}`,
              document,
              isHomePage: false,
            }
          case 'track':
            return {
              stableId: document.id,
              urlPath: `/onze-banen/${slug ?? document.id}`,
              document,
              isHomePage: false,
            }
          case 'beursLayout':
            return {
              stableId: document.id,
              urlPath: `/beurs-2026/${slug ?? document.id}`,
              document,
              isHomePage: false,
            }
          default:
            return null
        }
      })

    return entries.filter(Boolean) as SiteMapEntry[]
  },
})
