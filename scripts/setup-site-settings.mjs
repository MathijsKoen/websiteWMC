/**
 * Maakt het siteSettings content model aan in Contentful
 * en vult het met de huidige WMC gegevens.
 *
 * Gebruik: node scripts/setup-site-settings.mjs
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
  // ── 1. Content model aanmaken (of bijwerken als het al bestaat) ──────────
  console.log('📐 Content model aanmaken...')

  const fields = [
    { id: 'email',               name: 'E-mailadres',          type: 'Symbol',  required: true },
    { id: 'adres',               name: 'Adres',                type: 'Symbol',  required: true },
    { id: 'postcode',            name: 'Postcode',             type: 'Symbol',  required: true },
    { id: 'stad',                name: 'Stad',                 type: 'Symbol',  required: true },
    { id: 'provincie',           name: 'Provincie',            type: 'Symbol',  required: false },
    { id: 'openingsDag',         name: 'Openingsdag',          type: 'Symbol',  required: true },
    { id: 'openingsTijd',        name: 'Openingstijd',         type: 'Symbol',  required: true },
    { id: 'contributie',         name: 'Contributie (€)',      type: 'Integer', required: true },
    { id: 'contributieJaar',     name: 'Contributiejaar',      type: 'Integer', required: true },
    {
      id: 'lidWordenStappen',
      name: 'Lid worden stappen',
      type: 'Array',
      required: true,
      items: { type: 'Symbol' },
    },
    { id: 'overOnsIntro',        name: 'Over ons intro',       type: 'Text',    required: false },
    {
      id: 'geschiedenisAlineas',
      name: "Geschiedenis alinea's",
      type: 'Array',
      required: false,
      items: { type: 'Symbol' },
    },
    {
      id: 'doelstellingen',
      name: 'Doelstellingen',
      type: 'Array',
      required: false,
      items: { type: 'Symbol' },
    },
    { id: 'tijdlijn',            name: 'Tijdlijn (JSON)',      type: 'Object',  required: false },
  ]

  let contentType
  try {
    contentType = await client.contentType.get({ contentTypeId: 'siteSettings' })
    console.log('   ⚠️  Content type bestaat al, wordt bijgewerkt.')
    contentType = await client.contentType.update(
      { contentTypeId: 'siteSettings' },
      { ...contentType, name: 'Site Settings', displayField: 'email', fields }
    )
  } catch {
    contentType = await client.contentType.createWithId(
      { contentTypeId: 'siteSettings' },
      { name: 'Site Settings', description: 'Algemene contactgegevens en teksten voor de website.', displayField: 'email', fields }
    )
  }

  await client.contentType.publish(
    { contentTypeId: 'siteSettings' },
    { sys: contentType.sys }
  )
  console.log('   ✅ Content model gepubliceerd.')

  // ── 2. Entry aanmaken (of bestaande bijwerken) ───────────────────────────
  console.log('📝 Entry aanmaken...')

  const entryFields = {
    email:               { 'en-US': 'info@dewmc.nl' },
    adres:               { 'en-US': 'De Mossel 23e' },
    postcode:            { 'en-US': '1723 HX' },
    stad:                { 'en-US': 'Noord-Scharwoude' },
    provincie:           { 'en-US': 'Noord-Holland' },
    openingsDag:         { 'en-US': 'Vrijdagavond' },
    openingsTijd:        { 'en-US': '19:30 – 22:00 uur' },
    contributie:         { 'en-US': 175 },
    contributieJaar:     { 'en-US': 2025 },
    lidWordenStappen:    { 'en-US': [
      'Stuur een e-mail naar info@dewmc.nl',
      'Ontvang een uitnodiging voor een rondleiding',
      'Kom een vrijdagavond langs om kennis te maken',
      'Sluit je aan bij een van onze zes groepen',
    ]},
    overOnsIntro:        { 'en-US': 'De Westfriese Modelspoor Club is een actieve vereniging van modelspoorenthousiasten in West-Friesland. Wij zijn ingeschreven bij de Kamer van Koophandel.' },
    geschiedenisAlineas: { 'en-US': [
      'De Westfriese Modelspoor Club (De WMC) is op 1 maart 1998 opgericht in Hoorn, Noord-Holland. Vanaf het begin was de club een plek waar modelspoorenthousiasten hun passie konden delen en hun vaardigheden konden ontwikkelen.',
      'Door de jaren heen is de club uitgegroeid tot een bloeiende vereniging met zes actieve groepen, elk gespecialiseerd in een eigen schaal en stijl. Van de fijne N-schaal tot de imposante 0-schaal, de WMC biedt voor elk wat wils.',
      'Elke vrijdagavond komen de leden samen in ons clubgebouw in Noord-Scharwoude om te bouwen, te rijden en kennis te delen. De club is ingeschreven bij de Kamer van Koophandel.',
    ]},
    doelstellingen:      { 'en-US': [
      'Het bieden van onderdak aan modelspoorhobbyisten',
      'Het verhogen van kennis en vaardigheden van de leden',
      'Het in samenwerkingsverband bouwen van modules',
      'Het stimuleren van samenwerking door gezamenlijke projecten',
      'Het organiseren van beurzen en demonstreren van modules',
      'Het stimuleren van eigen inbreng en werkzaamheden van leden',
    ]},
    tijdlijn:            { 'en-US': [
      { year: '1998', event: 'Oprichting van De WMC op 1 maart in Hoorn' },
      { year: '2017', event: 'Start van de modulaire Ellendam-groep (H0-baan)' },
      { year: '2020', event: 'Oprichting van de C-Track-groep met landelijk compatibele modules' },
      { year: '2024', event: 'Contributie vastgesteld op €175,— per jaar' },
      { year: '2026', event: 'WMC Beurs 2026 gepland' },
    ]},
  }

  const existing = await client.entry.getMany({ query: { content_type: 'siteSettings', limit: 1 } })

  let entry
  if (existing.items.length > 0) {
    console.log('   ⚠️  Entry bestaat al, wordt bijgewerkt.')
    const existingEntry = existing.items[0]
    entry = await client.entry.update(
      { entryId: existingEntry.sys.id },
      { ...existingEntry, fields: entryFields }
    )
  } else {
    entry = await client.entry.create(
      { contentTypeId: 'siteSettings' },
      { fields: entryFields }
    )
  }

  await client.entry.publish({ entryId: entry.sys.id }, { sys: entry.sys })
  console.log('   ✅ Entry gepubliceerd.')
  console.log('')
  console.log('🎉 Klaar! siteSettings staat nu in Contentful.')
  console.log(`   Bekijk op: https://app.contentful.com/spaces/${SPACE_ID}/entries/${entry.sys.id}`)
}

main().catch((err) => {
  console.error('❌ Fout:', err.message ?? err)
  process.exit(1)
})
