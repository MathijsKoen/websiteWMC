import { createClient, type ContentfulClientApi } from 'contentful'

let _client: ContentfulClientApi<undefined> | null = null
let _previewClient: ContentfulClientApi<undefined> | null = null

export function getContentfulClient(): ContentfulClientApi<undefined> {
  if (_client) return _client
  const spaceId = process.env['CONTENTFUL_SPACE_ID']
  const accessToken = process.env['CONTENTFUL_ACCESS_TOKEN']

  if (!spaceId || !accessToken) {
    throw new Error(
      'Contentful env vars ontbreken: CONTENTFUL_SPACE_ID en CONTENTFUL_ACCESS_TOKEN zijn vereist.'
    )
  }
  _client = createClient({ space: spaceId, accessToken })
  return _client
}

/** Preview client: gebruikt de Preview API zodat ongepubliceerde content zichtbaar is in de visual editor. */
export function getContentfulPreviewClient(): ContentfulClientApi<undefined> {
  if (_previewClient) return _previewClient
  const spaceId = process.env['CONTENTFUL_SPACE_ID']
  const previewToken = process.env['CONTENTFUL_PREVIEW_TOKEN']

  if (!spaceId || !previewToken) {
    // Val terug op de gewone client als er geen preview token is
    return getContentfulClient()
  }
  _previewClient = createClient({
    space: spaceId,
    accessToken: previewToken,
    host: 'preview.contentful.com',
  })
  return _previewClient
}
