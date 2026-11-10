'use client'

type LoaderProps = { src: string; width: number; quality?: number }

export default function contentfulLoader({ src, width, quality }: LoaderProps) {
  // Lokale afbeeldingen uit /public ongewijzigd laten
  if (src.startsWith('/') && !src.startsWith('//')) return `${src}?w=${width}`

  const url = new URL(src.startsWith('//') ? `https:${src}` : src)

  // Alleen images.ctfassets.net ondersteunt de Images API
  if (url.hostname !== 'images.ctfassets.net') return url.href

  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality ?? 75))
  url.searchParams.set('fm', 'webp')
  return url.href
}