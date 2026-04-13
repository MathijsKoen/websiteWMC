import { defineStackbitConfig, SiteMapEntry } from '@stackbit/types'

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'nextjs',
  nodeVersion: '20',

  // Welke content-modellen zijn "pagina's" (hebben een eigen URL)
  modelExtensions: [
    { name: 'newsArticle',  type: 'page', urlPath: '/nieuws/{slug}' },
    { name: 'agendaEvent',  type: 'page', urlPath: '/agenda/{slug}' },
    { name: 'track',        type: 'page', urlPath: '/onze-banen/{slug}' },
    { name: 'beursLayout',  type: 'page', urlPath: '/beurs-2026/{slug}' },
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
