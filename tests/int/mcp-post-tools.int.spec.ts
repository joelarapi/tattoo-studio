// The MCP Markdown tools for journal posts. Uses the config only: no database needed.
import type { MCPAccessSettings } from '@payloadcms/plugin-mcp'
import type { SanitizedConfig } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import {
  markdownToPostContent,
  nonMarkdownParts,
  normalizeMarkdown,
  postContentToMarkdown,
  withPostMarkdownTools,
} from '@/plugins/mcpPostTools'
import configPromise from '@/payload.config'

let config: SanitizedConfig

const article = `Some **bold** and *italic* text with [a link](/journal/tattoo-consultation).

## Before your appointment

- Sleep well
- Eat first

### Aftercare

> Keep it clean.`

describe('journal posts as Markdown', () => {
  beforeAll(async () => {
    config = await configPromise
  })

  it('keeps headings within H2–H4', () => {
    expect(normalizeMarkdown('# Intro\r\n##### Deep\n## Fine')).toBe('## Intro\n#### Deep\n## Fine')
  })

  it('converts Markdown to the post editor’s format and back', () => {
    const content = markdownToPostContent(config, article)
    const types = content.root.children.map((node) => node.type)
    expect(types).toEqual(['paragraph', 'heading', 'list', 'heading', 'quote'])
    const back = postContentToMarkdown(config, content)
    expect(back).toContain('## Before your appointment')
    expect(back).toContain('**bold**')
    expect(back).toContain('[a link](/journal/tattoo-consultation)')
    expect(nonMarkdownParts(content)).toBe(0)
  })

  it('counts images and boxes that Markdown can’t hold', () => {
    const content = { root: { children: [{ type: 'paragraph' }, { type: 'upload' }, { type: 'block' }] } }
    expect(nonMarkdownParts(content)).toBe(2)
  })

  it('offers each tool only to keys that may do the same with posts', () => {
    const settings = withPostMarkdownTools({
      posts: { find: true, create: false, update: true },
    } as unknown as MCPAccessSettings)
    expect(settings['payload-mcp-tool']).toEqual({
      getPostAsMarkdown: true,
      createPostFromMarkdown: false,
      updatePostFromMarkdown: true,
    })
  })
})
