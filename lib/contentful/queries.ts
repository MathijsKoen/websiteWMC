import type { EntrySkeletonType, EntryFieldTypes } from 'contentful'
import { unstable_cache } from 'next/cache'
import { getContentfulClient } from './client'
import type { NewsArticle, AgendaEvent, TrackInfo, Sponsor, BeursLayout, SiteSettings, TimelineItem, RecurrenceInterval, MemberAnnouncement, MemberDocument } from './types'

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
    price?: EntryFieldTypes.Symbol
    isPublic: EntryFieldTypes.Boolean
    isRecurring?: EntryFieldTypes.Boolean
    recurrenceInterval?: EntryFieldTypes.Symbol
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
    railLengte?: EntryFieldTypes.Symbol
    tijdperk?: EntryFieldTypes.Symbol
    merk?: EntryFieldTypes.Symbol
    landcontinent?: EntryFieldTypes.Symbol
    aantalLeden?: EntryFieldTypes.Integer
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

interface SiteSettingsSkeleton extends EntrySkeletonType {
  contentTypeId: 'siteSettings'
  fields: {
    email: EntryFieldTypes.Symbol
    adres: EntryFieldTypes.Symbol
    postcode: EntryFieldTypes.Symbol
    stad: EntryFieldTypes.Symbol
    provincie: EntryFieldTypes.Symbol
    openingsDag: EntryFieldTypes.Symbol
    openingsTijd: EntryFieldTypes.Symbol
    contributie: EntryFieldTypes.Integer
    contributieJaar: EntryFieldTypes.Integer
    lidWordenStappen: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    overOnsIntro: EntryFieldTypes.Text
    geschiedenisAlineas: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    doelstellingen: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
    tijdlijn: EntryFieldTypes.Object
  }
}

interface MemberAnnouncementSkeleton extends EntrySkeletonType {
  contentTypeId: 'memberAnnouncement'
  fields: {
    title: EntryFieldTypes.Symbol
    content: EntryFieldTypes.Text
    publishedAt: EntryFieldTypes.Date
    priority?: EntryFieldTypes.Symbol
    isActive: EntryFieldTypes.Boolean
  }
}

interface MemberDocumentSkeleton extends EntrySkeletonType {
  contentTypeId: 'memberDocument'
  fields: {
    title: EntryFieldTypes.Symbol
    description?: EntryFieldTypes.Text
    file: EntryFieldTypes.AssetLink
    category: EntryFieldTypes.Symbol
    uploadedAt: EntryFieldTypes.Date
    isActive: EntryFieldTypes.Boolean
  }
}

// =============================================
// CACHE-TIJDEN (seconden)
//
// unstable_cache wikkelt Contentful SDK-calls (Axios, geen native fetch)
// in de Next.js Data Cache. Zonder dit slaat Next.js geen enkele SDK-call
// op — elke render maakt een verse HTTP-request naar Contentful.
//
// Hoe het werkt:
//  - revalidate: 300 → maximaal één Contentful-call per 5 minuten,
//    ongeacht hoeveel gebruikers de pagina laden of hoe vaak ISR triggert
//  - tags: ['tracks'] → toekomstige on-demand revalidatie via
//    revalidateTag('tracks') in een webhook-route
// =============================================

const TTL_CONTENT = 300    // 5 min — nieuws, agenda, banen
const TTL_STATIC  = 3600   // 1 uur — sponsoren, instellingen, beurs-layouts

// =============================================
// NIEUWS
// =============================================

export const getLatestNews = unstable_cache(
  async (limit: number = 3): Promise<NewsArticle[]> => {
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
  },
  ['contentful-latest-news'],
  { revalidate: TTL_CONTENT, tags: ['news', 'contentful'] }
)

export const getAllNews = unstable_cache(
  async (): Promise<NewsArticle[]> => {
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
  },
  ['contentful-all-news'],
  { revalidate: TTL_CONTENT, tags: ['news', 'contentful'] }
)

export const getNewsBySlug = unstable_cache(
  async (slug: string): Promise<NewsArticle | null> => {
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
  },
  ['contentful-news-by-slug'],
  { revalidate: TTL_CONTENT, tags: ['news', 'contentful'] }
)

// =============================================
// AGENDA
// =============================================

export const getUpcomingEvents = unstable_cache(
  async (limit: number = 10): Promise<AgendaEvent[]> => {
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
        price: item.fields.price as string | undefined,
        isPublic: (item.fields.isPublic as boolean) ?? true,
        isRecurring: (item.fields.isRecurring as boolean) ?? false,
        recurrenceInterval: item.fields.recurrenceInterval as RecurrenceInterval | undefined,
      }))
    } catch {
      return []
    }
  },
  ['contentful-upcoming-events'],
  { revalidate: TTL_CONTENT, tags: ['events', 'contentful'] }
)

