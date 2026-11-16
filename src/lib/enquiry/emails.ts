/*
 * The two emails an enquiry sends: the details to the studio, and a short confirmation to the
 * client. Everything the visitor typed is escaped. The confirmation only contains the studio's own
 * text from the CMS, so the form can't be used to send someone else arbitrary text.
 */
import { telHref, whatsappHref } from '@/lib/format'
import type { SiteSetting } from '@/payload-types'

import type { EnquiryValues } from './fields'

type Email = { subject: string; text: string; html: string }

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** A subject line can't contain line breaks and shouldn't run on. */
const oneLine = (value: string, max = 120) => value.replace(/\s+/g, ' ').trim().slice(0, max)

const page = (body: string) =>
  `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#111;max-width:640px">${body}</div>`

const paragraph = (text: string) =>
  `<p style="margin:0 0 14px;white-space:pre-line">${escapeHtml(text)}</p>`

const link = (href: string, text: string) =>
  `<a href="${escapeHtml(href)}" style="color:#111">${escapeHtml(text)}</a>`

type Notification = {
  values: EnquiryValues
  /** The piece they came from, if any. */
  project?: { title: string; url: string }
  attached: number
  failed: number
  adminURL: string
}

/** The enquiry, for the studio. "Reply" goes to the client when they gave an email address. */
export function notificationEmail({
  values,
  project,
  attached,
  failed,
  adminURL,
}: Notification): Email {
  const name = `${values.firstName} ${values.surname}`
  const files =
    attached || failed
      ? [
          attached && `${attached} attached (open the enquiry to see them)`,
          failed && `${failed} couldn't be saved`,
        ]
          .filter(Boolean)
          .join(', ')
      : 'None'
  const travel = values.travelling
    ? [
        values.travelFrom && `from ${values.travelFrom}`,
        values.travelDates && `dates: ${values.travelDates}`,
        values.travelHelp && `help wanted: ${values.travelHelp}`,
      ]
        .filter(Boolean)
        .join('; ') || 'Yes'
    : 'No'

  const rows: [string, string, string?][] = [
    ['Name', name],
    ['Phone / WhatsApp', values.phone, whatsappHref(values.phone)],
    ['Email', values.email || 'Not given', values.email ? `mailto:${values.email}` : undefined],
    ['Placement', values.placement],
    ['Preferred timing', values.preferredTiming || 'Not given'],
    ...(project ? [['Inspired by', project.title, project.url] as [string, string, string]] : []),
    ['Travelling from abroad', travel],
    ['Reference files', files],
  ]

  const text = [
    'New tattoo enquiry from the website.',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Their idea:',
    values.description,
    '',
    `Open it in the admin: ${adminURL}`,
  ].join('\n')

  const table = rows
    .map(
      ([label, value, href]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:4px 0;white-space:pre-line">${href ? link(href, value) : escapeHtml(value)}</td></tr>`,
    )
    .join('')

  const html = page(
    [
      `<h2 style="font-size:20px;margin:0 0 16px">New tattoo enquiry: ${escapeHtml(name)}</h2>`,
      `<table style="border-collapse:collapse;margin:0 0 20px">${table}</table>`,
      `<h3 style="font-size:16px;margin:0 0 8px">Their idea</h3>`,
      paragraph(values.description),
      `<p style="margin:24px 0 0">${link(adminURL, 'Open the enquiry in the admin')}</p>`,
    ].join(''),
  )

  return { subject: oneLine(`New tattoo enquiry: ${name}`), text, html }
}

/** "We've got it", for the client: the success text from Studio details and how to reach the studio. */
export function confirmationEmail(settings: SiteSetting, siteURL: string): Email {
  const form = settings.enquiryForm
  const heading = form?.successHeading || 'Thank you for your enquiry.'
  const message = form?.successMessage || ''
  const contact: [string, string, string][] = [
    ['Phone', settings.phone, telHref(settings.phone)],
    ...(settings.whatsapp
      ? [
          ['WhatsApp', settings.whatsapp, whatsappHref(settings.whatsapp)] as [
            string,
            string,
            string,
          ],
        ]
      : []),
    ['Email', settings.email, `mailto:${settings.email}`],
  ]
  const host = new URL(siteURL).host
  const footer = `You're receiving this because this address was used to send a tattoo enquiry on ${host}.`

  const text = [
    heading,
    '',
    ...(message ? [message, ''] : []),
    settings.studioName,
    ...contact.map(([label, value]) => `${label}: ${value}`),
    '',
    footer,
  ].join('\n')

  const html = page(
    [
      `<h2 style="font-size:20px;margin:0 0 16px">${escapeHtml(heading)}</h2>`,
      message ? paragraph(message) : '',
      `<p style="margin:20px 0 4px"><strong>${escapeHtml(settings.studioName)}</strong></p>`,
      ...contact.map(
        ([label, value, href]) =>
          `<p style="margin:0">${escapeHtml(label)}: ${link(href, value)}</p>`,
      ),
      `<p style="margin:24px 0 0;font-size:12px;color:#666">${escapeHtml(footer)}</p>`,
    ].join(''),
  )

  return { subject: oneLine(`${settings.studioName}: ${heading}`), text, html }
}
