import type { MCPAccessSettings, MCPPluginConfig } from '@payloadcms/plugin-mcp'
import {
  convertLexicalToMarkdown,
  convertMarkdownToLexical,
  editorConfigFactory,
} from '@payloadcms/richtext-lexical'
import type { PayloadRequest, RichTextField, SanitizedConfig } from 'payload'
import { z } from 'zod'

import type { Post } from '@/payload-types'
import { getCanonicalOrigin } from '@/lib/site-url'

/*
 * MCP tools that read and write journal posts as Markdown. The article body is stored as Lexical
 * JSON, which costs an assistant about three times as many characters to read or write; these
 * tools convert on the server instead. Writes are always saved as drafts for the owner to publish.
 *
 * A key may use them when it may find, create or update posts (`withPostMarkdownTools`), so they
 * add no checkboxes to the keys collection (and no database columns).
 */

type McpTool = NonNullable<NonNullable<MCPPluginConfig['mcp']>['tools']>[number]

/** The post editor's settings, so the conversion knows its headings, links and lists. */
function postEditorConfig(config: SanitizedConfig) {
  const field = config.collections
    .find(({ slug }) => slug === 'posts')
    ?.flattenedFields.find(({ name }) => name === 'content')
  if (field?.type !== 'richText') throw new Error('posts.content is not a rich text field')
  return editorConfigFactory.fromField({ field: field as RichTextField })
}

/**
 * The title is the page's H1 and the editor offers H2–H4, so a lone `#` becomes `##` and
 * `#####`/`######` become `####`. Line endings are normalised.
 */
