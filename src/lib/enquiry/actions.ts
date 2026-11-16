'use server'

/*
 * The enquiry form's server actions. Anyone can call an action directly, so each one re-checks
 * everything: the hidden honeypot field, Turnstile (or the signed upload ticket), every field and
 * every file. Leads are created with the Local API; the public REST API can't create them.
 */
import { mkdtemp, rm } from 'fs/promises'
import { headers } from 'next/headers'
import { after } from 'next/server'
import os from 'os'
import path from 'path'
import type { Payload } from 'payload'

import { getPayloadClient } from '@/lib/payload'
import { pathForDoc } from '@/lib/routes'
import { getCanonicalOrigin } from '@/lib/site-url'

import { referenceUploadsEnabled } from './config'
import { confirmationEmail, notificationEmail } from './emails'
import {
  checkReferenceFiles,
  type EnquiryValues,
  extensionFor,
  type FieldErrors,
  readEnquiry,
  type ReferenceFile,
  validateEnquiry,
} from './fields'
import { createTicket, readTicket, type TicketFile } from './ticket'
import { verifyTurnstile } from './turnstile'
import { createUploadLinks, deleteUploads, downloadUpload, isUploaded } from './uploads'

/** Why sending failed, for the form to explain (field problems come back as `errors`). */
export type EnquiryProblem = 'verification' | 'expired' | 'files' | 'failed'

export type UploadLinksResult =
  | { ok: true; ticket: string; uploads: { url: string }[] }
  | { ok: false; problem: EnquiryProblem; message?: string }

export type SendEnquiryResult =
  { ok: true } | { ok: false; problem?: EnquiryProblem; errors?: FieldErrors }

async function visitorIP() {
  const list = await headers()
  return list.get('x-real-ip') ?? list.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
}

const isBot = (website: unknown) => typeof website === 'string' && website.trim() !== ''

/**
 * Step 1 (only when files are attached): passes the spam check and returns a signed upload link
 * per file, plus a ticket for sending the enquiry afterwards.
 */
export async function getEnquiryUploadLinks(input: {
  token?: unknown
  files?: unknown
  website?: unknown
}): Promise<UploadLinksResult> {
  if (isBot(input.website) || !referenceUploadsEnabled()) return { ok: false, problem: 'failed' }

  const files: ReferenceFile[] = Array.isArray(input.files)
    ? input.files.map((file: { type?: unknown; size?: unknown }) => ({
        type: typeof file?.type === 'string' ? file.type : '',
        size: typeof file?.size === 'number' ? file.size : 0,
      }))
    : []
  const fileProblem = files.length ? checkReferenceFiles(files) : 'No files to upload.'
  if (fileProblem) return { ok: false, problem: 'files', message: fileProblem }

  if (!(await verifyTurnstile(input.token, await visitorIP())))
    return { ok: false, problem: 'verification' }

  try {
    const links = await createUploadLinks(files)
    return {
      ok: true,
      ticket: createTicket(links.map(({ key, type, size }) => ({ key, type, size }))),
      uploads: links.map(({ url }) => ({ url })),
    }
  } catch (error) {
    ;(await getPayloadClient()).logger.error({ err: error, msg: 'Enquiry upload links failed' })
    return { ok: false, problem: 'failed' }
  }
}

/**
 * Step 2: saves the enquiry. With files, the ticket from step 1 stands in for Turnstile. The
 * visitor gets the answer as soon as the enquiry is saved; the files and emails are handled
 * straight after the response.
 */
