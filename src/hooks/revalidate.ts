import { revalidatePath, revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionSlug,
  GlobalAfterChangeHook,
  GlobalSlug,
  PayloadRequest,
} from 'payload'

import { collectionTag, globalTag } from '@/lib/cache-tags'
import { getServerURL } from '@/lib/preview'

/*
 * On-demand revalidation. Published changes refresh every cached page that reads the changed
 * collection or global (see src/lib/cache-tags.ts), plus the document's own URL.
 *
 * `revalidateTag` only works inside a Next.js request. Scheduled publishing runs in Payload's job
 * runner, outside any request, so in that case we ask the running server to revalidate through
 * the secret-protected /api/revalidate route instead. The seed script sets
 * `context.disableRevalidate` because there's no server to tell.
 */

export type RevalidateTargets = { tags: string[]; paths: string[] }

/** Expire immediately, so editors see their change on the very next request. */
const PROFILE = { expire: 0 }

export function revalidateTargets(targets: RevalidateTargets): void {
  for (const tag of targets.tags) revalidateTag(tag, PROFILE)
  for (const path of targets.paths) revalidatePath(path)
}

async function revalidate(req: PayloadRequest, targets: RevalidateTargets): Promise<void> {
  if (req.context.disableRevalidate) return
  try {
    revalidateTargets(targets)
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('static generation store missing')) {
      req.payload.logger.error({ err: error }, 'Revalidation failed')
      return
    }
    await revalidateViaServer(req, targets)
  }
}

async function revalidateViaServer(req: PayloadRequest, targets: RevalidateTargets) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    req.payload.logger.warn('REVALIDATE_SECRET is not set; skipped revalidation outside a request')
    return
  }
  try {
    const res = await fetch(`${getServerURL()}/api/revalidate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${secret}` },
      body: JSON.stringify(targets),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  } catch (error) {
    req.payload.logger.error({ err: error }, 'Revalidation via /api/revalidate failed')
  }
}

type PublicDoc = { slug?: string | null; _status?: 'draft' | 'published' | null }

/**
 * Whether a save changes what the public sees. Drafts never do, autosaves never do; publishing
 * and unpublishing do. Collections without drafts always do.
 */
function affectsPublicSite(req: PayloadRequest, doc: PublicDoc, previousDoc?: PublicDoc) {
  if (String(req.query?.autosave) === 'true') return false
  if (doc._status === undefined) return true
  return doc._status === 'published' || previousDoc?._status === 'published'
}

/**
 * `afterChange` and `afterDelete` hooks for a collection. `paths` returns the document's public
 * URLs, e.g. `/journal/${doc.slug}`.
 */
export function revalidateCollection({
  collection,
  paths = () => [],
}: {
  collection: CollectionSlug
  paths?: (doc: PublicDoc) => string[]
}): { afterChange: CollectionAfterChangeHook; afterDelete: CollectionAfterDeleteHook } {
  const tags = [collectionTag(collection)]
  return {
    afterChange: async ({ doc, previousDoc, req }) => {
      if (affectsPublicSite(req, doc, previousDoc)) {
        // Include the old URLs too, so a renamed slug stops serving the old page.
        const allPaths = new Set([...paths(doc), ...(previousDoc ? paths(previousDoc) : [])])
        await revalidate(req, { tags, paths: [...allPaths] })
      }
      return doc
    },
    afterDelete: async ({ doc, req }) => {
      await revalidate(req, { tags, paths: paths(doc) })
      return doc
    },
  }
}

/** `afterChange` hook for a global. */
export function revalidateGlobal({
  global,
  paths = [],
}: {
  global: GlobalSlug
  paths?: string[]
}): GlobalAfterChangeHook {
  return async ({ doc, previousDoc, req }) => {
    if (affectsPublicSite(req, doc, previousDoc)) {
      await revalidate(req, { tags: [globalTag(global)], paths })
    }
    return doc
  }
}
