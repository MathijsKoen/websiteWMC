import type { EntrySkeletonType, EntryFieldTypes } from 'contentful'
import { getContentfulClient } from './client'
import type { NewsArticle, AgendaEvent, TrackInfo, Sponsor, BeursLayout } from './types'

// =============================================
// ENTRY SKELETON TYPES (Contentful SDK v11)
// =============================================

interface NewsArticleSkeleton extends EntrySkeletonType {
  contentTypeId: 'newsArticle'
  fields: {
    title: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    summary: EntryFieldTypes.Text
    body: EntryFieldTypes.RichText
    coverImage?: EntryFieldTypes.AssetLink
    publishedAt?: EntryFieldTypes.Date
    category?: EntryFieldTypes.Symbol
  }
}

interface AgendaEventSkeleton extends EntrySkeletonType {
  contentTypeId: 'agendaEvent'
  fields: {
    title: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    date: EntryFieldTypes.Date
    endDate?: EntryFieldTypes.Date
    startTime: EntryFieldTypes.Symbol
    endTime?: EntryFieldTypes.Symbol
    location: EntryFieldTypes.Symbol
    description?: EntryFieldTypes.Text
    category: EntryFieldTypes.Symbol
    price?: EntryFieldTypes.Number
    isPublic: EntryFieldTypes.Boolean
  }
}

interface TrackSkeleton extends EntrySkeletonType {
  contentTypeId: 'track'
  fields: {
    name: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    groupName: EntryFieldTypes.Symbol
    scale: EntryFieldTypes.Symbol
    system: EntryFieldTypes.Symbol
    description: EntryFieldTypes.RichText
    shortDescription: EntryFieldTypes.Text
    coverImage?: EntryFieldTypes.AssetLink
    images?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>
    status?: EntryFieldTypes.Symbol
    foundedYear?: EntryFieldTypes.Integer
    moduleCount?: EntryFieldTypes.Integer
  }
}

interface BeursLayoutSkeleton extends EntrySkeletonType {
  contentTypeId: 'beursLayout'
  fields: {
    name: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    club: EntryFieldTypes.Symbol
    city: EntryFieldTypes.Symbol
    scale?: EntryFieldTypes.Symbol
    description?: EntryFieldTypes.Text
    coverImage?: EntryFieldTypes.AssetLink
    images?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>
    website?: EntryFieldTypes.Symbol
  }
}

interface SponsorSkeleton extends EntrySkeletonType {
  contentTypeId: 'sponsor'
  fields: {
    name: EntryFieldTypes.Symbol
    logo: EntryFieldTypes.AssetLink
    website?: EntryFieldTypes.Symbol
    tier?: EntryFieldTypes.Symbol
  }
}

// =============================================
// NIEUWS
// =============================================

export async function getLatestNews(limit = 3): Promise<NewsArticle[]> {
  try {
    const entries = await getContentfulClient().getEntries<NewsArticleSkeleton>({
      content_type: 'newsArticle',
      order: ['-fields.publishedAt'],
      limit,
    })

    return entries.items.map((item) => ({
      id: item.sys.id,
      title: item.fields.title as string,
      slug: item.fields.slug as string,
      summary: item.fields.summary as string,
      body: item.fields.body as NewsArticle['body'],
      coverImage: item.fields.coverImage as NewsArticle['coverImage'],
      publishedAt: (item.fields.publishedAt as string) ?? item.sys.createdAt,
      category: item.fields.category as string | undefined,
    }))
  } catch {
    return []
  }
}

export async function getAllNews(): Promise<NewsArticle[]> {
  try {
    const entries = await getContentfulClient().getEntries<NewsArticleSkeleton>({
      content_type: 'newsArticle',
      order: ['-fields.publishedAt'],
    })

    return entries.items.map((item) => ({
      id: item.sys.id,
      title: item.fields.title as string,
      slug: item.fields.slug as string,
      summary: item.fields.summary as string,
      body: item.fields.body as NewsArticle['body'],
      coverImage: item.fields.coverImage as NewsArticle['coverImage'],
      publishedAt: (item.fields.publishedAt as string) ?? item.sys.createdAt,
      category: item.fields.category as string | undefined,
    }))
  } catch {
    return []
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const entries = await getContentfulClient().getEntries<NewsArticleSkeleton>({
      content_type: 'newsArticle',
      'fields.slug': slug,
      limit: 1,
    })

    if (!entries.items.length) return null

    const item = entries.items[0]
    return {
      id: item.sys.id,
      title: item.fields.title as string,
      slug: item.fields.slug as string,
      summary: item.fields.summary as string,
      body: item.fields.body as NewsArticle['body'],
      coverImage: item.fields.coverImage as NewsArticle['coverImage'],
      publishedAt: (item.fields.publishedAt as string) ?? item.sys.createdAt,
      category: item.fields.category as string | undefined,
    }
  } catch {
    return null
  }
}

// =============================================
// AGENDA
// =============================================

