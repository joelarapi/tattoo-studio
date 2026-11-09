import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { isCmsUser } from '@/access'
import { getPayloadClient } from '@/lib/payload'
import { matchesSecret } from '@/lib/secrets'

/**
 * Turns on draft mode for the CMS's preview and live preview, then opens the page. Needs both the
 * preview secret (in the link the CMS builds) and a logged-in CMS session.
 */
export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path') || '/'
  const secret = req.nextUrl.searchParams.get('secret')

  if (!matchesSecret(secret, process.env.PREVIEW_SECRET)) {
    return new Response('Invalid preview link', { status: 401 })
  }
  // Same-site paths only ("/x", not "//evil.com" or "/\evil.com"), so this can't redirect away.
  if (!/^\/(?![/\\])/.test(path)) {
    return new Response('Invalid path', { status: 400 })
  }

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!isCmsUser(user)) {
    return new Response('Log in to the CMS to see previews', { status: 401 })
  }

  ;(await draftMode()).enable()
  redirect(path)
}
