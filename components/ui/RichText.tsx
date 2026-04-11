import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, type Document, type Block, type Inline } from '@contentful/rich-text-types'
import type { Options } from '@contentful/rich-text-react-renderer'
import type { ReactNode } from 'react'

interface RichTextProps {
  document: Document
  className?: string
}

const options: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node: Block | Inline, children: ReactNode) => (
      <p className="text-[#4d4c4c] leading-relaxed mb-4 last:mb-0">{children}</p>
    ),
    [BLOCKS.HEADING_2]: (_node: Block | Inline, children: ReactNode) => (
      <h2
        className="font-black text-2xl tracking-tight text-[#1a1c1c] mt-8 mb-4 first:mt-0"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (_node: Block | Inline, children: ReactNode) => (
      <h3
        className="font-black text-xl tracking-tight text-[#1a1c1c] mt-6 mb-3 first:mt-0"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {children}
      </h3>
    ),
    [BLOCKS.UL_LIST]: (_node: Block | Inline, children: ReactNode) => (
      <ul className="mb-4 space-y-1">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node: Block | Inline, children: ReactNode) => (
      <ol className="mb-4 space-y-1 list-decimal pl-5">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node: Block | Inline, children: ReactNode) => (
      <li className="flex items-start gap-2 text-[#4d4c4c] text-sm">
        <div className="w-1.5 h-1.5 bg-[#cc0000] mt-2 shrink-0" />
        <div>{children}</div>
      </li>
    ),
    [BLOCKS.QUOTE]: (_node: Block | Inline, children: ReactNode) => (
      <blockquote className="border-l-4 border-[#cc0000] pl-4 my-4 italic text-[#5e3f3a]">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="border-[#e2e2e2] my-6" />,
    [INLINES.HYPERLINK]: (node: Block | Inline, children: ReactNode) => {
      const uri = (node.data as { uri: string }).uri
      return (
        <a
          href={uri}
          className="text-[#cc0000] font-bold hover:text-[#9e0000] underline underline-offset-2 transition-colors"
          target={uri.startsWith('http') ? '_blank' : undefined}
          rel={uri.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
  },
}

export function RichText({ document, className = '' }: RichTextProps) {
  return (
    <div className={className}>
      {documentToReactComponents(document, options)}
    </div>
  )
}
