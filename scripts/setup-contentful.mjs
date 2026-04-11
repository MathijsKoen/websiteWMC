/**
 * setup-contentful.mjs
 *
 * Maakt automatisch alle Contentful content types aan voor De WMC website.
 * Gebruikt de contentful-management v12 "plain client" API.
 *
 * Gebruik:
 *   node scripts/setup-contentful.mjs
 *
 * Vereiste env vars (zet in .env.local):
 *   CONTENTFUL_SPACE_ID=...
 *   CONTENTFUL_MANAGEMENT_TOKEN=...
 */

import { createClient } from 'contentful-management'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// --- Laad .env.local handmatig ---
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env.local')
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const [key, ...rest] = trimmed.split('=')
      if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim()
      }
    }
  } catch {
    // .env.local niet gevonden, gebruik bestaande env vars
  }
}

loadEnv()

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN

if (!SPACE_ID || !MGMT_TOKEN) {
  console.error('❌  Vereiste env vars ontbreken:')
  console.error('   CONTENTFUL_SPACE_ID')
  console.error('   CONTENTFUL_MANAGEMENT_TOKEN')
  console.error('\nZet ze in .env.local en probeer opnieuw.')
  process.exit(1)
}

// --- Plain client (contentful-management v12) ---
const client = createClient(
  { accessToken: MGMT_TOKEN },
  {
    type: 'plain',
    defaults: {
      spaceId: SPACE_ID,
      environmentId: 'master',
    },
  }
)

// --- Content type definities ---
const contentTypes = [
  // =============================
  // NIEUWS ARTIKEL
  // =============================
  {
    id: 'newsArticle',
    name: 'Nieuwsartikel',
    description: 'Nieuwsberichten en updates van De WMC',
    displayField: 'title',
    fields: [
      { id: 'title', name: 'Titel', type: 'Symbol', required: true },
      {
        id: 'slug',
        name: 'Slug (URL)',
        type: 'Symbol',
        required: true,
        validations: [{ unique: true }],
      },
      { id: 'summary', name: 'Samenvatting', type: 'Text', required: true },
      { id: 'body', name: 'Inhoud', type: 'RichText', required: true },
      {
        id: 'coverImage',
        name: 'Omslagafbeelding',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        validations: [],
      },
      { id: 'publishedAt', name: 'Publicatiedatum', type: 'Date', required: false },
      {
        id: 'category',
        name: 'Categorie',
        type: 'Symbol',
        required: false,
        validations: [{ in: ['Beurs', 'Open Dag', 'Clubnieuws', 'Algemeen'] }],
      },
    ],
  },

  // =============================
  // AGENDA EVENT
  // =============================
  {
    id: 'agendaEvent',
    name: 'Agenda-evenement',
    description: 'Beurzen, open dagen en clubavonden',
    displayField: 'title',
    fields: [
      { id: 'title', name: 'Naam evenement', type: 'Symbol', required: true },
      {
        id: 'slug',
        name: 'Slug (URL)',
        type: 'Symbol',
        required: true,
        validations: [{ unique: true }],
      },
      { id: 'date', name: 'Datum', type: 'Date', required: true },
      { id: 'endDate', name: 'Einddatum (optioneel)', type: 'Date', required: false },
      { id: 'startTime', name: 'Begintijd (bijv. 10:00)', type: 'Symbol', required: true },
      { id: 'endTime', name: 'Eindtijd (bijv. 16:00)', type: 'Symbol', required: false },
      { id: 'location', name: 'Locatie', type: 'Symbol', required: true },
      { id: 'description', name: 'Omschrijving', type: 'Text', required: false },
      {
        id: 'category',
        name: 'Type evenement',
        type: 'Symbol',
        required: true,
        validations: [{ in: ['beurs', 'opendag', 'clubavond', 'overig'] }],
      },
      { id: 'price', name: 'Toegangsprijs (EUR)', type: 'Number', required: false },
      { id: 'isPublic', name: 'Openbaar (niet-leden)', type: 'Boolean', required: true },
    ],
  },

  // =============================
  // BAAN / TRACK
  // =============================
  {
    id: 'track',
    name: 'Modelspoorbaan',
    description: 'Informatie over de modelspoorbanen van De WMC',
    displayField: 'name',
    fields: [
      { id: 'name', name: 'Naam groep', type: 'Symbol', required: true },
      {
        id: 'slug',
        name: 'Slug (URL)',
        type: 'Symbol',
        required: true,
        validations: [{ unique: true }],
      },
      { id: 'groupName', name: 'Officiële naam baan', type: 'Symbol', required: true },
      {
        id: 'scale',
        name: 'Schaal',
        type: 'Symbol',
        required: true,
        validations: [{ in: ['N (1:160)', 'H0 (1:87)', '0 (1:43,5)', 'overig'] }],
      },
      {
        id: 'system',
        name: 'Systeem',
        type: 'Symbol',
        required: true,
        validations: [{ in: ['Digitaal', 'Analoog', 'Gemengd'] }],
      },
      { id: 'shortDescription', name: 'Korte beschrijving', type: 'Text', required: true },
      { id: 'description', name: 'Uitgebreide beschrijving', type: 'RichText', required: true },
      {
        id: 'coverImage',
        name: 'Hoofdafbeelding',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        validations: [],
      },
      {
        id: 'images',
        name: 'Fotogalerij',
        type: 'Array',
        required: false,
        items: { type: 'Link', linkType: 'Asset', validations: [] },
      },
      { id: 'status', name: 'Status', type: 'Symbol', required: false },
      { id: 'foundedYear', name: 'Opgericht (jaar)', type: 'Integer', required: false },
      { id: 'moduleCount', name: 'Aantal modules', type: 'Integer', required: false },
    ],
  },

  // =============================
  // SPONSOR
  // =============================
  {
    id: 'sponsor',
    name: 'Sponsor',
    description: 'Sponsors van De WMC',
    displayField: 'name',
    fields: [
      { id: 'name', name: 'Naam', type: 'Symbol', required: true },
      {
        id: 'logo',
        name: 'Logo',
        type: 'Link',
        linkType: 'Asset',
        required: true,
        validations: [],
      },
      { id: 'website', name: 'Website URL', type: 'Symbol', required: false },
      {
        id: 'tier',
        name: 'Tier',
        type: 'Symbol',
        required: false,
        validations: [{ in: ['gold', 'silver', 'bronze'] }],
      },
    ],
  },
]

