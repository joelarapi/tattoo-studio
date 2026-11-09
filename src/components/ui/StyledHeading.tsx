import type { HeadingValue } from '@/lib/heading'

import { Lines } from './Text'

type StyledHeadingProps = {
  value: HeadingValue
  as?: 'h1' | 'h2' | 'h3'
  id?: string
  className?: string
}

/** A three-tone CMS heading: white, then grey, then orange, each from a new line. */
export function StyledHeading({ value, as: Tag = 'h2', id, className }: StyledHeadingProps) {
  if (!value?.text) return null
  return (
    <Tag id={id} className={className}>
      <Lines text={value.text} />
      {value.soft && (
        <>
          <br />
          <span className="text-soft">
            <Lines text={value.soft} />
          </span>
        </>
      )}
      {value.accent && (
        <>
          <br />
          <span className="text-accent">
            <Lines text={value.accent} />
          </span>
        </>
      )}
    </Tag>
  )
}