export async function sendEnquiry(input: {
  values?: unknown
  token?: unknown
  ticket?: unknown
  website?: unknown
}): Promise<SendEnquiryResult> {
  // Bots that fill the hidden field are told it worked, and nothing is saved.
  if (isBot(input.website)) return { ok: true }

  const values = readEnquiry(
    input.values && typeof input.values === 'object'
      ? (input.values as Record<string, unknown>)
      : null,
  )
  const errors = validateEnquiry(values)
  if (Object.keys(errors).length) return { ok: false, errors }

  let files: TicketFile[] = []
  if (input.ticket !== undefined) {
    const listed = readTicket(input.ticket)
    if (!listed) return { ok: false, problem: 'expired' }
    // Only files that really arrived count. None at all means the uploads failed, or the ticket
    // was already used (its files are removed once saved).
    const arrived = await Promise.all(listed.map(isUploaded))
    files = listed.filter((_, index) => arrived[index])
    if (!files.length) return { ok: false, problem: 'expired' }
  } else if (!(await verifyTurnstile(input.token, await visitorIP()))) {
    return { ok: false, problem: 'verification' }
  }

  try {
    const payload = await getPayloadClient()
    const piece = values.project
      ? (
          await payload.find({
            collection: 'portfolio-items',
            where: { slug: { equals: values.project } },
            limit: 1,
            depth: 0,
            select: { title: true, slug: true },
          })
        ).docs[0]
      : undefined

    const lead = await payload.create({
      collection: 'leads',
      depth: 0,
      data: {
        status: 'new',
        firstName: values.firstName,
        surname: values.surname,
        phone: values.phone,
        email: values.email || undefined,
        placement: values.placement,
        preferredTiming: values.preferredTiming || undefined,
        description: values.description,
        project: piece?.id,
        travel: {
          travelling: values.travelling,
          from: values.travelFrom || undefined,
          dates: values.travelDates || undefined,
          help: values.travelHelp || undefined,
        },
      },
    })

    after(async () => {
      try {
        const { attached, failed } = files.length
          ? await attachFiles(payload, lead.id, files, fileBaseName(values))
          : { attached: 0, failed: 0 }
        await sendEmails(payload, {
          values,
          leadId: lead.id,
          project: piece && { title: piece.title, path: pathForDoc('portfolio-items', piece.slug) },
          attached,
          failed,
        })
      } catch (error) {
        payload.logger.error({ err: error, msg: `Enquiry ${lead.id}: finishing it failed` })
      }
    })
    return { ok: true }
  } catch (error) {
    ;(await getPayloadClient()).logger.error({ err: error, msg: 'Saving an enquiry failed' })
    return { ok: false, problem: 'failed' }
  }
}

/** "ana-hoxha-2026-11-16": file names that say whose enquiry they belong to. */
function fileBaseName({ firstName, surname }: EnquiryValues) {
  const name = `${firstName} ${surname}`
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return `${name || 'enquiry'}-${new Date().toISOString().slice(0, 10)}`
}

/**
 * Re-saves each pending upload as a private `lead-attachments` file (Payload checks what the file
 * really is and makes a thumbnail), links them to the lead, then removes the pending copies.
 */
async function attachFiles(
  payload: Payload,
  leadId: number,
  files: TicketFile[],
  baseName: string,
) {
  const ids: number[] = []
  let failed = 0
  const dir = await mkdtemp(path.join(os.tmpdir(), 'enquiry-'))
  try {
    for (const [index, file] of files.entries()) {
      const name = `${baseName}-${index + 1}.${extensionFor(file.type)}`
      const tempFilePath = path.join(dir, name)
      try {
        await downloadUpload(file.key, tempFilePath)
        const doc = await payload.create({
          collection: 'lead-attachments',
          data: {},
          depth: 0,
          file: { data: Buffer.alloc(0), mimetype: file.type, name, size: file.size, tempFilePath },
        })
        ids.push(doc.id)
      } catch (error) {
        failed++
        payload.logger.error({ err: error, msg: `Enquiry ${leadId}: a reference file failed` })
      }
    }
    if (ids.length)
      await payload.update({ collection: 'leads', id: leadId, depth: 0, data: { references: ids } })
  } catch (error) {
    payload.logger.error({ err: error, msg: `Enquiry ${leadId}: attaching files failed` })
  } finally {
    await rm(dir, { recursive: true, force: true })
    await deleteUploads(files.map(({ key }) => key)).catch((error: unknown) =>
      payload.logger.error({ err: error, msg: `Enquiry ${leadId}: removing pending files failed` }),
    )
  }
  return { attached: ids.length, failed }
}

async function sendEmails(
  payload: Payload,
  details: {
    values: EnquiryValues
    leadId: number
    project?: { title: string; path: string }
    attached: number
    failed: number
  },
) {
  const { values, leadId, project, attached, failed } = details
  const siteURL = getCanonicalOrigin()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })

  const studio = (process.env.LEADS_NOTIFY_EMAIL || settings.email || '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean)
  if (studio.length) {
    try {
      await payload.sendEmail({
        to: studio,
        replyTo: values.email || undefined,
        ...notificationEmail({
          values,
          project: project && { title: project.title, url: `${siteURL}${project.path}` },
          attached,
          failed,
          adminURL: `${siteURL}/admin/collections/leads/${leadId}`,
        }),
      })
    } catch (error) {
      payload.logger.error({ err: error, msg: `Enquiry ${leadId}: the studio email failed` })
    }
  }

  if (values.email) {
    try {
      await payload.sendEmail({
        to: values.email,
        replyTo: settings.email || undefined,
        ...confirmationEmail(settings, siteURL),
      })
    } catch (error) {
      payload.logger.error({ err: error, msg: `Enquiry ${leadId}: the confirmation email failed` })
    }
  }
}
