type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }

/** Flattens Lexical rich text to plain text (for meta descriptions and reading time). */
export function richTextToPlainText(value: unknown): string {
  const root = (value as { root?: LexicalNode } | null | undefined)?.root
  if (!root) return ''
  const blocks: string[] = []
  const collect = (node: LexicalNode): string =>
    node.text ?? (node.children ?? []).map(collect).join('')
  for (const child of root.children ?? []) {
    const text = collect(child).trim()
    if (text) blocks.push(text)
  }
  return blocks.join(' ')
}

/** Cuts text at a word boundary so it fits `max` characters, adding an ellipsis when cut. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}
