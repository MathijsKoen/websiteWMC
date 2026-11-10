/**
 * Contentful-migratie (vervolg op beurs-highlights-3.js): sectie voor de winnaar
 * van de booknook-wedstrijd op "Highlights Beurs".
 *
 *  - Nieuw: Booknook: kop, Booknook: tekst (rich text), Booknook: foto's
 *
 * De sectie staat op de pagina onder de fotogalerij en verschijnt pas als er
 * tekst of foto's zijn ingevuld. Bestaande velden en content blijven staan.
 *
 * Gebruik:
 *   npx contentful-cli space migration \
 *     --space-id <SPACE_ID> --environment-id master \
 *     --management-token <MANAGEMENT_TOKEN> \
 *     scripts/migrations/beurs-highlights-4.js
 */

module.exports = function (migration) {
  const highlights = migration.editContentType('beursHighlights')

  // ── Kop ──────────────────────────────────────────────────────────────────
  highlights
    .createField('booknookKop')
    .name('Booknook: kop')
    .type('Symbol')
    .validations([{ size: { max: 80 } }])
  highlights.moveField('booknookKop').afterField('fotos')

  highlights.changeFieldControl('booknookKop', 'builtin', 'singleLine', {
    helpText: 'Mag leeg blijven, dan staat er "De winnaar". Bijvoorbeeld de naam van de winnaar of de titel van de booknook.',
  })

  // ── Tekst (rich text) ────────────────────────────────────────────────────
  highlights
    .createField('booknookTekst')
    .name('Booknook: tekst')
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
          'hyperlink',
        ],
        message: 'Dit onderdeel wordt niet ondersteund op deze pagina.',
      },
    ])
  highlights.moveField('booknookTekst').afterField('booknookKop')

  highlights.changeFieldControl('booknookTekst', 'builtin', 'richTextEditor', {
    helpText: 'Vertel wie er gewonnen heeft en waarom. De sectie verschijnt op de pagina zodra hier tekst staat of er foto\'s zijn toegevoegd.',
  })

  // ── Foto's ───────────────────────────────────────────────────────────────
  highlights
    .createField('booknookFotos')
    .name("Booknook: foto's")
    .type('Array')
    .items({
      type: 'Link',
      linkType: 'Asset',
      validations: [{ linkMimetypeGroup: ['image'], message: "Hier kunnen alleen foto's worden toegevoegd." }],
    })
    .validations([{ size: { max: 20 } }])
  highlights.moveField('booknookFotos').afterField('booknookTekst')

  highlights.changeFieldControl('booknookFotos', 'builtin', 'assetLinksEditor', {
    helpText: "Voeg foto's toe met \"Add media\". Sleep foto's om de volgorde te wijzigen. Vul bij elke foto het veld Description in: die tekst wordt voorgelezen aan slechtzienden en verschijnt onder de vergrote foto.",
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  })
}
