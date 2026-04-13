/**
 * Voegt isRecurring en recurrenceInterval toe aan het agendaEvent content type.
 *
 * Gebruik: node scripts/add-recurring-fields.mjs
 */

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

async function main() {
  console.log('📐 agendaEvent content type ophalen...')
  const contentType = await client.contentType.get({ contentTypeId: 'agendaEvent' })

  // Voeg alleen toe als ze nog niet bestaan
  const existingIds = contentType.fields.map((f) => f.id)

  const newFields = []

  if (!existingIds.includes('isRecurring')) {
    newFields.push({
      id: 'isRecurring',
      name: 'Terugkerend evenement',
      type: 'Boolean',
      required: false,
    })
    console.log('   + isRecurring toegevoegd')
  } else {
    console.log('   ⚠️  isRecurring bestaat al, overgeslagen')
  }

  if (!existingIds.includes('recurrenceInterval')) {
    newFields.push({
      id: 'recurrenceInterval',
      name: 'Herhaalinterval',
      type: 'Symbol',
      required: false,
      validations: [{ in: ['weekly', 'biweekly', 'monthly'] }],
    })
    console.log('   + recurrenceInterval toegevoegd (weekly / biweekly / monthly)')
  } else {
    console.log('   ⚠️  recurrenceInterval bestaat al, overgeslagen')
  }

  if (newFields.length === 0) {
    console.log('Niets te doen — beide velden bestaan al.')
    return
  }

  const updated = await client.contentType.update(
    { contentTypeId: 'agendaEvent' },
    { ...contentType, fields: [...contentType.fields, ...newFields] }
  )

  await client.contentType.publish({ contentTypeId: 'agendaEvent' }, { sys: updated.sys })
  console.log('✅ agendaEvent content type bijgewerkt en gepubliceerd.')
  console.log('')
  console.log('Stel per terugkerend evenement in Contentful in:')
  console.log('  • Terugkerend evenement  → ✓ aan')
  console.log('  • Herhaalinterval        → weekly / biweekly / monthly')
  console.log('  • Datum                  → de eerste (of huidige) voorkomende datum')
}

main().catch((err) => {
  console.error('❌ Fout:', err.message ?? err)
  process.exit(1)
})
