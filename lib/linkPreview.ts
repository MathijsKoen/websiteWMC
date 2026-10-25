export interface LinkPreview {
  title?: string
  description?: string
  image?: string
  siteName: string
}

const ONE_DAY = 86400
const TIMEOUT_MS = 5000
// Alleen de <head> is nodig; grote pagina's kappen we hier af
const MAX_HTML_LENGTH = 300_000

function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim()
}

/** Leest <meta property|name="key" content="…"> in beide attribuutvolgordes. */
function readMeta(html: string, key: string): string | undefined {
  const k = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${k}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${k}["']`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return decodeEntities(match[1]) || undefined
  }
  return undefined
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/**
 * Haalt titel, omschrijving en afbeelding (Open Graph) van een externe pagina op,
 * zoals WhatsApp en Contentful dat ook doen. Resultaat wordt een dag gecachet.
 * Mislukt het (timeout, inlogmuur, geen HTML), dan blijft alleen de sitenaam over.
 */
export async function getLinkPreview(url: string): Promise<LinkPreview> {
  const fallback: LinkPreview = { siteName: hostnameOf(url) }
  if (!/^https?:\/\//i.test(url)) return fallback

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DeWMC-LinkPreview/1.0; +https://dewmc.nl)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: ONE_DAY, tags: ['link-preview'] },
    })
    if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) return fallback

    const html = (await response.text()).slice(0, MAX_HTML_LENGTH)
    const rawImage = readMeta(html, 'og:image:secure_url') ?? readMeta(html, 'og:image') ?? readMeta(html, 'twitter:image')

    let image: string | undefined
    if (rawImage) {
      try {
        const resolved = new URL(rawImage, response.url || url)
        if (resolved.protocol === 'https:') image = resolved.toString()
      } catch {
        // ongeldige afbeeldings-URL: geen afbeelding tonen
      }
    }

    return {
      title: readMeta(html, 'og:title') ?? html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim(),
      description: readMeta(html, 'og:description') ?? readMeta(html, 'description'),
      image,
      siteName: readMeta(html, 'og:site_name') ?? fallback.siteName,
    }
  } catch {
    return fallback
  }
}