export function normalizeMarkdown(markdown: string) {
  return markdown
    .replace(/\r\n?/g, '\n')
    .replace(/^#(?!#)[ \t]+/gm, '## ')
    .replace(/^#{5,6}[ \t]+/gm, '#### ')
    .trim()
}

export function markdownToPostContent(config: SanitizedConfig, markdown: string) {
  return convertMarkdownToLexical({
    editorConfig: postEditorConfig(config),
    markdown: normalizeMarkdown(markdown),
  }) as unknown as Post['content']
}

export function postContentToMarkdown(config: SanitizedConfig, content: Post['content']) {
  return convertLexicalToMarkdown({
    data: content as Parameters<typeof convertLexicalToMarkdown>[0]['data'],
    editorConfig: postEditorConfig(config),
  }).trim()
}

/** Images and boxes (call to action) in a body, which Markdown can't hold. */
export function nonMarkdownParts(content: unknown) {
  let count = 0
  const visit = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const { type, children } = node as { type?: unknown; children?: unknown }
    if (type === 'upload' || type === 'block' || type === 'inlineBlock' || type === 'relationship')
      count++
    if (Array.isArray(children)) children.forEach(visit)
  }
  visit((content as { root?: unknown } | null)?.root)
  return count
}

/** Turns the Markdown tools on for keys that may use posts. */
export function withPostMarkdownTools(settings: MCPAccessSettings): MCPAccessSettings {
  const posts = settings.posts as { find?: boolean; create?: boolean; update?: boolean } | undefined
  return {
    ...settings,
    'payload-mcp-tool': {
      ...settings['payload-mcp-tool'],
      getPostAsMarkdown: Boolean(posts?.find),
      createPostFromMarkdown: Boolean(posts?.create),
      updatePostFromMarkdown: Boolean(posts?.update),
    },
  }
}

const reply = (text: string) => ({ content: [{ type: 'text' as const, text }] })

const failure = (action: string, error: unknown) =>
  reply(`Couldn’t ${action}: ${error instanceof Error ? error.message : String(error)}`)

const adminLink = (id: number) => `${getCanonicalOrigin()}/admin/collections/posts/${id}`

const savedDraft = (verb: string, doc: Pick<Post, 'id' | 'title' | 'slug'>) =>
  reply(
    `${verb} draft post ${doc.id} “${doc.title}” (slug: ${doc.slug}). It isn’t live: the owner reviews and publishes it at ${adminLink(doc.id)}`,
  )

const fields = {
  title: z.string().min(1).max(200).describe('Headline, ideally under 60 characters.'),
  excerpt: z
    .string()
    .min(1)
    .max(160)
    .describe('One or two sentences for post lists and Google. Max 160 characters.'),
  markdown: z
    .string()
    .min(1)
    .describe(
      'The article body in Markdown: ## for sections (### and #### below them), paragraphs, **bold**, *italic*, lists, > quotes and [links](/journal/some-post). No # heading: the title is the H1. Images and call-to-action boxes can’t be written in Markdown; the owner adds them in the admin.',
    ),
  coverId: z.number().int().describe('Media id of the cover image (find one with findMedia).'),
  categoryIds: z.array(z.number().int()).describe('Journal category ids (findCategories).'),
  authorId: z
    .number()
    .int()
    .nullable()
    .describe('Artist id to credit (findArtists). null credits the studio.'),
  tags: z.array(z.string().min(1).max(60)).max(20).describe('Optional keywords.'),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .describe('The address after /journal/, e.g. "first-tattoo-tips".'),
}

const createArgs = z.object({
  ...fields,
  categoryIds: fields.categoryIds.optional(),
  authorId: fields.authorId.optional(),
  tags: fields.tags.optional(),
  slug: fields.slug.optional().describe('Made from the title if left out.'),
})

const updateArgs = z
  .object({ id: z.number().int().describe('The post’s id.') })
  .merge(z.object(fields).partial())

const getArgs = z.object({
  id: z.number().int().optional().describe('The post’s id.'),
  slug: fields.slug.optional(),
})

/** The fields given, under their names in the collection (the body is converted separately). */
const postData = (input: Partial<z.infer<typeof updateArgs>>) => ({
  ...(input.title !== undefined && { title: input.title }),
  ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
  ...(input.coverId !== undefined && { cover: input.coverId }),
  ...(input.categoryIds !== undefined && { categories: input.categoryIds }),
  ...(input.authorId !== undefined && { author: input.authorId }),
  ...(input.tags !== undefined && { tags: input.tags }),
  ...(input.slug !== undefined && { slug: input.slug }),
})

const relationId = (value: unknown) =>
  value && typeof value === 'object' && 'id' in value ? (value as { id: unknown }).id : value

export const postMarkdownTools: McpTool[] = [
  {
    name: 'getPostAsMarkdown',
    description:
      'Read one journal post (by id or slug) with its body as Markdown, including unpublished changes. Cheaper than findPosts for reading an article.',
    parameters: getArgs.shape,
    handler: async (args, req: PayloadRequest) => {
      try {
        const { id, slug } = getArgs.parse(args)
        if (id === undefined && !slug) return reply('Give the post’s id or slug.')
        const { docs } = await req.payload.find({
          collection: 'posts',
          where: id !== undefined ? { id: { equals: id } } : { slug: { equals: slug } },
          limit: 1,
          depth: 0,
          draft: true,
          overrideAccess: false,
          req,
        })
        const post = docs[0]
        if (!post) return reply('No journal post found.')
        const extra = nonMarkdownParts(post.content)
        const details = {
          id: post.id,
          title: post.title,
          slug: post.slug,
          status: post._status,
          excerpt: post.excerpt,
          coverId: relationId(post.cover),
          categoryIds: (post.categories ?? []).map(relationId),
          authorId: relationId(post.author) ?? null,
          tags: post.tags ?? [],
          publishedAt: post.publishedAt ?? null,
          ...(extra && {
            note: `The body also has ${extra} image(s) or box(es) that Markdown can’t show. Don’t replace this body with updatePostFromMarkdown; change it in the admin.`,
          }),
        }
        return reply(
          `${JSON.stringify(details, null, 1)}\n\n---\n\n${postContentToMarkdown(req.payload.config, post.content)}`,
        )
      } catch (error) {
        return failure('read the post', error)
      }
    },
  },
  {
    name: 'createPostFromMarkdown',
    description:
      'Create a journal post from Markdown. It is saved as a draft; the owner reviews and publishes it in the admin. Prefer this to createPosts.',
    parameters: createArgs.shape,
    handler: async (args, req: PayloadRequest) => {
      try {
        const input = createArgs.parse(args)
        const doc = await req.payload.create({
          collection: 'posts',
          draft: true,
          depth: 0,
          overrideAccess: false,
          req,
          data: {
            ...postData(input),
            title: input.title,
            excerpt: input.excerpt,
            cover: input.coverId,
            content: markdownToPostContent(req.payload.config, input.markdown),
            _status: 'draft' as const,
          },
        })
        return savedDraft('Created', doc)
      } catch (error) {
        return failure('create the post', error)
      }
    },
  },
  {
    name: 'updatePostFromMarkdown',
    description:
      'Change a journal post: send only the fields to change; markdown replaces the whole body. Saved as a draft over the live version, which stays as it is until the owner publishes. Prefer this to updatePosts.',
    parameters: updateArgs.shape,
    handler: async (args, req: PayloadRequest) => {
      try {
        const input = updateArgs.parse(args)
        let content: Post['content'] | undefined
        if (input.markdown !== undefined) {
          const current = await req.payload.findByID({
            collection: 'posts',
            id: input.id,
            depth: 0,
            draft: true,
            overrideAccess: false,
            req,
            select: { content: true },
          })
          if (nonMarkdownParts(current.content))
            return reply(
              'Not changed: this post’s body has images or call-to-action boxes that Markdown can’t keep. Change the body in the admin; other fields can still be updated here.',
            )
          content = markdownToPostContent(req.payload.config, input.markdown)
        }
        const doc = await req.payload.update({
          collection: 'posts',
          id: input.id,
          draft: true,
          depth: 0,
          overrideAccess: false,
          req,
          data: { ...postData(input), ...(content && { content }), _status: 'draft' as const },
        })
        return savedDraft('Updated', doc)
      } catch (error) {
        return failure('update the post', error)
      }
    },
  },
]
