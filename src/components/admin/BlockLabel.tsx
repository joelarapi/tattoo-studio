'use client'

import { Pill, useRowLabel } from '@payloadcms/ui'

/*
 * Admin-only: the header of each page section, e.g. "03  Cards  Let’s make a plan." so a long
 * page can be read (and reordered) with every section folded.
 */

type Heading = { text?: string | null; soft?: string | null } | null
type SectionData = {
  blockType?: string
  heading?: Heading
  tag?: string | null
  label?: string | null
  source?: string | null
  intro?: { heading?: Heading } | null
  list?: { heading?: string | null } | null
  phrases?: { text?: string | null }[] | null
}

const firstLine = (value?: string | null) => value?.split('\n')[0]?.trim() || ''

function summary(data: SectionData | undefined): string {
  if (!data) return ''
  if (data.blockType === 'pageCta' && data.source !== 'own') return 'The shared one'
  return (
    firstLine(data.heading?.text) ||
    firstLine(data.intro?.heading?.text) ||
    firstLine(data.list?.heading) ||
    firstLine(data.tag) ||
    firstLine(data.label) ||
    (data.phrases ?? [])
      .map((phrase) => phrase.text)
      .filter(Boolean)
      .join(' · ')
  )
}

export function BlockLabel({ blockLabel }: { blockLabel?: string }) {
  const { data, rowNumber } = useRowLabel<SectionData>()
  const text = summary(data)
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
      <span className="blocks-field__block-number">
        {String((rowNumber ?? 0) + 1).padStart(2, '0')}
      </span>
      {blockLabel && (
        <Pill className="blocks-field__block-pill" pillStyle="white" size="small">
          {blockLabel}
        </Pill>
      )}
      {text && (
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {text}
        </span>
      )}
    </span>
  )
}
