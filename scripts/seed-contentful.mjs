/**
 * seed-contentful.mjs
 *
 * Vult Contentful met de initiële content van De WMC website:
 * - 6 modelspoorbanen
 * - 3 agenda-evenementen
 * - 1 nieuwsartikel
 *
 * Gebruik:
 *   node scripts/seed-contentful.mjs
 */

import { createClient } from 'contentful-management'
import { readFileSync } from 'fs'
import { resolve } from 'path'

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env.local')
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const [key, ...rest] = trimmed.split('=')
      if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
    }
  } catch { /* geen .env.local */ }
}

loadEnv()

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN

if (!SPACE_ID || !MGMT_TOKEN) {
  console.error('❌  CONTENTFUL_SPACE_ID en CONTENTFUL_MANAGEMENT_TOKEN zijn vereist in .env.local')
  process.exit(1)
}

const client = createClient(
  { accessToken: MGMT_TOKEN },
  { type: 'plain', defaults: { spaceId: SPACE_ID, environmentId: 'master' } }
)

// =============================================
// SEED DATA
// =============================================

const tracks = [
  {
    id: 'track-n-baan',
    fields: {
      name: { 'nl-NL': 'N-Groep' },
      slug: { 'nl-NL': 'n-baan' },
      groupName: { 'nl-NL': 'Digitale N-baan' },
      scale: { 'nl-NL': 'N (1:160)' },
      system: { 'nl-NL': 'Digitaal' },
      shortDescription: { 'nl-NL': 'Digitale N-baan met Nederlands-Duits model. Modules klaar; scenery nog in aanbouw.' },
      description: {
        'nl-NL': {
          nodeType: 'document',
          data: {},
          content: [
            {
              nodeType: 'paragraph', data: {},
              content: [{ nodeType: 'text', value: 'De N-groep bouwt een digitale baan op N-schaal (1:160) met een Nederlands-Duits thema. De kleinste schaal die wij bij de WMC hebben, maar zeker niet de minst indrukwekkende.', marks: [], data: {} }],
            },
            {
              nodeType: 'paragraph', data: {},
              content: [{ nodeType: 'text', value: 'De modules zijn klaar en gereed voor gebruik. Het scenery — de omgevingsdecoratie — is nog volop in aanbouw. Dit biedt de groepsleden de kans om hun creativiteit te tonen.', marks: [], data: {} }],
            },
          ],
        },
      },
      status: { 'nl-NL': 'In aanbouw' },
    },
  },
  {
    id: 'track-marklin',
    fields: {
      name: { 'nl-NL': 'Märklin-Groep' },
      slug: { 'nl-NL': 'marklin' },
      groupName: { 'nl-NL': 'Westwoud- en Ostwald-baan' },
      scale: { 'nl-NL': 'H0 (1:87)' },
      system: { 'nl-NL': 'Digitaal' },
      shortDescription: { 'nl-NL': 'Westwoud-baan en Ostwald-baan. Westfries en Duits model. Onderhoud en automatisering in voorbereiding.' },
      description: {
        'nl-NL': {
          nodeType: 'document', data: {},
          content: [
            {
              nodeType: 'paragraph', data: {},
              content: [{ nodeType: 'text', value: 'De Märklin-groep is een van de klassieke groepen van de WMC. Zij beschikken over twee afzonderlijke banen die elk een eigen thema hebben.', marks: [], data: {} }],
            },
            {
              nodeType: 'paragraph', data: {},
              content: [{ nodeType: 'text', value: 'De Westwoud-baan heeft een typisch Westfries karakter, terwijl de Ostwald-baan een Duits thema volgt. Beide banen zijn operationeel maar verdienen onderhoud en verdere uitbreiding. De baanplannen zijn gereed en de automatisering staat op de agenda.', marks: [], data: {} }],
            },
          ],
        },
      },
      status: { 'nl-NL': 'Actief' },
    },
  },
  {
    id: 'track-kinderbaan',
    fields: {
      name: { 'nl-NL': 'Kinderbaan' },
      slug: { 'nl-NL': 'kinderbaan' },
      groupName: { 'nl-NL': 'Digitale H0-baan voor kinderen' },
      scale: { 'nl-NL': 'H0 (1:87)' },
      system: { 'nl-NL': 'Digitaal' },
      shortDescription: { 'nl-NL': 'Speciaal voor kinderen op demonstratiedagen. Robuust geconstrueerd voor intensief gebruik.' },
      description: {
        'nl-NL': {
          nodeType: 'document', data: {},
          content: [
            {
              nodeType: 'paragraph', data: {},
              content: [{ nodeType: 'text', value: 'Een speciaal voor kinderen ontworpen H0-baan die uitsluitend op demonstratiedagen en beurzen wordt ingezet. De baan is robuust geconstrueerd om intensief gebruik te kunnen weerstaan.', marks: [], data: {} }],
            },
            {
              nodeType: 'paragraph', data: {},
              content: [{ nodeType: 'text', value: 'Het ontwerp houdt rekening met enthousiaste jonge bezoekers. De scenery wordt regelmatig vervangen en aangevuld om de baan fris en aantrekkelijk te houden.', marks: [], data: {} }],
            },
          ],
        },
      },
      status: { 'nl-NL': 'Actief' },
    },
  },
  {
    id: 'track-ellendam',
    fields: {
      name: { 'nl-NL': 'Ellendam-Groep' },
      slug: { 'nl-NL': 'ellendam' },
      groupName: { 'nl-NL': 'Ellendambaan' },
      scale: { 'nl-NL': 'H0 (1:87)' },
      system: { 'nl-NL': 'Digitaal' },
      shortDescription: { 'nl-NL': 'Modulaire Ellendambaan gestart in januari 2017. 8 modules in aanbouw met uniforme aansluitingen.' },
      description: {
        'nl-NL': {
          nodeType: 'document', data: {},
          content: [
            {
              nodeType: 'paragraph', data: {},
              content: [{ nodeType: 'text', value: 'De Ellendambaan is in januari 2017 van start gegaan als een modulair H0-baan project. Inmiddels zijn er 8 modules in aanbouw.', marks: [], data: {} }],
            },
            {
              nodeType: 'paragraph', data: {},
              content: [{ nodeType: 'text', value: 'Het modulaire systeem heeft als groot voordeel dat de baan zowel in vierkante als langwerpige configuratie kan worden opgesteld. Door de uniforme aansluitingen kunnen nieuwe modules eenvoudig worden tussengeplaatst.', marks: [], data: {} }],
            },
          ],
        },
      },
      status: { 'nl-NL': 'Actief' },
      foundedYear: { 'nl-NL': 2017 },
      moduleCount: { 'nl-NL': 8 },
    },
  },
  {
    id: 'track-nul-groep',
    fields: {
      name: { 'nl-NL': 'Nul-Groep' },
      slug: { 'nl-NL': 'nul-groep' },
      groupName: { 'nl-NL': 'Laurens-baan' },
      scale: { 'nl-NL': '0 (1:43,5)' },
      system: { 'nl-NL': 'Analoog' },
      shortDescription: { 'nl-NL': 'Laurens-baan met Engels model. Groter dan H0 en N. Veel rijlengte gerealiseerd.' },
      description: {
        'nl-NL': {
          nodeType: 'document', data: {},
          content: [
            {
              nodeType: 'paragraph', data: {},
              content: [{ nodeType: 'text', value: 'De Nul-groep bouwt de imposante Laurens-baan op 0-schaal (1:43,5). Met een schaal van 1:43,5 zijn de modellen aanzienlijk groter dan die op H0 of N-schaal. Dit geeft de baan een bijzondere indrukwekkende uitstraling.', marks: [], data: {} }],
            },
            {
              nodeType: 'paragraph', data: {},
              content: [{ nodeType: 'text', value: 'Het thema van de baan is gebaseerd op het Engelse spoorwegsysteem. Er is al veel rijlengte gerealiseerd, maar er is nog veel werk te doen aan het scenery en verdere uitbreiding.', marks: [], data: {} }],
            },
          ],
        },
      },
      status: { 'nl-NL': 'Actief' },
    },
  },
  {
    id: 'track-c-track',
    fields: {
      name: { 'nl-NL': 'C-Track-Groep' },
      slug: { 'nl-NL': 'c-track' },
      groupName: { 'nl-NL': 'C-Track-baan' },
      scale: { 'nl-NL': 'H0 (1:87)' },
      system: { 'nl-NL': 'Digitaal' },
      shortDescription: { 'nl-NL': 'Gestart in 2020. Modules van 50,3 × 50,3 cm. Compatibel met andere clubs landelijk.' },
      description: {
        'nl-NL': {
          nodeType: 'document', data: {},
          content: [
            {
              nodeType: 'paragraph', data: {},
              content: [{ nodeType: 'text', value: 'De C-Track-groep is in 2020 opgericht en werkt met modules van precies 50,3 × 50,3 cm. Dit is een landelijke standaard die door meerdere clubs wordt gehanteerd.', marks: [], data: {} }],
            },
            {
              nodeType: 'paragraph', data: {},
              content: [{ nodeType: 'text', value: 'Dankzij deze gestandaardiseerde maatvoering zijn de modules van de WMC direct compatibel met modules van andere clubs in Nederland. Dit maakt deelname aan landelijke evenementen en beurzen eenvoudiger.', marks: [], data: {} }],
            },
          ],
        },
      },
      status: { 'nl-NL': 'Actief' },
      foundedYear: { 'nl-NL': 2020 },
    },
  },
]

