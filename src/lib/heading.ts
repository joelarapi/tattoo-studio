/** A three-tone heading from the CMS (src/fields/heading.ts). */
export type HeadingValue =
  { text?: string | null; soft?: string | null; accent?: string | null } | null | undefined

/** The heading as one line of plain text, e.g. for page titles and aria labels. */
export function headingText(heading: HeadingValue): string {
  return [heading?.text, heading?.soft, heading?.accent]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
