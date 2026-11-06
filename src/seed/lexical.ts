import { randomBytes } from 'crypto'

/*
 * Tiny builders for Lexical rich-text JSON, so seed content reads like a document:
 *   doc(h2('Before'), p('Eat first. ', b('Sleep well.')), ul('Water', 'Snacks'))
 */

type Node = { type: string; version: number; [key: string]: unknown }
type Child = string | Node

const base = { format: '' as const, indent: 0, version: 1, direction: 'ltr' as const }

const text = (value: string, format = 0): Node => ({
  type: 'text',
  text: value,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const inline = (children: Child[]) =>
  children.map((child) => (typeof child === 'string' ? text(child) : child))

export const b = (value: string) => text(value, 1)

export const link = (label: string, url: string): Node => ({
  ...base,
  type: 'link',
  version: 3,
  fields: { linkType: 'custom', url, newTab: false },
  children: [text(label)],
})

export const p = (...children: Child[]) => ({
  ...base,
  type: 'paragraph',
  textFormat: 0,
  textStyle: '',
  children: inline(children),
})

export const h2 = (value: string) => ({
  ...base,
  type: 'heading',
  tag: 'h2',
  children: [text(value)],
})

export const h3 = (value: string) => ({
  ...base,
  type: 'heading',
  tag: 'h3',
  children: [text(value)],
})

export const quote = (value: string) => ({ ...base, type: 'quote', children: [text(value)] })

const list = (listType: 'bullet' | 'number', items: Child[][]) => ({
  ...base,
  type: 'list',
  listType,
  tag: listType === 'bullet' ? 'ul' : 'ol',
  start: 1,
  children: items.map((item, index) => ({
    ...base,
    type: 'listitem',
    value: index + 1,
    children: inline(item),
  })),
})

export const ul = (...items: Array<Child | Child[]>) =>
  list(
    'bullet',
    items.map((item) => (Array.isArray(item) ? item : [item])),
  )

export const ol = (...items: Array<Child | Child[]>) =>
  list(
    'number',
    items.map((item) => (Array.isArray(item) ? item : [item])),
  )

/** A custom block (e.g. the CTA or artist card). */
export const block = (blockType: string, fields: Record<string, unknown>) => ({
  type: 'block',
  version: 2,
  format: '',
  fields: { id: randomBytes(12).toString('hex'), blockName: '', blockType, ...fields },
})

export const doc = (...children: Node[]) => ({
  root: { ...base, type: 'root', children },
})