export const getAllEvents = unstable_cache(
  async (): Promise<AgendaEvent[]> => {
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
        price: item.fields.price as string | undefined,
        isPublic: (item.fields.isPublic as boolean) ?? true,
        isRecurring: (item.fields.isRecurring as boolean) ?? false,
        recurrenceInterval: item.fields.recurrenceInterval as RecurrenceInterval | undefined,
      }))
    } catch {
      return []
    }
  },
  ['contentful-all-events'],
  { revalidate: TTL_CONTENT, tags: ['events', 'contentful'] }
)

export const getEventBySlug = unstable_cache(
  async (slug: string): Promise<AgendaEvent | null> => {
    try {
      const entries = await getContentfulClient().getEntries<AgendaEventSkeleton>({
        content_type: 'agendaEvent',
        'fields.slug': slug,
        limit: 1,
      })

      if (!entries.items.length) return null

      const item = entries.items[0]
      return {
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
        price: item.fields.price as string | undefined,
        isPublic: (item.fields.isPublic as boolean) ?? true,
      }
    } catch {
      return null
    }
  },
  ['contentful-event-by-slug'],
  { revalidate: TTL_CONTENT, tags: ['events', 'contentful'] }
)

// =============================================
// BANEN / TRACKS
// =============================================

export const getAllTracks = unstable_cache(
  async (): Promise<TrackInfo[]> => {
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
        railLengte: item.fields.railLengte as string | undefined,
        tijdperk: item.fields.tijdperk as string | undefined,
        merk: item.fields.merk as string | undefined,
        landcontinent: item.fields.landcontinent as string | undefined,
        aantalLeden: item.fields.aantalLeden as number | undefined,
      }))
    } catch {
      return []
    }
  },
  ['contentful-all-tracks'],
  { revalidate: TTL_CONTENT, tags: ['tracks', 'contentful'] }
)

export const getTrackBySlug = unstable_cache(
  async (slug: string): Promise<TrackInfo | null> => {
    try {
      const entries = await getContentfulClient().getEntries<TrackSkeleton>({
        content_type: 'track',
        'fields.slug': slug,
        limit: 1,
        include: 10, // linked assets in rich text meesturen
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
        railLengte: item.fields.railLengte as string | undefined,
        tijdperk: item.fields.tijdperk as string | undefined,
        merk: item.fields.merk as string | undefined,
        landcontinent: item.fields.landcontinent as string | undefined,
        aantalLeden: item.fields.aantalLeden as number | undefined,
      }
    } catch {
      return null
    }
  },
  ['contentful-track-by-slug'],
  { revalidate: TTL_CONTENT, tags: ['tracks', 'contentful'] }
)

// =============================================
// SPONSORS
// =============================================

export const getSponsors = unstable_cache(
  async (): Promise<Sponsor[]> => {
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
  },
  ['contentful-sponsors'],
  { revalidate: TTL_STATIC, tags: ['sponsors', 'contentful'] }
)

// =============================================
// SITE SETTINGS
// =============================================

// Fallback waarden als Contentful nog niet geconfigureerd is
const SITE_SETTINGS_FALLBACK: SiteSettings = {
  id: 'fallback',
  email: 'info@dewmc.nl',
  adres: 'De Mossel 23e',
  postcode: '1723 HX',
  stad: 'Noord-Scharwoude',
  provincie: 'Noord-Holland',
  openingsDag: 'Vrijdagavond',
  openingsTijd: '19:30 – 22:00 uur',
  contributie: 175,
  contributieJaar: 2025,
  lidWordenStappen: [
    'Stuur een e-mail naar info@dewmc.nl',
    'Ontvang een uitnodiging voor een rondleiding',
    'Kom een vrijdagavond langs om kennis te maken',
    'Sluit je aan bij een van onze zes groepen',
  ],
  overOnsIntro: 'De Westfriese Modelspoor Club is een actieve vereniging van modelspoorenthousiasten in West-Friesland. Wij zijn ingeschreven bij de Kamer van Koophandel.',
  geschiedenisAlineas: [
    'De Westfriese Modelspoor Club (De WMC) is op 1 maart 1998 opgericht in Hoorn, Noord-Holland. Vanaf het begin was de club een plek waar modelspoorenthousiasten hun passie konden delen en hun vaardigheden konden ontwikkelen.',
    'Door de jaren heen is de club uitgegroeid tot een bloeiende vereniging met zes actieve groepen, elk gespecialiseerd in een eigen schaal en stijl. Van de fijne N-schaal tot de imposante 0-schaal, de WMC biedt voor elk wat wils.',
    'Elke vrijdagavond komen de leden samen in ons clubgebouw in Noord-Scharwoude om te bouwen, te rijden en kennis te delen. De club is ingeschreven bij de Kamer van Koophandel.',
  ],
  doelstellingen: [
    'Het bieden van onderdak aan modelspoorhobbyisten',
    'Het verhogen van kennis en vaardigheden van de leden',
    'Het in samenwerkingsverband bouwen van modules',
    'Het stimuleren van samenwerking door gezamenlijke projecten',
    'Het organiseren van beurzen en demonstreren van modules',
    'Het stimuleren van eigen inbreng en werkzaamheden van leden',
  ],
  tijdlijn: [
    { year: '1998', event: 'Oprichting van De WMC op 1 maart in Hoorn' },
    { year: '2017', event: 'Start van de modulaire Ellendam-groep (H0-baan)' },
    { year: '2020', event: 'Oprichting van de C-Track-groep met landelijk compatibele modules' },
    { year: '2024', event: 'Contributie vastgesteld op €175,— per jaar' },
    { year: '2026', event: 'WMC Beurs 2026 gepland' },
  ],
}

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    try {
      const entries = await getContentfulClient().getEntries<SiteSettingsSkeleton>({
        content_type: 'siteSettings',
        limit: 1,
      })

      if (!entries.items.length) return SITE_SETTINGS_FALLBACK

      const item = entries.items[0]
      return {
        id: item.sys.id,
        email: (item.fields.email as string) ?? SITE_SETTINGS_FALLBACK.email,
        adres: (item.fields.adres as string) ?? SITE_SETTINGS_FALLBACK.adres,
        postcode: (item.fields.postcode as string) ?? SITE_SETTINGS_FALLBACK.postcode,
        stad: (item.fields.stad as string) ?? SITE_SETTINGS_FALLBACK.stad,
        provincie: (item.fields.provincie as string) ?? SITE_SETTINGS_FALLBACK.provincie,
        openingsDag: (item.fields.openingsDag as string) ?? SITE_SETTINGS_FALLBACK.openingsDag,
        openingsTijd: (item.fields.openingsTijd as string) ?? SITE_SETTINGS_FALLBACK.openingsTijd,
        contributie: (item.fields.contributie as number) ?? SITE_SETTINGS_FALLBACK.contributie,
        contributieJaar: (item.fields.contributieJaar as number) ?? SITE_SETTINGS_FALLBACK.contributieJaar,
        lidWordenStappen: (item.fields.lidWordenStappen as string[]) ?? SITE_SETTINGS_FALLBACK.lidWordenStappen,
        overOnsIntro: (item.fields.overOnsIntro as string) ?? SITE_SETTINGS_FALLBACK.overOnsIntro,
        geschiedenisAlineas: (item.fields.geschiedenisAlineas as string[]) ?? SITE_SETTINGS_FALLBACK.geschiedenisAlineas,
        doelstellingen: (item.fields.doelstellingen as string[]) ?? SITE_SETTINGS_FALLBACK.doelstellingen,
        tijdlijn: (item.fields.tijdlijn as unknown as TimelineItem[]) ?? SITE_SETTINGS_FALLBACK.tijdlijn,
      }
    } catch {
      return SITE_SETTINGS_FALLBACK
    }
  },
  ['contentful-site-settings'],
  { revalidate: TTL_STATIC, tags: ['site-settings', 'contentful'] }
)

