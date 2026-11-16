/*
 * The enquiry form's fields and rules, shared by the browser (instant feedback) and the server
 * actions (the real check: anything can be posted to an action).
 */
import {
  LEAD_IMAGE_TYPES,
  LEAD_VIDEO_TYPES,
  MAX_LEAD_FILES,
  MAX_LEAD_IMAGE_BYTES,
  MAX_LEAD_VIDEO_BYTES,
} from '@/lib/leads'

export type EnquiryValues = {
  firstName: string
  surname: string
  phone: string
  email: string
  placement: string
  preferredTiming: string
  travelling: boolean
  travelFrom: string
  travelDates: string
  travelHelp: string
  description: string
  /** Slug of the portfolio piece the visitor came from (`?project=`). */
  project: string
}

type TextField = Exclude<keyof EnquiryValues, 'travelling'>

export type FieldErrors = Partial<Record<TextField | 'references', string>>

const maxLength: Record<TextField, number> = {
  firstName: 60,
  surname: 60,
  phone: 40,
  email: 254,
  placement: 120,
  preferredTiming: 120,
  travelFrom: 80,
  travelDates: 120,
  travelHelp: 1000,
  description: 4000,
  project: 120,
}

const textFields = Object.keys(maxLength) as TextField[]

const requiredMessage: Partial<Record<TextField, string>> = {
  firstName: 'Please enter your first name.',
  surname: 'Please enter your surname.',
  phone: 'Please enter a phone number we can reach you on.',
  placement: 'Please say where the tattoo would go, or “not sure”.',
  description: 'Please describe your tattoo idea.',
}

const travelFields: TextField[] = ['travelFrom', 'travelDates', 'travelHelp']

/** Reads the form's fields. Untrusted input (an action's arguments) is coerced to strings. */
export function readEnquiry(source: FormData | Record<string, unknown> | null | undefined) {
  const get = (name: string): unknown =>
    source instanceof FormData ? source.get(name) : source?.[name]
  const values = {} as EnquiryValues
  for (const name of textFields) {
    const value = get(name)
    values[name] = typeof value === 'string' ? value.trim() : ''
  }
  const travelling = get('travelling')
  values.travelling = travelling === true || travelling === 'on'
  // Travel details only count when the visitor said they're travelling.
  if (!values.travelling) for (const name of travelFields) values[name] = ''
  return values
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Field errors for the values; an empty object means they can be sent. */
export function validateEnquiry(values: EnquiryValues): FieldErrors {
  const errors: FieldErrors = {}
  for (const name of textFields) {
    const value = values[name]
    if (!value && requiredMessage[name]) errors[name] = requiredMessage[name]
    else if (value.length > maxLength[name])
      errors[name] = `Please keep this under ${maxLength[name]} characters.`
  }
  if (!errors.phone && values.phone) {
    const digits = values.phone.replace(/\D/g, '').length
    if (!/^\+?[\d\s().\-/]+$/.test(values.phone) || digits < 6 || digits > 20)
      errors.phone = 'Please enter a phone number, including the country code.'
  }
  if (!errors.email && values.email && !EMAIL.test(values.email))
    errors.email = 'Please check the email address.'
  return errors
}

export type ReferenceFile = { type: string; size: number }

const imageTypes: readonly string[] = LEAD_IMAGE_TYPES
const videoTypes: readonly string[] = LEAD_VIDEO_TYPES
const mb = (bytes: number) => `${Math.round(bytes / 1024 / 1024)} MB`

const sizeLimits = `photos up to ${mb(MAX_LEAD_IMAGE_BYTES)}, videos up to ${mb(MAX_LEAD_VIDEO_BYTES)}`

export const referenceFilesHint = `Up to ${MAX_LEAD_FILES} files: ${sizeLimits}.`

/** Why the files can't be attached, or null when they can. */
export function checkReferenceFiles(files: ReferenceFile[]): string | null {
  if (files.length > MAX_LEAD_FILES) return `Please choose up to ${MAX_LEAD_FILES} files.`
  for (const file of files) {
    const isImage = imageTypes.includes(file.type)
    if (!isImage && !videoTypes.includes(file.type))
      return 'Photos must be JPEG, PNG or WebP, and videos MP4, MOV or WebM.'
    const limit = isImage ? MAX_LEAD_IMAGE_BYTES : MAX_LEAD_VIDEO_BYTES
    if (!Number.isSafeInteger(file.size) || file.size <= 0) return 'One of the files is empty.'
    if (file.size > limit) return `A file is too large: ${sizeLimits}.`
  }
  return null
}

/** File extension stored for each accepted type. */
export function extensionFor(type: string) {
  const known: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/webm': 'webm',
  }
  return known[type] ?? 'bin'
}