const events = [
  {
    id: 'event-beurs-2026',
    fields: {
      title: { 'nl-NL': 'WMC Beurs 2026' },
      slug: { 'nl-NL': 'wmc-beurs-2026' },
      date: { 'nl-NL': '2026-12-14' },
      startTime: { 'nl-NL': '10:00' },
      endTime: { 'nl-NL': '16:00' },
      location: { 'nl-NL': 'Noord-Scharwoude' },
      description: { 'nl-NL': 'De jaarlijkse WMC Beurs is een van de hoogtepunten van het clubjaar. Kom kijken naar onze modules en ontmoet andere modelspoorenthousiasten.' },
      category: { 'nl-NL': 'beurs' },
      price: { 'nl-NL': 5 },
      isPublic: { 'nl-NL': true },
    },
  },
  {
    id: 'event-clubavond-vrijdag',
    fields: {
      title: { 'nl-NL': 'Wekelijkse Clubavond' },
      slug: { 'nl-NL': 'wekelijkse-clubavond' },
      date: { 'nl-NL': '2026-04-18' },
      startTime: { 'nl-NL': '19:30' },
      endTime: { 'nl-NL': '22:00' },
      location: { 'nl-NL': 'De Mossel 23e, Noord-Scharwoude' },
      description: { 'nl-NL': 'De wekelijkse clubavond is voor alle leden. We werken aan onze banen, delen kennis en genieten van het hobbyisme.' },
      category: { 'nl-NL': 'clubavond' },
      isPublic: { 'nl-NL': false },
    },
  },
  {
    id: 'event-opendag-2026',
    fields: {
      title: { 'nl-NL': 'Open Dag 2026' },
      slug: { 'nl-NL': 'open-dag-2026' },
      date: { 'nl-NL': '2026-09-01' },
      startTime: { 'nl-NL': '11:00' },
      endTime: { 'nl-NL': '17:00' },
      location: { 'nl-NL': 'Noord-Scharwoude' },
      description: { 'nl-NL': 'Kom onze club bekijken op de jaarlijkse open dag. Gratis toegang voor iedereen. Een perfecte kans om kennis te maken met de wereld van het modelspoorbouwen.' },
      category: { 'nl-NL': 'opendag' },
      price: { 'nl-NL': 0 },
      isPublic: { 'nl-NL': true },
    },
  },
]

