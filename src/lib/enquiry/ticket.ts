import { createHmac, timingSafeEqual } from 'crypto'

/** A reference file the server agreed to receive: its pending key, type and exact size. */
export type TicketFile = { key: string; type: string; size: number }

type Ticket = { files: TicketFile[]; exp: number }

/** How long a visitor has to finish uploading and send the enquiry. */
const TICKET_LIFETIME_MS = 2 * 60 * 60 * 1000

const signingKey = () => {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET is not set')
  return createHmac('sha256', secret).update('enquiry-upload-ticket').digest()
}

const sign = (payload: string) =>
  createHmac('sha256', signingKey()).update(payload).digest('base64url')

/**
 * The upload step passes the spam check once, then hands the browser this signed list of the
 * files it may upload. Sending the enquiry with it proves the check was passed, without a second
 * Turnstile token, and the server only trusts the files listed in it.
 */
export function createTicket(files: TicketFile[], now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ files, exp: now + TICKET_LIFETIME_MS })).toString(
    'base64url',
  )
  return `${payload}.${sign(payload)}`
}

/** The ticket's files, or null when it's forged, damaged or expired. */
export function readTicket(ticket: unknown, now = Date.now()): TicketFile[] | null {
  if (typeof ticket !== 'string' || ticket.length > 8192) return null
  const [payload, signature, extra] = ticket.split('.')
  if (!payload || !signature || extra !== undefined) return null

  const expected = Buffer.from(sign(payload))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null

  try {
    const { files, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Ticket
    if (typeof exp !== 'number' || exp < now || !Array.isArray(files)) return null
    return files
  } catch {
    return null
  }
}
