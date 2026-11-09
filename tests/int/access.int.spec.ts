import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { Lead, Post, User } from '@/payload-types'
import config from '@/payload.config'

/*
 * Access rules from the build spec, checked through the Local API with `overrideAccess: false`
 * (the default `true` would skip access control). Uses the dev database: everything created here
 * is temporary and removed afterwards.
 */

const context = { disableRevalidate: true }
const stamp = Date.now()

let payload: Payload
let editor: User
let lead: Lead
let draftPost: Post

const asEditor = () => ({ user: editor, overrideAccess: false, context })
const asPublic = { overrideAccess: false, context }

describe('access control', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    editor = await payload.create({
      collection: 'users',
      data: {
        name: 'Access test editor',
        email: `editor-${stamp}@example.com`,
        password: `test-${stamp}`,
        roles: ['editor'],
      },
      context,
    })
    lead = await payload.create({
      collection: 'leads',
      data: {
        firstName: 'Access',
        surname: 'Test lead',
        phone: '+355 69 000 0000',
        placement: 'Forearm',
        description: 'Access test',
        status: 'new',
      },
      context,
    })
    draftPost = await payload.create({
      collection: 'posts',
      data: { title: `Access test draft ${stamp}`, slug: `access-test-draft-${stamp}` },
      draft: true,
      context,
    })
  })

  afterAll(async () => {
    await payload.delete({ collection: 'posts', id: draftPost.id, context })
    await payload.delete({ collection: 'leads', id: lead.id, context })
    await payload.delete({ collection: 'users', id: editor.id, context })
  })

  describe('public', () => {
    it('sees published posts only', async () => {
      const { docs } = await payload.find({ collection: 'posts', limit: 100, ...asPublic })
      expect(docs.length).toBeGreaterThan(0)
      expect(docs.every((post) => post._status === 'published')).toBe(true)
      expect(docs.some((post) => post.id === draftPost.id)).toBe(false)
    })

    it('cannot read leads or their reference images', async () => {
      await expect(payload.find({ collection: 'leads', ...asPublic })).rejects.toThrow()
      await expect(payload.find({ collection: 'lead-attachments', ...asPublic })).rejects.toThrow()
    })

    it('cannot create leads through the API', async () => {
      await expect(
        payload.create({
          collection: 'leads',
          data: {
            firstName: 'Spam',
            surname: 'Spam',
            phone: '0',
            placement: 'x',
            description: 'x',
            status: 'new',
          },
          ...asPublic,
        }),
      ).rejects.toThrow()
    })
  })

  describe('editor', () => {
    it('can read leads', async () => {
      const found = await payload.findByID({ collection: 'leads', id: lead.id, ...asEditor() })
      expect(found.name).toBe('Access Test lead')
    })

    it('cannot update or delete leads', async () => {
      await expect(
        payload.update({
          collection: 'leads',
          id: lead.id,
          data: { status: 'contacted' },
          ...asEditor(),
        }),
      ).rejects.toThrow()
      await expect(
        payload.delete({ collection: 'leads', id: lead.id, ...asEditor() }),
      ).rejects.toThrow()
    })

    it('cannot create users', async () => {
      await expect(
        payload.create({
          collection: 'users',
          data: {
            name: 'Nope',
            email: `nope-${stamp}@example.com`,
            password: 'x',
            roles: ['admin'],
          },
          ...asEditor(),
        }),
      ).rejects.toThrow()
    })

    it('cannot make themselves an admin', async () => {
      const updated = await payload.update({
        collection: 'users',
        id: editor.id,
        data: { roles: ['admin'] },
        ...asEditor(),
      })
      expect(updated.roles).toEqual(['editor'])
    })

    it('cannot change tracking IDs', async () => {
      const before = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
      const after = await payload.updateGlobal({
        slug: 'site-settings',
        data: { tracking: { gtmId: 'GTM-HACKED' } },
        ...asEditor(),
      })
      expect(after.tracking?.gtmId ?? null).toBe(before.tracking?.gtmId ?? null)
    })

    it('can edit content', async () => {
      const { docs } = await payload.find({ collection: 'faqs', limit: 1, depth: 0 })
      const faq = docs[0]
      const updated = await payload.update({
        collection: 'faqs',
        id: faq.id,
        data: { question: faq.question },
        ...asEditor(),
      })
      expect(updated.id).toBe(faq.id)
    })
  })

  // An MCP API key is also a "user", of its own auth collection, and its id can equal a CMS
  // user's. Used directly against the REST API (not through /api/mcp) it must get nothing.
  describe('MCP API key used directly', () => {
    const asKey = () => ({
      user: { id: editor.id, collection: 'payload-mcp-api-keys' } as unknown as User,
      overrideAccess: false,
      context,
    })

    it('cannot read or edit the CMS user with the same id', async () => {
      await expect(
        payload.findByID({ collection: 'users', id: editor.id, ...asKey() }),
      ).rejects.toThrow()
      await expect(
        payload.update({ collection: 'users', id: editor.id, data: { name: 'x' }, ...asKey() }),
      ).rejects.toThrow()
    })

    it('has no editor rights', async () => {
      await expect(payload.find({ collection: 'leads', ...asKey() })).rejects.toThrow()
    })
  })
})
