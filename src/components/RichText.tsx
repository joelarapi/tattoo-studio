import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConverters,
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as PayloadRichText,
} from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/cn'

/** Where an internal link in rich text points, by the linked document's collection. */
export function hrefForDoc(relationTo: string, slug: string | null | undefined): string {
  switch (relationTo) {
    case 'posts':
      return `/journal/${slug ?? ''}`
    case 'artists':
      return `/artists/${slug ?? ''}`
    case 'styles':
      return `/styles/${slug ?? ''}`
    case 'legal-pages':
      return `/${slug ?? ''}`
    default:
      return '/'
  }
}

const links = LinkJSXConverter({
  internalDocToHref: ({ linkNode }) => {
    const doc = linkNode.fields.doc
    if (!doc) return '/'
    const slug = typeof doc.value === 'object' ? (doc.value as { slug?: string }).slug : null
    return hrefForDoc(doc.relationTo, slug)
  },
})

type RichTextProps = {
  data: SerializedEditorState | null | undefined
  className?: string
  /** Extra converters, e.g. the journal's blocks. */
  converters?: JSXConverters
}

/** Renders CMS rich text. Styling comes from the caller (e.g. `prose-dark` in the journal). */
export function RichText({ data, className, converters }: RichTextProps) {
  if (!data) return null
  const all: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    ...links,
    ...converters,
  })
  return <PayloadRichText data={data} converters={all} className={cn(className)} />
}
