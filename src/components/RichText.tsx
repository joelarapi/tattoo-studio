import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConverters,
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as PayloadRichText,
} from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/cn'
import { pathForDoc } from '@/lib/routes'

const links = LinkJSXConverter({
  internalDocToHref: ({ linkNode }) => {
    const doc = linkNode.fields.doc
    if (!doc) return '/'
    const slug = typeof doc.value === 'object' ? (doc.value as { slug?: string }).slug : null
    return pathForDoc(doc.relationTo, slug)
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
