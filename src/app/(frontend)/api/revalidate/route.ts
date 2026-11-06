import type { NextRequest } from 'next/server'

import { revalidateTargets } from '@/hooks/revalidate'
import { bearerToken, matchesSecret } from '@/lib/secrets'

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.length <= 50 && value.every((item) => typeof item === 'string')

/**
 * On-demand revalidation for code running outside a Next.js request (e.g. scheduled publishing
 * in Payload's job runner). Body: `{ tags: string[], paths: string[] }`, with
 * `Authorization: Bearer $REVALIDATE_SECRET`.
 */
export async function POST(req: NextRequest) {
  if (!matchesSecret(bearerToken(req.headers), process.env.REVALIDATE_SECRET)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: unknown = await req.json().catch(() => null)
  const { tags = [], paths = [] } = (body ?? {}) as { tags?: unknown; paths?: unknown }
  if (!isStringList(tags) || !isStringList(paths) || paths.some((path) => !path.startsWith('/'))) {
    return Response.json({ error: 'Expected { tags: string[], paths: string[] }' }, { status: 400 })
  }

  revalidateTargets({ tags, paths })
  return Response.json({ revalidated: true, tags, paths })
}