export async function getUpcomingEvents(limit = 10): Promise<AgendaEvent[]> {
  try {
    const now = new Date().toISOString() as `${number}-${number}-${number}T${number}:${number}:${number}Z`
    const entries = await getContentfulClient().getEntries<AgendaEventSkeleton>({
      content_type: 'agendaEvent',
      'fields.date[gte]': now,
      order: ['fields.date'],
      limit,
    })

    return entries.items.map((item) => ({
      id: item.sys.id,
      title: item.fields.title as string,
      slug: item.fields.slug as string,
      date: item.fields.date as string,
      endDate: item.fields.endDate as string | undefined,
      startTime: item.fields.startTime as string,
      endTime: item.fields.endTime as string | undefined,
      location: item.fields.location as string,
      description: item.fields.description as string | undefined,
      category: item.fields.category as AgendaEvent['category'],
      price: item.fields.price as number | undefined,
      isPublic: (item.fields.isPublic as boolean) ?? true,
    }))
  } catch {
    return []
  }
}

export async function getAllEvents(): Promise<AgendaEvent[]> {
  try {
    const entries = await getContentfulClient().getEntries<AgendaEventSkeleton>({
      content_type: 'agendaEvent',
      order: ['fields.date'],
    })

    return entries.items.map((item) => ({
      id: item.sys.id,
      title: item.fields.title as string,
      slug: item.fields.slug as string,
      date: item.fields.date as string,
      endDate: item.fields.endDate as string | undefined,
      startTime: item.fields.startTime as string,
      endTime: item.fields.endTime as string | undefined,
      location: item.fields.location as string,
      description: item.fields.description as string | undefined,
      category: item.fields.category as AgendaEvent['category'],
      price: item.fields.price as number | undefined,
      isPublic: (item.fields.isPublic as boolean) ?? true,
    }))
  } catch {
    return []
  }
}

// =============================================
// BANEN / TRACKS
// =============================================

export async function getAllTracks(): Promise<TrackInfo[]> {
  try {
    const entries = await getContentfulClient().getEntries<TrackSkeleton>({
      content_type: 'track',
      order: ['fields.name'],
    })

    return entries.items.map((item) => ({
      id: item.sys.id,
      name: item.fields.name as string,
      slug: item.fields.slug as string,
      groupName: item.fields.groupName as string,
      scale: item.fields.scale as TrackInfo['scale'],
      system: item.fields.system as TrackInfo['system'],
      description: item.fields.description as TrackInfo['description'],
      shortDescription: item.fields.shortDescription as string,
      coverImage: item.fields.coverImage as TrackInfo['coverImage'],
      images: item.fields.images as TrackInfo['images'],
      status: item.fields.status as string | undefined,
      foundedYear: item.fields.foundedYear as number | undefined,
      moduleCount: item.fields.moduleCount as number | undefined,
    }))
  } catch {
    return []
  }
}

export async function getTrackBySlug(slug: string): Promise<TrackInfo | null> {
  try {
    const entries = await getContentfulClient().getEntries<TrackSkeleton>({
      content_type: 'track',
      'fields.slug': slug,
      limit: 1,
    })

    if (!entries.items.length) return null

    const item = entries.items[0]
    return {
      id: item.sys.id,
      name: item.fields.name as string,
      slug: item.fields.slug as string,
      groupName: item.fields.groupName as string,
      scale: item.fields.scale as TrackInfo['scale'],
      system: item.fields.system as TrackInfo['system'],
      description: item.fields.description as TrackInfo['description'],
      shortDescription: item.fields.shortDescription as string,
      coverImage: item.fields.coverImage as TrackInfo['coverImage'],
      images: item.fields.images as TrackInfo['images'],
      status: item.fields.status as string | undefined,
      foundedYear: item.fields.foundedYear as number | undefined,
      moduleCount: item.fields.moduleCount as number | undefined,
    }
  } catch {
    return null
  }
}

// =============================================
// SPONSORS
// =============================================

export async function getSponsors(): Promise<Sponsor[]> {
  try {
    const entries = await getContentfulClient().getEntries<SponsorSkeleton>({
      content_type: 'sponsor',
      order: ['fields.name'],
    })

    return entries.items.map((item) => ({
      id: item.sys.id,
      name: item.fields.name as string,
      logo: item.fields.logo as Sponsor['logo'],
      website: item.fields.website as string | undefined,
      tier: item.fields.tier as Sponsor['tier'],
    }))
  } catch {
    return []
  }
}

// =============================================
// BEURS 2026 — UITGENODIGDE BANEN
// =============================================

export async function getAllBeursLayouts(): Promise<BeursLayout[]> {
  try {
    const entries = await getContentfulClient().getEntries<BeursLayoutSkeleton>({
      content_type: 'beursLayout',
      order: ['fields.name'],
    })

    return entries.items.map((item) => ({
      id: item.sys.id,
      name: item.fields.name as string,
      slug: item.fields.slug as string,
      club: item.fields.club as string,
      city: item.fields.city as string,
      scale: item.fields.scale as string | undefined,
      description: item.fields.description as string | undefined,
      coverImage: item.fields.coverImage as BeursLayout['coverImage'],
      images: item.fields.images as BeursLayout['images'],
      website: item.fields.website as string | undefined,
    }))
  } catch {
    return []
  }
}