const newsArticles = [
  {
    id: 'news-wmc-beurs-2026',
    fields: {
      title: { 'nl-NL': 'WMC Beurs 2026' },
      slug: { 'nl-NL': 'wmc-beurs-2026' },
      summary: { 'nl-NL': 'De WMC Beurs 2026 staat op de agenda! Noteer de datum alvast in je agenda en kom ons bezoeken in Noord-Scharwoude op 14 december 2026.' },
      body: {
        'nl-NL': {
          nodeType: 'document', data: {},
          content: [
            {
              nodeType: 'paragraph', data: {},
              content: [{ nodeType: 'text', value: 'De jaarlijkse WMC Beurs vindt in 2026 plaats op 14 december in Noord-Scharwoude. De deuren zijn open van 10:00 tot 16:00 uur.', marks: [], data: {} }],
            },
            {
              nodeType: 'paragraph', data: {},
              content: [{ nodeType: 'text', value: 'Kom kijken naar onze prachtige modelspoorbanen, ontmoet andere hobbyisten en laat je inspireren. De entreeprijs bedraagt € 5,00 per persoon.', marks: [], data: {} }],
            },
          ],
        },
      },
      publishedAt: { 'nl-NL': '2026-03-28' },
      category: { 'nl-NL': 'Beurs' },
    },
  },
]

