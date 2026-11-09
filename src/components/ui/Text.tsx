import { Fragment } from 'react'

import { cn } from '@/lib/cn'

/** Plain CMS text with its line breaks kept (Enter in the CMS = a new line). */
export function Lines({ text }: { text: string | null | undefined }) {
  if (!text) return null
  const lines = text.split('\n')
  return lines.map((line, index) => (
    <Fragment key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </Fragment>
  ))
}

/** Plain CMS text as paragraphs: an empty line starts a new paragraph. */
export function Paragraphs({
  text,
  className,
}: {
  text: string | null | undefined
  className?: string
}) {
  if (!text?.trim()) return null
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph, index) => (
      <p key={index} className={cn(className)}>
        <Lines text={paragraph.trim()} />
      </p>
    ))
}
