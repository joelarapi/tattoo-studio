// The enquiry form's rules, upload ticket and emails. Pure functions: no database needed.
import { describe, expect, it } from 'vitest'

import { notificationEmail } from '@/lib/enquiry/emails'
import { checkReferenceFiles, readEnquiry, validateEnquiry } from '@/lib/enquiry/fields'
import { createTicket, readTicket } from '@/lib/enquiry/ticket'

const valid = {
  firstName: 'Ana',
  surname: 'Hoxha',
  phone: '+355 69 000 0000',
  placement: 'Forearm',
  description: 'A small botanical piece.',
}

describe('enquiry fields', () => {
  it('accepts a complete enquiry', () => {
    expect(validateEnquiry(readEnquiry(valid))).toEqual({})
  })

  it('names every missing required field', () => {
    expect(Object.keys(validateEnquiry(readEnquiry({})))).toEqual([
      'firstName',
      'surname',
      'phone',
      'placement',
      'description',
    ])
  })

  it('rejects malformed phones, emails and over-long text', () => {
    const errors = validateEnquiry(
      readEnquiry({ ...valid, phone: 'call me', email: 'nope', description: 'x'.repeat(4001) }),
    )
    expect(Object.keys(errors).sort()).toEqual(['description', 'email', 'phone'])
  })

  it('coerces untrusted values and drops travel details when not travelling', () => {
    const values = readEnquiry({ ...valid, firstName: 42, travelFrom: 'Italy' })
    expect(values.firstName).toBe('')
    expect(values.travelFrom).toBe('')
    expect(readEnquiry({ ...valid, travelling: true, travelFrom: 'Italy' }).travelFrom).toBe(
      'Italy',
    )
  })

  it('limits reference files by count, type and size', () => {
    const photo = { type: 'image/jpeg', size: 1000 }
    expect(checkReferenceFiles([photo])).toBeNull()
    expect(checkReferenceFiles(Array(6).fill(photo))).toMatch(/up to 5/)
    expect(checkReferenceFiles([{ type: 'application/pdf', size: 1000 }])).toMatch(/JPEG/)
    expect(checkReferenceFiles([{ type: 'image/png', size: 6 * 1024 * 1024 }])).toMatch(/large/)
    expect(checkReferenceFiles([{ type: 'video/mp4', size: 0 }])).toMatch(/empty/)
  })
})

describe('upload ticket', () => {
  const files = [{ key: 'client-enquiries/pending/a/1.jpg', type: 'image/jpeg', size: 10 }]

  it('round-trips and expires', () => {
    const ticket = createTicket(files, 1_000)
    expect(readTicket(ticket, 2_000)).toEqual(files)
    expect(readTicket(ticket, 1_000 + 3 * 60 * 60 * 1000)).toBeNull()
  })

  it('refuses a ticket whose files were changed', () => {
    const [, signature] = createTicket(files).split('.')
    const forged = Buffer.from(
      JSON.stringify({ files: [{ ...files[0], size: 10_000_000 }], exp: Date.now() + 60_000 }),
    ).toString('base64url')
    expect(readTicket(`${forged}.${signature}`)).toBeNull()
    expect(readTicket('not a ticket')).toBeNull()
  })
})

describe('studio notification email', () => {
  it('escapes everything the visitor typed', () => {
    const email = notificationEmail({
      values: readEnquiry({ ...valid, firstName: '<script>', description: '<img src=x>' }),
      attached: 0,
      failed: 0,
      adminURL: 'https://example.com/admin/collections/leads/1',
    })
    expect(email.html).not.toContain('<script>')
    expect(email.html).not.toContain('<img')
    expect(email.html).toContain('&lt;script&gt;')
    expect(email.subject).toBe('New tattoo enquiry: <script> Hoxha')
  })
})
