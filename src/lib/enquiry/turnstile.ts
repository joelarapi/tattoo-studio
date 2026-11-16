import { TURNSTILE_ACTION } from './config'

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * Checks a Cloudflare Turnstile token (each token is accepted once). Without
 * TURNSTILE_SECRET_KEY the check passes in development and fails in production, so a missing key
 * never leaves the live form unprotected.
 */
export async function verifyTurnstile(token: unknown, ip?: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return process.env.NODE_ENV !== 'production'
  if (typeof token !== 'string' || !token || token.length > 2048) return false

  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set('remoteip', ip)
  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(10_000),
    })
    const result = (await response.json()) as {
      success?: boolean
      action?: string
      metadata?: { result_with_testing_key?: boolean }
    }
    if (result.success !== true) return false
    // Cloudflare's test keys (for local testing) return no action; never accept them live.
    if (result.metadata?.result_with_testing_key) return process.env.VERCEL_ENV !== 'production'
    return result.action === TURNSTILE_ACTION
  } catch {
    return false
  }
}
