import { defineStackbitConfig, SiteMapEntry } from '@stackbit/types'
import { ContentfulContentSource } from '@stackbit/cms-contentful'

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'nextjs',
  nodeVersion: '20',

  devCommand: 'node_modules/.bin/next dev --port {PORT}',

  contentSources: [
    new ContentfulContentSource({
      spaceId: process.env['CONTENTFUL_SPACE_ID']!,
      environment: process.env['CONTENTFUL_ENVIRONMENT'] ?? 'master',
      previewToken: process.env['CONTENTFUL_PREVIEW_TOKEN']!,
      accessToken: process.env['CONTENTFUL_MANAGEMENT_TOKEN']!,
    }),
  ],

  modelExtensions: [
    // Pagina-modellen (hebben een eigen URL)
    { name: 'newsArticle',  type: 'page', urlPath: '/nieuws/{slug}' },
    { name: 'agendaEvent',  type: 'page', urlPath: '/agenda/{slug}' },
    { name: 'track',        type: 'page', urlPath: '/onze-banen/{slug}' },
    { name: 'beursLayout',  type: 'page', urlPath: '/beurs-2026/{slug}' },
    // Data-modellen (geen eigen URL, globale instellingen)
    { name: 'siteSettings', type: 'data' },
  ],

  // siteMap vertelt de editor welke pagina's bestaan en wat hun URL is
  siteMap: ({ documents, models }): SiteMapEntry[] => {
    const pageModelNames = new Set(
      models.filter((m) => m.type === 'page').map((m) => m.name)
    )

    return documents
      .filter((doc) => pageModelNames.has(doc.modelName))
      .flatMap((document) => {
        const slugField = document.fields?.['slug']
        const slug =
          slugField && typeof slugField === 'object' && 'value' in slugField
            ? String(slugField.value)
            : document.id

        switch (document.modelName) {
          case 'newsArticle':
            return [{
              stableId: document.id,
              urlPath: `/nieuws/${slug}`,
              document,
              isHomePage: false,
            }]
          case 'agendaEvent':
            return [{
              stableId: document.id,
              urlPath: `/agenda/${slug}`,
              document,
              isHomePage: false,
            }]
          case 'track':
            return [{
              stableId: document.id,
              urlPath: `/onze-banen/${slug}`,
              document,
              isHomePage: false,
            }]
          case 'beursLayout':
            return [{
              stableId: document.id,
              urlPath: `/beurs-2026/${slug}`,
              document,
              isHomePage: false,
            }]
          default:
            return []
        }
      })
  },
})
