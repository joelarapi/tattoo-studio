'use client'

import {
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

import { Lines, Paragraphs } from '@/components/ui/Text'
import { type EnquiryProblem, getEnquiryUploadLinks, sendEnquiry } from '@/lib/enquiry/actions'
import {
  checkReferenceFiles,
  type FieldErrors,
  readEnquiry,
  referenceFilesHint,
  validateEnquiry,
} from '@/lib/enquiry/fields'
import { cn } from '@/lib/cn'

import { useTurnstile } from './useTurnstile'

type FormCopy = {
  submitLabel: string
  helperText?: string | null
  /** Shown when an enquiry can't be sent. */
  pendingNotice: string
  successHeading?: string | null
  successMessage?: string | null
}

type EnquiryFormProps = {
  copy: FormCopy
  /** The privacy note, rendered on the server (rich text). */
  privacyNote?: ReactNode
  /** Portfolio pieces, so "?project=<slug>" links can say which piece the enquiry is about. */
  projects?: { slug?: string | null; title: string }[]
  /** Whether visitors can attach reference files (needs the private R2 bucket). */
  uploads?: boolean
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

const input =
  'mt-[9px] block w-full rounded-sm border border-[#383838] bg-[#181818] p-[13px] text-[16px] leading-[1.6] text-white placeholder:text-[#8a8a8a] aria-[invalid=true]:border-[#ff8f8f]'
const label = 'mb-[23px] block text-[14px] text-[#ccc]'
const row = 'grid grid-cols-1 gap-x-5 lg:grid-cols-2'
const errorText = 'mt-2 block text-[14px] leading-[1.6] text-[#ff8f8f]'

const problemMessages: Partial<Record<EnquiryProblem, string>> = {
  verification: 'The spam check didn’t go through. Please press the button again.',
  expired: 'The upload took too long or didn’t arrive. Please press the button again.',
}

const uploadProblem =
  'Your files couldn’t be uploaded. Please try again, or remove them and send the enquiry without files.'

// The query string doesn't change while the form is on screen.
const noSubscription = () => () => {}

function ErrorText({ id, children }: { id: string; children?: string }) {
  if (!children) return null
  return (
    <span id={id} className={errorText}>
      {children}
    </span>
  )
}

function Field({
  name,
  text,
  className,
  error,
  ...props
}: {
  name: string
  text: string
  className?: string
  error?: string
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn(label, className)}>
      {text}
      <input
        name={name}
        className={input}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      <ErrorText id={`${name}-error`}>{error}</ErrorText>
    </label>
  )
}

/** Uploads one file to its signed R2 link, reporting progress (fetch can't). */
function uploadFile(url: string, file: File, onProgress: (loaded: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('PUT', url)
    request.setRequestHeader('Content-Type', file.type)
    request.upload.onprogress = (event) => onProgress(event.loaded)
    request.onload = () =>
      request.status >= 200 && request.status < 300
        ? resolve()
        : reject(new Error(`Upload failed (${request.status})`))
    request.onerror = () => reject(new Error('Upload failed'))
    request.send(file)
  })
}

/**
 * The tattoo enquiry form, used by every "Enquiry form" section. Field labels are part of the
 * design; the button, notes and messages come from Studio details → Enquiry form.
 *
 * Sending: the spam check (Turnstile) runs, any reference files go straight to the private R2
 * bucket, then the enquiry is saved (src/lib/enquiry/actions.ts).
 */
