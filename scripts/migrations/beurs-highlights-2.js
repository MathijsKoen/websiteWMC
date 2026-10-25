/**
 * Contentful-migratie (vervolg op beurs-highlights.js): uitbreiding van "Highlights Beurs".
 *
 *  - Foto's: afgeschafte widget `assetGallery` vervangen door `assetLinksEditor`
 *  - Introductietekst → "Korte inleiding" (max. 400 tekens, staat in de paginakop)
 *  - Nieuw: Terugblik (rich text), De beurs in cijfers, Kop boven de links, Sponsoren tonen
 *
 * Bestaande velden en content blijven staan.
 *
 * Gebruik:
 *   npx contentful-cli space migration \
 *     --space-id <SPACE_ID> --environment-id master \
 *     --management-token <MANAGEMENT_TOKEN> \
 *     scripts/migrations/beurs-highlights-2.js
 */

module.exports = function (migration) {
  const highlights = migration.editContentType('beursHighlights')

  // ── Korte inleiding (was: Introductietekst) ──────────────────────────────
  highlights
    .editField('intro')
    .name('Korte inleiding')
    .validations([{ size: { max: 400 } }])

  highlights.changeFieldControl('intro', 'builtin', 'multipleLine', {
    helpText: 'Eén of twee zinnen die bovenaan in de grote kop staan. Het uitgebreide verhaal schrijf je bij "Terugblik".',
  })

  // ── Terugblik (rich text) ────────────────────────────────────────────────
  highlights
    .createField('verhaal')
    .name('Terugblik')
    .type('RichText')
    .validations([
      {
        enabledMarks: ['bold', 'italic', 'underline'],
        message: 'Alleen vet, cursief en onderstreept zijn mogelijk.',
      },
      {
        enabledNodeTypes: [
          'heading-2',
          'heading-3',
          'unordered-list',
          'ordered-list',
          'blockquote',
          'hr',
          'embedded-asset-block',
          'hyperlink',
        ],
        message: 'Dit onderdeel wordt niet ondersteund op deze pagina.',
      },
    ])
  highlights.moveField('verhaal').afterField('intro')

  highlights.changeFieldControl('verhaal', 'builtin', 'richTextEditor', {
    helpText: 'Het verhaal van de beurs, net zoals bij een nieuwsbericht. Gebruik tussenkopjes, vet, opsommingen en links. Een losse foto tussen de tekst voeg je toe met de knop "+ Embed" → "Asset".',
  })

  // ── De beurs in cijfers ──────────────────────────────────────────────────
  highlights
    .createField('cijfers')
    .name('De beurs in cijfers')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [
        {
          regexp: { pattern: '^[^|]+\\|[^|]+$' },
          message: 'Schrijf het als: getal | omschrijving, bijvoorbeeld 2.400 | bezoekers',
        },
        { size: { max: 60 } },
      ],
    })
    .validations([{ size: { max: 6 } }])
  highlights.moveField('cijfers').afterField('verhaal')

  highlights.changeFieldControl('cijfers', 'builtin', 'tagEditor', {
    helpText: 'Mag leeg blijven. Maximaal 6 regels. Typ een regel als "getal | omschrijving" (bijvoorbeeld 2.400 | bezoekers) en druk op Enter. Sleep om de volgorde te wijzigen.',
  })

  // ── Foto's: nieuwe widget ────────────────────────────────────────────────
  highlights.changeFieldControl('fotos', 'builtin', 'assetLinksEditor', {
    helpText: "Voeg foto's toe met \"Add media\". Sleep foto's om de volgorde te wijzigen. Vul bij elke foto het veld Description in: die tekst wordt voorgelezen aan slechtzienden en verschijnt onder de vergrote foto.",
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  })

  // ── Kop boven de links ───────────────────────────────────────────────────
  highlights
    .createField('linksKop')
    .name('Kop boven de links')
    .type('Symbol')
    .validations([{ size: { max: 60 } }])
  highlights.moveField('linksKop').beforeField('links')

  highlights.changeFieldControl('linksKop', 'builtin', 'singleLine', {
    helpText: 'Mag leeg blijven, dan staat er "Meer zien". Bijvoorbeeld: "Foto\'s en video\'s van anderen".',
  })

  // ── Sponsoren tonen ──────────────────────────────────────────────────────
  highlights
    .createField('toonSponsoren')
    .name('Sponsoren tonen')
    .type('Boolean')
  highlights.moveField('toonSponsoren').afterField('toonBanen')

  highlights.changeFieldControl('toonSponsoren', 'builtin', 'boolean', {
    helpText: 'Zet op "Ja" om onderaan de pagina de logo\'s van onze sponsoren te tonen onder "Met dank aan onze sponsoren".',
    trueLabel: 'Ja',
    falseLabel: 'Nee',
  })
}
