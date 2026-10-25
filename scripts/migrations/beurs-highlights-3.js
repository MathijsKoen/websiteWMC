/**
 * Contentful-migratie (vervolg op beurs-highlights-2.js):
 *
 *  - Link: optioneel veld "Voorbeeldafbeelding" voor het linkkaartje op de website
 *
 * Het ongebruikte veld "De beurs in cijfers" (beursHighlights.cijfers) is al
 * handmatig in de Contentful UI verwijderd.
 *
 * Gebruik:
 *   npx contentful-cli space migration \
 *     --space-id <SPACE_ID> --environment-id master \
 *     --management-token <MANAGEMENT_TOKEN> \
 *     scripts/migrations/beurs-highlights-3.js
 */

module.exports = function (migration) {
  const link = migration.editContentType('beursLink')

  link
    .createField('afbeelding')
    .name('Voorbeeldafbeelding')
    .type('Link')
    .linkType('Asset')
    .validations([{ linkMimetypeGroup: ['image'], message: 'Hier kan alleen een foto of afbeelding worden toegevoegd.' }])

  link.changeFieldControl('afbeelding', 'builtin', 'assetLinkEditor', {
    helpText: 'Mag leeg blijven: de website haalt dan zelf de afbeelding van de gelinkte pagina op (zoals WhatsApp doet). Voeg hier alleen een afbeelding toe als die niet goed verschijnt.',
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  })
}