// =============================================
// BEURS 2026 — UITGENODIGDE BANEN
// =============================================

export const getAllBeursLayouts = unstable_cache(
  async (): Promise<BeursLayout[]> => {
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
  },
  ['contentful-beurs-layouts'],
  { revalidate: TTL_STATIC, tags: ['beurs', 'contentful'] }
)

// =============================================
// LEDENPORTAAL — MEDEDELINGEN
// =============================================

export const getMemberAnnouncements = unstable_cache(
  async (): Promise<MemberAnnouncement[]> => {
    try {
      const entries = await getContentfulClient().getEntries<MemberAnnouncementSkeleton>({
        content_type: 'memberAnnouncement',
        'fields.isActive': true,
        order: ['-fields.publishedAt'],
      })

      return entries.items.map((item) => ({
        id: item.sys.id,
        title: item.fields.title as string,
        content: item.fields.content as string,
        publishedAt: item.fields.publishedAt as string,
        priority: (item.fields.priority as MemberAnnouncement['priority']) ?? 'normaal',
        isActive: item.fields.isActive as boolean,
      }))
    } catch {
      return []
    }
  },
  ['contentful-member-announcements'],
  { revalidate: 300, tags: ['announcements', 'contentful'] }
)

// =============================================
// LEDENPORTAAL — DOCUMENTEN
// =============================================

export const getMemberDocuments = unstable_cache(
  async (category?: string): Promise<MemberDocument[]> => {
    try {
      const query: {
        content_type: 'memberDocument'
        'fields.isActive': true
        'fields.category'?: string
        order: ['-fields.uploadedAt']
      } = {
        content_type: 'memberDocument',
        'fields.isActive': true,
        order: ['-fields.uploadedAt'],
      }

      if (category) {
        query['fields.category'] = category
      }

      const entries = await getContentfulClient().getEntries<MemberDocumentSkeleton>(query)

      return entries.items.map((item) => ({
        id: item.sys.id,
        title: item.fields.title as string,
        description: item.fields.description as string | undefined,
        file: item.fields.file as MemberDocument['file'],
        category: item.fields.category as MemberDocument['category'],
        uploadedAt: item.fields.uploadedAt as string,
        isActive: item.fields.isActive as boolean,
      }))
    } catch {
      return []
    }
  },
  ['contentful-member-documents'],
  { revalidate: 300, tags: ['documents', 'contentful'] }
)
