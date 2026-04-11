import { createClient, type ContentfulClientApi } from 'contentful'

let _client: ContentfulClientApi<undefined> | null = null

export function getContentfulClient(): ContentfulClientApi<undefined> {
  if (_client) return _client
  const spaceId = process.env['CONTENTFUL_SPACE_ID']
  const accessToken = process.env['CONTENTFUL_ACCESS_TOKEN']

  if (!spaceId || !accessToken) {
    throw new Error(
      'Contentful env vars ontbreken: CONTENTFUL_SPACE_ID en CONTENTFUL_ACCESS_TOKEN zijn vereist.'
    )
  }
  _client = createClient({
    space: spaceId,
    accessToken,
  })
  return _client
}
