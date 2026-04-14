import { createClient } from 'contentful-management'

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT ?? 'master'

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('Zet CONTENTFUL_SPACE_ID en CONTENTFUL_MANAGEMENT_TOKEN in je omgeving.')
  process.exit(1)
}

const client = createClient(
  { accessToken: MANAGEMENT_TOKEN },
  { type: 'plain', defaults: { spaceId: SPACE_ID, environmentId: ENVIRONMENT } }
)

const NEW_FIELDS = [
  { id: 'railLengte',    name: 'Raillengte',      type: 'Symbol' },
  { id: 'tijdperk',      name: 'Tijdperk',         type: 'Symbol' },
  { id: 'merk',          name: 'Merk',             type: 'Symbol' },
  { id: 'landcontinent', name: 'Land / Continent', type: 'Symbol' },
  { id: 'aantalLeden',   name: 'Aantal leden',     type: 'Integer' },
]

async function main() {
  console.log('📐 track content type ophalen...')
  const contentType = await client.contentType.get({ contentTypeId: 'track' })

  const existingIds = new Set(contentType.fields.map((f) => f.id))
  const toAdd = NEW_FIELDS.filter((f) => {
    if (existingIds.has(f.id)) {
      console.log(`   ⚠️  ${f.id} bestaat al, overgeslagen`)
      return false
    }
    return true
  })

  if (toAdd.length === 0) {
    console.log('Niets toe te voegen — alle velden bestaan al.')
    return
  }

  const updated = await client.contentType.update(
    { contentTypeId: 'track' },
    { ...contentType, fields: [...contentType.fields, ...toAdd.map((f) => ({ ...f, required: false }))] }
  )

  await client.contentType.publish({ contentTypeId: 'track' }, { sys: updated.sys })

  toAdd.forEach((f) => console.log(`   ✅ ${f.id} toegevoegd`))
  console.log('\n🎉 track content type bijgewerkt en gepubliceerd.')
}

main().catch((err) => {
  console.error('❌ Fout:', err.message ?? err)
  process.exit(1)
})
