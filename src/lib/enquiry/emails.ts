/*
 * The email an enquiry sends to the studio. Everything the visitor typed is escaped. Clients get
 * no email from the site (the studio's choice, 17 Nov 2026), so the form can't be used to send
 * mail to other people.
 */
import { whatsappHref } from '@/lib/format'

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
