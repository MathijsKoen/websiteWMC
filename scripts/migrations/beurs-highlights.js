/**
 * Contentful-migratie: content model voor de pagina "Highlights Beurs 2026" (/beurs-2026).
 *
 * Maakt twee content types aan:
 *  - beursLink        — één link (label + webadres + optionele omschrijving)
 *  - beursHighlights  — de pagina zelf (titel, intro, foto's, links, banen tonen ja/nee)
 *
 * Bestaande content (o.a. de uitgenodigde banen, `beursLayout`) wordt niet aangeraakt.
 *
 * Gebruik (eenmalig):
 *   npx contentful-cli space migration \
 *     --space-id <SPACE_ID> --environment-id master \
 *     --management-token <MANAGEMENT_TOKEN> \
 *     scripts/migrations/beurs-highlights.js
 */

module.exports = function (migration) {
  // ── Link ────────────────────────────────────────────────────────────────
  const link = migration
    .createContentType('beursLink')
    .name('Link')
    .description('Een link naar een andere website, getoond op de pagina Highlights Beurs.')
    .displayField('label')

  link
    .createField('label')
    .name('Tekst van de link')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 80 } }])

  link
    .createField('url')
    .name('Webadres')
    .type('Symbol')
    .required(true)
    .validations([
      {
        regexp: { pattern: '^https?://\\S+$' },
        message: 'Het webadres moet beginnen met https:// (of http://) en mag geen spaties bevatten.',
      },
    ])

  link
    .createField('omschrijving')
    .name('Korte omschrijving')
    .type('Symbol')
    .validations([{ size: { max: 200 } }])

  link.changeFieldControl('label', 'builtin', 'singleLine', {
    helpText: 'De tekst die bezoekers zien, bijvoorbeeld "Fotoalbum van Modelspoorclub Alkmaar".',
  })
  link.changeFieldControl('url', 'builtin', 'urlEditor', {
    helpText: 'Kopieer het adres uit de adresbalk van je browser, bijvoorbeeld https://www.voorbeeld.nl. De link opent in een nieuw tabblad.',
  })
  link.changeFieldControl('omschrijving', 'builtin', 'singleLine', {
    helpText: 'Mag leeg blijven. Eén zin over wat je op de website vindt.',
  })

  // ── Highlights Beurs ────────────────────────────────────────────────────
  const highlights = migration
    .createContentType('beursHighlights')
    .name('Highlights Beurs')
    .description('De pagina Highlights Beurs 2026 (dewmc.nl/beurs-2026). Er hoort maar één item van dit type te zijn.')
    .displayField('titel')

  highlights
    .createField('titel')
    .name('Paginatitel')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 80 } }])

  highlights
    .createField('intro')
    .name('Introductietekst')
    .type('Text')
    .validations([{ size: { max: 3000 } }])

  highlights
    .createField('fotos')
    .name("Foto's")
    .type('Array')
    .items({
      type: 'Link',
      linkType: 'Asset',
      validations: [{ linkMimetypeGroup: ['image'], message: "Hier kunnen alleen foto's worden toegevoegd." }],
    })
    .validations([{ size: { max: 200 } }])

  highlights
    .createField('links')
    .name('Links')
    .type('Array')
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['beursLink'] }],
    })
    .validations([{ size: { max: 50 } }])

  highlights
    .createField('toonBanen')
    .name('Uitgenodigde banen tonen')
    .type('Boolean')

  highlights
    .createField('seoOmschrijving')
    .name('Omschrijving voor Google')
    .type('Symbol')
    .validations([{ size: { max: 160 } }])

  highlights.changeFieldControl('titel', 'builtin', 'singleLine', {
    helpText: 'De grote kop bovenaan de pagina, bijvoorbeeld "Highlights Beurs 2026".',
  })
  highlights.changeFieldControl('intro', 'builtin', 'multipleLine', {
    helpText: 'Korte terugblik op de beurs. De eerste alinea komt bovenaan in de kop. Laat een lege regel tussen alinea\'s.',
  })
  highlights.changeFieldControl('fotos', 'builtin', 'assetGallery', {
    helpText: "Voeg foto's toe met \"Add media\". Sleep foto's om de volgorde te wijzigen. Vul bij elke foto het veld Description in: die tekst wordt voorgelezen aan slechtzienden en verschijnt onder de vergrote foto.",
  })
  highlights.changeFieldControl('links', 'builtin', 'entryLinksEditor', {
    helpText: 'Klik op "Add content" en kies "Link" om een nieuwe link te maken. Sleep links om de volgorde te wijzigen.',
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  })
  highlights.changeFieldControl('toonBanen', 'builtin', 'boolean', {
    helpText: 'Zet op "Ja" om onderaan de pagina de uitgenodigde banen te tonen onder het kopje "Deze banen waren te zien".',
    trueLabel: 'Ja',
    falseLabel: 'Nee',
  })
  highlights.changeFieldControl('seoOmschrijving', 'builtin', 'singleLine', {
    helpText: 'Mag leeg blijven. Korte tekst (max. 160 tekens) die Google en WhatsApp tonen bij een link naar deze pagina.',
  })
}