// =============================================
// HELPERS
// =============================================

async function upsertEntry(contentTypeId, entryId, fields) {
  let existing = null
  try {
    existing = await client.entry.get({ entryId })
  } catch (err) {
    if (err.name !== 'NotFound' && err.status !== 404) throw err
  }

  let entry
  if (existing) {
    entry = await client.entry.update(
      { entryId },
      { sys: existing.sys, fields }
    )
    console.log(`  ⟳  Bijgewerkt: ${entryId}`)
  } else {
    entry = await client.entry.createWithId(
      { contentTypeId, entryId },
      { fields }
    )
    console.log(`  +  Aangemaakt: ${entryId}`)
  }

  await client.entry.publish(
    { entryId },
    { sys: { version: entry.sys.version } }
  )
  return entry
}

// =============================================
// MAIN
// =============================================

async function main() {
  console.log('\n🌱  WMC Content Seed\n')

  // Controleer lokale van de space
  let locale = 'nl-NL'
  try {
    const locales = await client.locale.getMany({})
    if (locales.items.length > 0) {
      locale = locales.items[0].code
      console.log(`🌍  Locale: ${locale}\n`)
    }
  } catch {
    console.log(`🌍  Locale (standaard): ${locale}\n`)
  }

  // Als de space een andere default locale heeft, hermap velden
  function l(value) {
    return { [locale]: value }
  }

  // Banen
  console.log('🚂  Banen aanmaken...')
  for (const track of tracks) {
    const remappedFields = Object.fromEntries(
      Object.entries(track.fields).map(([key, val]) => {
        const innerVal = val['nl-NL']
        return [key, { [locale]: innerVal }]
      })
    )
    await upsertEntry('track', track.id, remappedFields)
  }

  // Agenda
  console.log('\n📅  Agenda-evenementen aanmaken...')
  for (const event of events) {
    const remappedFields = Object.fromEntries(
      Object.entries(event.fields).map(([key, val]) => {
        const innerVal = val['nl-NL']
        return [key, { [locale]: innerVal }]
      })
    )
    await upsertEntry('agendaEvent', event.id, remappedFields)
  }

  // Nieuws
  console.log('\n📰  Nieuwsartikelen aanmaken...')
  for (const article of newsArticles) {
    const remappedFields = Object.fromEntries(
      Object.entries(article.fields).map(([key, val]) => {
        const innerVal = val['nl-NL']
        return [key, { [locale]: innerVal }]
      })
    )
    await upsertEntry('newsArticle', article.id, remappedFields)
  }

  console.log('\n✅  Content seed voltooid!')
  console.log(`   6 banen, 3 evenementen, 1 nieuwsartikel aangemaakt in Contentful.\n`)
}

main().catch((err) => {
  console.error('\n❌  Fout tijdens seeden:', err.message || err)
  if (err.details) console.error('Details:', JSON.stringify(err.details, null, 2))
  process.exit(1)
})
