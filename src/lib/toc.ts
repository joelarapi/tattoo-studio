type LexicalNode = { type?: string; tag?: string; text?: string; children?: LexicalNode[] }

const textOf = (node: LexicalNode): string =>
  node.text ?? (node.children ?? []).map(textOf).join('')

/** "Start with what matters to you." → "start-with-what-matters-to-you" */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function headingNodeId(node: LexicalNode): string {
  return headingId(textOf(node))
}

/** The H2 headings of an article, for the "In this guide" list. */
export function tableOfContents(content: unknown): { id: string; text: string }[] {
  const root = (content as { root?: LexicalNode } | null | undefined)?.root
  return (root?.children ?? [])
    .filter((node) => node.type === 'heading' && node.tag === 'h2')
    .map((node) => ({ id: headingNodeId(node), text: textOf(node) }))
    .filter((item) => item.id)
}