// --- Helper: velden formatteren ---
function formatFields(fields) {
  return fields.map((f) => {
    const field = {
      id: f.id,
      name: f.name,
      type: f.type,
      required: f.required ?? false,
      localized: false,
      validations: f.validations ?? [],
    }
    if (f.linkType) field.linkType = f.linkType
    if (f.items) field.items = f.items
    return field
  })
}

// --- Helper: maak of update een content type via plain client ---
async function upsertContentType(definition) {
  const { id, name, description, displayField, fields } = definition
  const formattedFields = formatFields(fields)

  let existing = null
  try {
    existing = await client.contentType.get({ contentTypeId: id })
  } catch (err) {
    if (err.name !== 'NotFound' && err.status !== 404) throw err
  }

  if (existing) {
    console.log(`  ⟳  Bijwerken: ${name}`)
    const updated = await client.contentType.update(
      { contentTypeId: id },
      {
        sys: existing.sys,
        name,
        description,
        displayField,
        fields: formattedFields,
      }
    )
    await client.contentType.publish(
      { contentTypeId: id },
      { sys: { version: updated.sys.version } }
    )
    console.log(`  ✓  Bijgewerkt en gepubliceerd: ${name}`)
  } else {
    console.log(`  +  Aanmaken: ${name}`)
    const created = await client.contentType.createWithId(
      { contentTypeId: id },
      {
        name,
        description,
        displayField,
        fields: formattedFields,
      }
    )
    await client.contentType.publish(
      { contentTypeId: id },
      { sys: { version: created.sys.version } }
    )
    console.log(`  ✓  Aangemaakt en gepubliceerd: ${name}`)
  }
}

// --- Main ---
async function main() {
  console.log('\n🚂  WMC Contentful Setup\n')
  console.log(`📦  Space ID: ${SPACE_ID}`)
  console.log(`🌍  Environment: master\n`)

  // Verbinding testen
  try {
    const space = await client.space.get()
    console.log(`✓  Verbonden met space: "${space.name}"\n`)
  } catch (err) {
    console.error('❌  Kan niet verbinden met Contentful:', err.message)
    console.error('   Controleer je CONTENTFUL_MANAGEMENT_TOKEN en CONTENTFUL_SPACE_ID')
    process.exit(1)
  }

  console.log(`📝  Content types aanmaken (${contentTypes.length} stuks)...\n`)

  for (const definition of contentTypes) {
    try {
      await upsertContentType(definition)
    } catch (err) {
      console.error(`\n❌  Fout bij "${definition.name}":`, err.message)
      if (err.details) console.error('   Details:', JSON.stringify(err.details, null, 2))
      process.exit(1)
    }
  }

  console.log('\n✅  Alle content types aangemaakt en gepubliceerd!')
  console.log('\nVolgende stappen:')
  console.log('  1. Ga naar het Contentful dashboard en vul content in')
  console.log('  2. Zorg dat CONTENTFUL_ACCESS_TOKEN in .env.local staat')
  console.log('  3. Start de dev server: npm run dev\n')
}

main().catch((err) => {
  console.error('\n❌  Onverwachte fout:', err.message || err)
  process.exit(1)
})
