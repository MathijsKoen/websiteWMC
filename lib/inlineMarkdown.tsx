import type { ReactNode } from 'react'

const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g

function isSafeHref(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:|\/)/i.test(href)
}

/**
 * Render eenvoudige inline markdown links zoals [label](https://example.com "title").
 */
export function renderInlineMarkdownLinks(text: string, linkClassName = ''): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0

  for (const match of text.matchAll(MARKDOWN_LINK_REGEX)) {
    const fullMatch = match[0]
    const label = match[1]
    const href = match[2]
    const start = match.index ?? 0

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start))
    }

    if (isSafeHref(href)) {
      const isExternal = /^https?:\/\//i.test(href)
      nodes.push(
        <a
          key={`md-link-${start}`}
          href={href}
          className={linkClassName}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {label}
        </a>
      )
    } else {
      nodes.push(label)
    }

    lastIndex = start + fullMatch.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes.length ? nodes : [text]
}

/**
 * Zet inline markdown links om naar leesbare previewtekst zonder syntax.
 */
export function stripInlineMarkdownLinks(text: string): string {
  return text.replace(MARKDOWN_LINK_REGEX, '$1')
}
