/**
 * setup-member-portal.mjs
 *
 * Maakt alleen de ledenportaal content types aan.
 * Dit script voegt de two new types toe zonder bestaande types aan te passen.
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
    // .env.local niet gevonden
  }
}

loadEnv()

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const MGMT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN

if (!SPACE_ID || !MGMT_TOKEN) {
  console.error('❌  Vereiste env vars ontbreken:')
  console.error('   CONTENTFUL_SPACE_ID')
  console.error('   CONTENTFUL_MANAGEMENT_TOKEN')
  process.exit(1)
}

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

const contentTypes = [
  {
    id: 'memberAnnouncement',
    name: 'Ledenportaal — Mededeling',
    description: 'Mededelingen en berichten voor leden in het ledenportaal',
    displayField: 'title',
    fields: [
      { id: 'title', name: 'Titel', type: 'Symbol', required: true },
      { id: 'content', name: 'Inhoud', type: 'Text', required: true },
      { id: 'publishedAt', name: 'Publicatiedatum', type: 'Date', required: true },
      {
        id: 'priority',
        name: 'Prioriteit',
        type: 'Symbol',
        required: false,
        validations: [{ in: ['hoog', 'normaal', 'laag'] }],
      },
      { id: 'isActive', name: 'Zichtbaar', type: 'Boolean', required: true },
    ],
  },
  {
    id: 'memberDocument',
    name: 'Ledenportaal — Document',
    description: 'Documenten zoals jaarverslagen en andere ledenbestanden',
    displayField: 'title',
    fields: [
      { id: 'title', name: 'Titel', type: 'Symbol', required: true },
      { id: 'description', name: 'Beschrijving', type: 'Text', required: false },
      {
        id: 'file',
        name: 'Document (PDF/Word/etc)',
        type: 'Link',
        linkType: 'Asset',
        required: true,
        validations: [],
      },
      {
        id: 'category',
        name: 'Categorie',
        type: 'Symbol',
        required: true,
        validations: [{ in: ['jaarverslag', 'notulen', 'financieel', 'overig'] }],
      },
      { id: 'uploadedAt', name: 'Uploadatum', type: 'Date', required: true },
      { id: 'isActive', name: 'Zichtbaar', type: 'Boolean', required: true },
    ],
  },
]

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

async function main() {
  console.log('\n🔐  WMC Ledenportaal Setup\n')

  try {
    const space = await client.space.get()
    console.log(`✓  Verbonden met space: "${space.name}"\n`)
  } catch (err) {
    console.error('❌  Kan niet verbinden met Contentful:', err.message)
    process.exit(1)
  }

  console.log(`📝  Ledenportaal content types aanmaken (${contentTypes.length} stuks)...\n`)

  for (const definition of contentTypes) {
    try {
      await upsertContentType(definition)
    } catch (err) {
      console.error(`\n❌  Fout bij "${definition.name}":`, err.message)
      process.exit(1)
    }
  }

  console.log('\n✅  Ledenportaal content types klaar!')
  console.log('\nVolgende stappen:')
  console.log('  1. Ga naar het Contentful dashboard')
  console.log('  2. Voeg mededelingen toe onder "Ledenportaal — Mededeling"')
  console.log('  3. Voeg documenten toe onder "Ledenportaal — Document"')
  console.log('  4. Zorg dat beide entries "Zichtbaar" (isActive) hebben')
  console.log('  5. Wij updaten in production: npm run build\n')
}

main().catch((err) => {
  console.error('\n❌  Onverwachte fout:', err.message || err)
  process.exit(1)
})
