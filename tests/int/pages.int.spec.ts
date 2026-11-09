import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { Page, User } from '@/payload-types'
import config from '@/payload.config'

/*
 * The page builder's rules, through the Local API. Uses the dev database: everything created here
 * is temporary and removed afterwards.
 */

const context = { disableRevalidate: true }
const stamp = Date.now()
const slug = `test-page-${stamp}`

let payload: Payload
let editor: User
const created: number[] = []

const asEditor = () => ({ user: editor, overrideAccess: false, context })

const cta = { blockType: 'pageCta' as const, source: 'shared' as const }
const hero = {
  blockType: 'pageHero' as const,
  heading: { text: 'A test page.' },
}

async function createPage(data: Partial<Page>, options = asEditor()) {
  const page = await payload.create({
    collection: 'pages',
    data: { title: 'Test page', slug, _status: 'published', ...data } as Page,
    ...options,
  })
  created.push(page.id)
  return page
}

describe('page builder', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    editor = await payload.create({
      collection: 'users',
      data: {
        name: 'Page test editor',
        email: `pages-${stamp}@example.com`,
        password: `test-${stamp}`,
        roles: ['editor'],
      },
      context,
    })
  })

  afterAll(async () => {
    for (const id of created) {
      await payload.delete({ collection: 'pages', id, context }).catch(() => undefined)
    }
    await payload.delete({ collection: 'users', id: editor.id, context })
  })

  it('lets an editor create a page from sections', async () => {
    const page = await createPage({ layout: [hero, cta] })
    expect(page.layout?.map((block) => block.blockType)).toEqual(['pageHero', 'pageCta'])
    await payload.delete({ collection: 'pages', id: page.id, ...asEditor() })
    created.pop()
  })

  it('keeps sections and their relationships through a save', async () => {
    const { docs: faqs } = await payload.find({ collection: 'faqs', limit: 2, depth: 0 })
    const page = await createPage({
      layout: [
        hero,
        {
          blockType: 'faq',
          heading: { text: 'Questions.' },
          faqs: faqs.map((faq) => faq.id),
          settings: { anchor: 'questions', jumpLabel: 'Questions', background: 'line' },
        },
      ],
    })
    const read = await payload.findByID({ collection: 'pages', id: page.id, depth: 1 })
    const faqBlock = read.layout?.[1]
    expect(faqBlock?.blockType).toBe('faq')
    if (faqBlock?.blockType !== 'faq') return
    expect(faqBlock.settings?.anchor).toBe('questions')
    expect(faqBlock.faqs?.every((faq) => typeof faq === 'object')).toBe(true)
    await payload.delete({ collection: 'pages', id: page.id, context })
    created.pop()
  })

  it('rejects a page top that is not the first section', async () => {
    await expect(createPage({ layout: [cta, hero] })).rejects.toThrow()
  })

  it('rejects a second enquiry form', async () => {
    const enquiry = { blockType: 'enquiry' as const, heading: { text: 'Got an idea?' } }
    await expect(createPage({ layout: [enquiry, enquiry] })).rejects.toThrow()
  })

  it('rejects the same section ID twice', async () => {
    const section = {
      blockType: 'faq' as const,
      heading: { text: 'Questions.' },
      settings: { anchor: 'same' },
    }
    await expect(createPage({ layout: [section, section] })).rejects.toThrow()
  })

  it('rejects addresses the site uses itself', async () => {
    for (const reserved of ['admin', 'api', 'lp']) {
      await expect(createPage({ slug: reserved, layout: [cta] })).rejects.toThrow()
    }
  })

  it('never deletes or renames the homepage', async () => {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      limit: 1,
      depth: 0,
    })
    const home = docs[0]
    expect(home).toBeDefined()
    await expect(
      payload.delete({ collection: 'pages', id: home.id, ...asEditor() }),
    ).rejects.toThrow()
    const renamed = await payload.update({
      collection: 'pages',
      id: home.id,
      data: { slug: `renamed-${stamp}` },
      ...asEditor(),
    })
    expect(renamed.slug).toBe('home')
  })

  it('shows the public only published pages', async () => {
    const draft = await createPage({ slug: `${slug}-draft`, _status: 'draft', layout: [cta] })
    const { docs } = await payload.find({
      collection: 'pages',
      where: { id: { equals: draft.id } },
      overrideAccess: false,
    })
    expect(docs).toHaveLength(0)
  })
})
