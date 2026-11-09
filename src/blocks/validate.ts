import { ENQUIRY_ID } from '@/lib/routes'

import { heroBlockSlugs } from './index'

type Row = { blockType?: string; settings?: { anchor?: string | null } | null }

// IDs the site itself puts on the page.
const reservedAnchors = new Set(['main', 'hero', ENQUIRY_ID])

/** Section IDs must be unique on a page, and not clash with the site's own. */
function checkAnchors(rows: Row[]): true | string {
  const seen = new Set<string>()
  for (const row of rows) {
    const anchor = row.settings?.anchor
    if (!anchor) continue
    if (reservedAnchors.has(anchor)) {
      return `The section ID "${anchor}" is used by the site itself. Choose another one.`
    }
    if (seen.has(anchor)) {
      return `Two sections have the ID "${anchor}". Give each section its own ID.`
    }
    seen.add(anchor)
  }
  return true
}

/** A page's sections: at most one page top, first; at most one enquiry form; unique IDs. */
export function validateLayout(value: unknown): true | string {
  const rows = (Array.isArray(value) ? value : []) as Row[]
  const heroes = rows.flatMap((row, index) =>
    row.blockType && heroBlockSlugs.includes(row.blockType) ? [index] : [],
  )
  if (heroes.length > 1) return 'A page can have only one page top. Remove the extra one.'
  if (heroes[0] > 0) {
    return 'The page top must be the first section. Drag it to the top, or remove it.'
  }
  if (rows.filter((row) => row.blockType === 'enquiry').length > 1) {
    return 'A page can have only one enquiry form. Remove the extra one.'
  }
  return checkAnchors(rows)
}

/** The sections after a piece or article: unique IDs. */
export function validateSections(value: unknown): true | string {
  return checkAnchors((Array.isArray(value) ? value : []) as Row[])
}
