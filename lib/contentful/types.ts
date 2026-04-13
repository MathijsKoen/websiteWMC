// =============================================
// CONTENTFUL DATA MODELS — De WMC
// =============================================

export interface ContentfulImage {
  fields: {
    title: string
    description?: string
    file: {
      url: string
      details: {
        size: number
        image?: {
          width: number
          height: number
        }
      }
      fileName: string
      contentType: string
    }
  }
}

export interface ContentfulRichText {
  nodeType: string
  content: unknown[]
}

// =============================================
// NEWS / NIEUWSBERICHTEN
// =============================================

export interface NewsArticle {
  id: string
  title: string
  slug: string
  summary: string
  body: ContentfulRichText
  coverImage?: ContentfulImage
  publishedAt: string
  category?: string
}

export interface ContentfulNewsEntry {
  sys: { id: string; createdAt: string; updatedAt: string }
  fields: {
    title: string
    slug: string
    summary: string
    body: ContentfulRichText
    coverImage?: ContentfulImage
    publishedAt?: string
    category?: string
  }
}

// =============================================
// AGENDA / EVENTS
// =============================================

export type EventCategory = 'beurs' | 'opendag' | 'clubavond' | 'overig'

export interface AgendaEvent {
  id: string
  title: string
  slug: string
  date: string
  endDate?: string
  startTime: string
  endTime?: string
  location: string
  description?: string
  category: EventCategory
  price?: number
  isPublic: boolean
}

export interface ContentfulEventEntry {
  sys: { id: string; createdAt: string }
  fields: {
    title: string
    slug: string
    date: string
    endDate?: string
    startTime: string
    endTime?: string
    location: string
    description?: string
    category: EventCategory
    price?: number
    isPublic: boolean
  }
}

// =============================================
// BANEN / TRACKS
// =============================================

export type TrackScale = 'N (1:160)' | 'H0 (1:87)' | '0 (1:43,5)' | 'overig'
export type TrackSystem = 'Digitaal' | 'Analoog' | 'Gemengd'

export interface TrackInfo {
  id: string
  name: string
  slug: string
  groupName: string
  scale: TrackScale
  system: TrackSystem
  description: ContentfulRichText
  shortDescription: string
  coverImage?: ContentfulImage
  images?: ContentfulImage[]
  status?: string
  foundedYear?: number
  moduleCount?: number
}

export interface ContentfulTrackEntry {
  sys: { id: string }
  fields: {
    name: string
    slug: string
    groupName: string
    scale: TrackScale
    system: TrackSystem
    description: ContentfulRichText
    shortDescription: string
    coverImage?: ContentfulImage
    images?: ContentfulImage[]
    status?: string
    foundedYear?: number
    moduleCount?: number
  }
}

// =============================================
// BEURS 2026 — UITGENODIGDE BANEN
// =============================================

export interface BeursLayout {
  id: string
  name: string
  slug: string
  club: string
  city: string
  scale?: string
  description?: string
  coverImage?: ContentfulImage
  images?: ContentfulImage[]
  website?: string
}

// =============================================
// SITE SETTINGS
// =============================================

export interface TimelineItem {
  year: string
  event: string
}

export interface SiteSettings {
  id: string
  email: string
  adres: string
  postcode: string
  stad: string
  provincie: string
  openingsDag: string
  openingsTijd: string
  contributie: number
  contributieJaar: number
  lidWordenStappen: string[]
  overOnsIntro: string
  geschiedenisAlineas: string[]
  doelstellingen: string[]
  tijdlijn: TimelineItem[]
}

// =============================================
// SPONSOR
// =============================================

export interface Sponsor {
  id: string
  name: string
  logo: ContentfulImage
  website?: string
  tier?: 'gold' | 'silver' | 'bronze'
}
