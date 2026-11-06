import { createHash, timingSafeEqual } from 'crypto'

const digest = (value: string) => createHash('sha256').update(value).digest()

/** Constant-time comparison against a configured secret. False when the secret isn't set. */
export function matchesSecret(provided: string | null | undefined, secret: string | undefined) {
  if (!secret || !provided) return false
  return timingSafeEqual(digest(provided), digest(secret))
}

/** Reads `Authorization: Bearer <token>`. */
export function bearerToken(headers: Headers): string | null {
  const value = headers.get('authorization')
  return value?.startsWith('Bearer ') ? value.slice(7) : null
}
