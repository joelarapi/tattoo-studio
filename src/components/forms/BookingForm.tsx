'use client'

import { type ReactNode, useId, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { MAX_LEAD_IMAGE_BYTES, tattooSizeOptions } from '@/lib/leads'

type Option = { id: number; name: string }

type BookingFormProps = {
  styles: Option[]
  artists: Option[]
  submitLabel: string
  /** The CMS privacy note, rendered on the server. */
  privacyNote?: ReactNode
}

const fieldClass =
  'w-full rounded-sm border border-surface-2 bg-bg px-4 text-text placeholder:text-text-muted transition-colors hover:border-muted focus-visible:border-muted'

function Field({
  label,
  hint,
  htmlFor,
  className,
  children,
}: {
  label: string
  hint?: string
  htmlFor: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className="mono-label-sm text-text">
        {label}
        {hint && <span className="ml-2 text-text-muted normal-case">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

/**
 * Consultation request form. Phase 4 builds the fields; Phase 6 connects submitting (server
 * action, validation, Turnstile, saving the lead, the notification email and tracking). Until
 * then it shows a notice. POST, so details never end up in the URL.
 */
export function BookingForm({ styles, artists, submitLabel, privacyNote }: BookingFormProps) {
  const id = useId()
  const [notice, setNotice] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const f = (name: string) => `${id}-${name}`

  return (
    <form
      method="post"
      encType="multipart/form-data"
      className="grid gap-6 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault()
        setNotice('Thanks! Online booking requests are switched on in the next build step.')
      }}
    >
      <Field label="Name" htmlFor={f('name')}>
        <input
          id={f('name')}
          name="name"
          required
          autoComplete="name"
          className={cn(fieldClass, 'h-12')}
        />
      </Field>
      <Field label="Phone / WhatsApp" htmlFor={f('phone')}>
        <input
          id={f('phone')}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          className={cn(fieldClass, 'h-12')}
        />
      </Field>
      <Field label="Email" hint="optional" htmlFor={f('email')}>
        <input
          id={f('email')}
          name="email"
          type="email"
          autoComplete="email"
          className={cn(fieldClass, 'h-12')}
        />
      </Field>
      <Field label="Style" htmlFor={f('style')}>
        <select id={f('style')} name="style" defaultValue="" className={cn(fieldClass, 'h-12')}>
          <option value="">Not sure yet</option>
          {styles.map((style) => (
            <option key={style.id} value={style.id}>
              {style.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Placement" htmlFor={f('placement')}>
        <input
          id={f('placement')}
          name="placement"
          placeholder="e.g. inner forearm"
          className={cn(fieldClass, 'h-12')}
        />
      </Field>
      <Field label="Approximate size" htmlFor={f('size')}>
        <select id={f('size')} name="size" defaultValue="" className={cn(fieldClass, 'h-12')}>
          <option value="" disabled>
            Choose a size
          </option>
          {tattooSizeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
      <Field
        label="Preferred artist"
        hint="optional"
        htmlFor={f('artist')}
        className="sm:col-span-2"
      >
        <select id={f('artist')} name="artist" defaultValue="" className={cn(fieldClass, 'h-12')}>
          <option value="">No preference</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Your idea" htmlFor={f('description')} className="sm:col-span-2">
        <textarea
          id={f('description')}
          name="description"
          required
          rows={4}
          placeholder="What would you like, and what does it mean to you?"
          className={cn(fieldClass, 'py-3')}
        />
      </Field>
      <Field
        label="Reference image"
        hint="optional, max 5 MB"
        htmlFor={f('image')}
        className="sm:col-span-2"
      >
        <input
          id={f('image')}
          name="referenceImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-describedby={fileError ? f('image-error') : undefined}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0]
            const tooBig = file && file.size > MAX_LEAD_IMAGE_BYTES
            setFileError(tooBig ? 'That image is over 5 MB. Please choose a smaller one.' : null)
            event.currentTarget.setCustomValidity(tooBig ? 'Image too large' : '')
          }}
          className="text-label-sm file:mr-4 file:h-10 file:cursor-pointer file:rounded-sm file:border-0 file:bg-surface-2 file:px-4 file:font-mono file:text-label-sm file:text-text file:uppercase hover:file:bg-muted"
        />
        {fileError && (
          <p id={f('image-error')} className="text-label-sm text-text">
            {fileError}
          </p>
        )}
      </Field>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor={f('company')}>Company</label>
        <input id={f('company')} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-3 sm:col-span-2">
        <input
          name="marketingConsent"
          type="checkbox"
          className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]"
        />
        <span>
          Send me occasional news, flash designs and open dates. I can unsubscribe at any time.
        </span>
      </label>

      <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        {privacyNote && <div className="max-w-[46ch] text-label-sm">{privacyNote}</div>}
        <Button type="submit" className="shrink-0">
          {submitLabel}
        </Button>
      </div>
      <p role="status" className="text-text empty:hidden sm:col-span-2">
        {notice}
      </p>
    </form>
  )
}