export function EnquiryForm({
  copy,
  privacyNote,
  projects = [],
  uploads = true,
}: EnquiryFormProps) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [status, setStatus] = useState('')
  const [problem, setProblem] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [fileNote, setFileNote] = useState('')
  const travelling = useRef<HTMLInputElement>(null)
  const files = useRef<HTMLInputElement>(null)
  const success = useRef<HTMLDivElement>(null)
  const turnstileBox = useRef<HTMLDivElement>(null)
  const turnstile = useTurnstile(turnstileBox)

  // Links from the visitor guide (?travel=1) and portfolio pieces (?project=…) pre-fill the form.
  // Read from the browser rather than useSearchParams, which would make the page render on demand.
  const search = useSyncExternalStore(
    noSubscription,
    () => window.location.search,
    () => '',
  )
  const params = new URLSearchParams(search)
  const projectSlug = params.get('project')
  const project = projects.find((item) => item.slug && item.slug === projectSlug)
  const travel = params.get('travel') === '1'

  useEffect(() => {
    if (travel && travelling.current) travelling.current.checked = true
  }, [travel])

  useEffect(() => {
    if (sent) success.current?.focus()
  }, [sent])

  const chosenFiles = () => [...(files.current?.files ?? [])]

  const onFiles = () => {
    const list = chosenFiles()
    const fileProblem = list.length ? checkReferenceFiles(list) : null
    setErrors(({ references: _, ...rest }) =>
      fileProblem ? { ...rest, references: fileProblem } : rest,
    )
    setFileNote(
      list.length && !fileProblem
        ? `${list.length} file${list.length === 1 ? '' : 's'} selected.`
        : '',
    )
  }

  // Typing in a field clears its error.
  const onInput = (event: FormEvent<HTMLFormElement>) => {
    const name = (event.target as HTMLInputElement).name as keyof FieldErrors
    if (name !== 'references' && errors[name]) setErrors(({ [name]: _, ...rest }) => rest)
  }

  const showErrors = (form: HTMLFormElement, found: FieldErrors) => {
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus()
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return
    const form = event.currentTarget
    const data = new FormData(form)
    // A filled honeypot means a bot: pretend it worked.
    if (data.get('website')) return setSent(true)

    const values = readEnquiry(data)
    const list = uploads ? chosenFiles() : []
    const found = validateEnquiry(values)
    const fileProblem = list.length ? checkReferenceFiles(list) : null
    if (fileProblem) found.references = fileProblem
    if (Object.keys(found).length) return showErrors(form, found)

    setErrors({})
    setProblem('')
    setSending(true)
    let done = false
    try {
      let token: string | undefined = await turnstile.getToken()
      let ticket: string | undefined

      if (list.length) {
        setStatus('Preparing your files…')
        const links = await getEnquiryUploadLinks({
          token,
          files: list.map(({ type, size }) => ({ type, size })),
        })
        if (!links.ok) {
          if (links.message) showErrors(form, { references: links.message })
          else setProblem(problemMessages[links.problem] ?? copy.pendingNotice)
          return
        }
        ticket = links.ticket
        token = undefined
        const total = list.reduce((sum, file) => sum + file.size, 0)
        const loaded = list.map(() => 0)
        try {
          await Promise.all(
            list.map((file, index) =>
              uploadFile(links.uploads[index].url, file, (bytes) => {
                loaded[index] = bytes
                const percent = Math.round((loaded.reduce((a, b) => a + b, 0) / total) * 100)
                setStatus(`Uploading your files… ${percent}%`)
              }),
            ),
          )
        } catch {
          setProblem(uploadProblem)
          return
        }
      }

      setStatus('Sending…')
      const result = await sendEnquiry({ values, token, ticket })
      if (result.ok) {
        window.dataLayer?.push({ event: 'generate_lead', form: 'tattoo_enquiry' })
        done = true
        turnstile.remove()
        setSent(true)
        return
      }
      if (result.errors) showErrors(form, result.errors)
      else setProblem(problemMessages[result.problem ?? 'failed'] ?? copy.pendingNotice)
    } catch {
      setProblem(copy.pendingNotice)
    } finally {
      setSending(false)
      setStatus('')
      // A token works once: get a fresh one for the next try.
      if (!done) turnstile.reset()
    }
  }

  const box = 'rounded-md border border-line bg-panel px-[18px] py-[22px] md:p-[22px] lg:p-[30px]'

  if (sent)
    return (
      <div ref={success} tabIndex={-1} role="status" className={cn(box, 'outline-none')}>
        <h3 className="text-h3">{copy.successHeading || 'Thank you.'}</h3>
        {copy.successMessage && (
          <Paragraphs text={copy.successMessage} className="mt-3 text-[16px] text-[#ccc]" />
        )}
      </div>
    )

  return (
    <form
      method="post"
      // The form's own checks (next to each field) replace the browser's pop-ups.
      noValidate
      onSubmit={onSubmit}
      onInput={onInput}
      onFocus={() => void turnstile.prepare().catch(() => {})}
      aria-busy={sending}
      data-reveal
      className={box}
    >
      <noscript>
        <p className="mb-[23px] border-l border-accent/65 pl-[15px] text-[16px]">
          Sending this form needs JavaScript. Please turn it on, or contact the studio directly.
        </p>
      </noscript>
      {project && (
        <p className="mb-[23px] border-l border-accent/65 pl-[15px] text-[16px]">
          About the piece: <span className="text-text">{project.title}</span>
          <input type="hidden" name="project" value={project.slug ?? ''} />
        </p>
      )}
      <div className={row}>
        <Field
          name="firstName"
          text="First name"
          autoComplete="given-name"
          required
          placeholder="Your first name"
          error={errors.firstName}
        />
        <Field
          name="surname"
          text="Surname"
          autoComplete="family-name"
          required
          placeholder="Your surname"
          error={errors.surname}
        />
      </div>
      <div className={row}>
        <Field
          name="phone"
          text="Phone number, including country code"
          type="tel"
          autoComplete="tel"
          required
          placeholder="e.g. +355 …"
          error={errors.phone}
        />
        <Field
          name="email"
          text="Email address (optional)"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email}
        />
      </div>
      <div className={row}>
        <Field
          name="placement"
          text="Tattoo placement"
          required
          placeholder="e.g. forearm, back, not sure"
          error={errors.placement}
        />
        <Field
          name="preferredTiming"
          text="Preferred timing"
          placeholder="Your preferred date, or flexible"
          error={errors.preferredTiming}
        />
      </div>

      <label className="mb-[23px] flex items-center gap-3 text-[14px] text-[#ccc]">
        <input
          ref={travelling}
          id="travelling"
          type="checkbox"
          name="travelling"
          className="size-4 accent-accent"
        />
        I’m travelling to Albania from abroad.
      </label>
      {/* Shown with CSS while the box is ticked, so it also works without JS. */}
      <div className={cn(row, 'hidden in-[form:has(#travelling:checked)]:grid')}>
        <Field
          name="travelFrom"
          text="Country you’re travelling from"
          autoComplete="country-name"
          placeholder="Your country"
          error={errors.travelFrom}
        />
        <Field
          name="travelDates"
          text="Planned dates in Albania"
          placeholder="Arrival and departure, if known"
          error={errors.travelDates}
        />
        <Field
          name="travelHelp"
          text="Hotel or transport help (optional)"
          placeholder="Tell us what help you’d like"
          className="lg:col-span-2"
          error={errors.travelHelp}
        />
      </div>

      <label className={label}>
        Describe your tattoo idea
        <textarea
          name="description"
          required
          rows={5}
          placeholder="The subject, style and details you have in mind. If you’re unsure about placement, say so."
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? 'description-error' : undefined}
          className={cn(input, 'min-h-[130px] resize-y')}
        />
        <ErrorText id="description-error">{errors.description}</ErrorText>
      </label>

      {uploads && (
        <label className={label}>
          Add reference photos or a video (optional)
          <input
            ref={files}
            name="references"
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
            multiple
            onChange={onFiles}
            aria-invalid={errors.references ? true : undefined}
            aria-describedby={errors.references ? 'references-error' : 'references-hint'}
            className="mt-[9px] block w-full text-[14px] file:mr-2.5 file:cursor-pointer file:border-0 file:bg-[#333] file:px-2.5 file:py-2 file:text-white"
          />
          <span id="references-hint" className="mt-2.5 block text-[14px] leading-[1.8] text-[#999]">
            {referenceFilesHint}
          </span>
          <ErrorText id="references-error">{errors.references}</ErrorText>
          <span aria-live="polite" className="block text-[14px] leading-[1.8] text-[#999]">
            {fileNote}
          </span>
        </label>
      )}

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* The spam check. Invisible unless Cloudflare asks the visitor to tick a box. */}
      <div ref={turnstileBox} className="*:mb-[23px]" />

      <button
        type="submit"
        disabled={sending}
        className="btn w-full cursor-pointer btn-accent disabled:cursor-wait disabled:opacity-70"
      >
        {sending ? 'Sending…' : <>{copy.submitLabel} ↗&#xFE0E;</>}
      </button>
      {copy.helperText && (
        <p className="mt-2.5 text-[16px] leading-[1.8] text-[#999]">
          <Lines text={copy.helperText} />
        </p>
      )}
      {privacyNote && (
        <div className="mt-2.5 text-[14px] leading-[1.8] text-[#999] [&_a]:text-text [&_a]:underline">
          {privacyNote}
        </div>
      )}
      <p role="status" className="mt-4 text-[16px] text-text empty:hidden">
        {status}
      </p>
      <p role="alert" className="mt-4 text-[16px] text-[#ff8f8f] empty:hidden">
        {problem && <Lines text={problem} />}
      </p>
    </form>
  )
}
