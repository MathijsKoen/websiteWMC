/**
 * Stackbit / Netlify Visual Editor — content-annotatie helpers
 *
 * Voegt `data-sb-object-id` en `data-sb-field-path` attributen toe aan JSX-elementen,
 * zodat de visual editor weet welk Contentful-veld bij welk HTML-element hoort.
 *
 * Gebruik:
 *   <h1 {...sbField(article.id, 'title')}>{article.title}</h1>
 *   <div {...sbObject(article.id)}>...</div>
 */

/** Markeer een element als het ROOT-object (Contentful entry). */
export function sbObject(entryId: string): Record<string, string> {
  return { 'data-sb-object-id': entryId }
}

/** Markeer een element als een bewerkbaar VELD van een entry. */
export function sbField(entryId: string, fieldPath: string): Record<string, string> {
  return {
    'data-sb-object-id': entryId,
    'data-sb-field-path': fieldPath,
  }
}
