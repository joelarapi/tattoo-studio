'use client'

import { useId, useState } from 'react'

import { Button } from '@/components/ui/Button'

type NewsletterFormProps = {
  buttonLabel: string
  consentLabel: string
}

/*
 * Newsletter sign-up UI. The spec doesn't say where sign-ups go yet (a CMS collection, or a
 * mailing service like Resend Audiences), so submitting only shows a notice for now.
 * POST, so that without JS an email address never ends up in the URL.
 */
export function NewsletterForm({ buttonLabel, consentLabel }: NewsletterFormProps) {
  const id = useId()
  const [notice, setNotice] = useState<string | null>(null)

  return (
    <form
      method="post"
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        setNotice('Newsletter sign-up isn’t switched on yet.')
      }}
    >
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          className="h-12 w-0 min-w-0 flex-1 rounded-sm border border-surface-2 bg-bg px-4 text-text placeholder:text-text-muted focus-visible:border-muted"
        />
        <Button type="submit">{buttonLabel}</Button>
      </div>
      <label className="flex items-start gap-3 text-label-sm">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 size-4 shrink-0 accent-[var(--color-accent)]"
        />
        <span>{consentLabel}</span>
      </label>
      <p role="status" className="min-h-[1lh] text-label-sm text-text">
        {notice}
      </p>
    </form>
  )
}
