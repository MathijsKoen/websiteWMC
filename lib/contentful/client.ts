import { createClient, type ContentfulClientApi } from 'contentful'

let _client: ContentfulClientApi<undefined> | null = null

export function getContentfulClient(): ContentfulClientApi<undefined> {
  if (_client) return _client
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    throw new Error(
      'Contentful env vars ontbreken: CONTENTFUL_SPACE_ID en CONTENTFUL_ACCESS_TOKEN zijn vereist.'
    )
  }
  _client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  })
  return _client
}
