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

import { Lines } from '@/components/ui/Text'
import { cn } from '@/lib/cn'
import { MAX_LEAD_FILES, MAX_LEAD_IMAGE_BYTES, MAX_LEAD_VIDEO_BYTES } from '@/lib/leads'

type FormCopy = {
  submitLabel: string
  helperText?: string | null
  pendingNotice: string
}

type EnquiryFormProps = {
  copy: FormCopy
  /** The privacy note, rendered on the server (rich text). */
  privacyNote?: ReactNode
  /** Portfolio pieces, so "?project=<slug>" links can say which piece the enquiry is about. */
  projects?: { slug?: string | null; title: string }[]
}

const input =
  'mt-[9px] block w-full rounded-sm border border-[#383838] bg-[#181818] p-[13px] text-[12px] leading-[1.6] text-white placeholder:text-[#8a8a8a]'
const label = 'mb-[23px] block text-[11px] text-[#ccc]'
const row = 'grid grid-cols-1 gap-x-5 lg:grid-cols-2'

// The query string doesn't change while the form is on screen.
const noSubscription = () => () => {}

function Field({
  name,
  text,
  className,
  ...props
}: {
  name: string
  text: string
  className?: string
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn(label, className)}>
      {text}
      <input name={name} className={input} {...props} />
    </label>
  )
}

/**
 * The tattoo enquiry form (homepage and contact page). Field labels are part of the design; the
 * button and notes come from the CMS (Pages → Contact → Form). Sending is connected in the
 * lead-capture phase; until then submitting shows the "not connected yet" notice.
 */
export function EnquiryForm({ copy, privacyNote, projects = [] }: EnquiryFormProps) {
  const [status, setStatus] = useState('')
  const [fileNote, setFileNote] = useState('')
  const travelling = useRef<HTMLInputElement>(null)

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

  const onFiles = (files: FileList | null) => {
    const list = [...(files ?? [])]
    if (!list.length) return setFileNote('')
    const tooBig = list.filter((file) =>
      file.type.startsWith('video/')
        ? file.size > MAX_LEAD_VIDEO_BYTES
        : file.size > MAX_LEAD_IMAGE_BYTES,
    )
    if (list.length > MAX_LEAD_FILES) {
      setFileNote(`Choose up to ${MAX_LEAD_FILES} files.`)
    } else if (tooBig.length) {
      setFileNote(
        `Too large: ${tooBig.map((file) => file.name).join(', ')}. Photos can be up to 5 MB, videos up to 50 MB.`,
      )
    } else {
      setFileNote(`${list.length} file${list.length === 1 ? '' : 's'} selected.`)
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // A filled honeypot means a bot: pretend nothing happened.
    if (new FormData(event.currentTarget).get('website')) return
    setStatus(copy.pendingNotice)
  }

  return (
    <form
      onSubmit={onSubmit}
      data-reveal
      className="rounded-md border border-line bg-panel px-[18px] py-[22px] md:p-[22px] lg:p-[30px]"
    >
      {project && (
        <p className="mb-[23px] border-l border-[#78523a] pl-[15px] text-[12px]">
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
        />
        <Field
          name="surname"
          text="Surname"
          autoComplete="family-name"
          required
          placeholder="Your surname"
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
        />
        <Field
          name="email"
          text="Email address (optional)"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>
      <div className={row}>
        <Field
          name="placement"
          text="Tattoo placement"
          required
          placeholder="e.g. forearm, back, not sure"
        />
        <Field
          name="preferredTiming"
          text="Preferred timing"
          placeholder="Your preferred date, or flexible"
        />
      </div>

      <label className="mb-[23px] flex items-center gap-3 text-[12px] text-[#ccc]">
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
        />
        <Field
          name="travelDates"
          text="Planned dates in Albania"
          placeholder="Arrival and departure, if known"
        />
        <Field
          name="travelHelp"
          text="Hotel or transport help (optional)"
          placeholder="Tell us what help you’d like"
          className="lg:col-span-2"
        />
      </div>

      <label className={label}>
        Describe your tattoo idea
        <textarea
          name="description"
          required
          rows={5}
          placeholder="The subject, style and details you have in mind. If you’re unsure about placement, say so."
          className={cn(input, 'min-h-[130px] resize-y')}
        />
      </label>

      <label className={label}>
        Add reference photos or a video (optional)
        <input
          name="references"
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
          multiple
          onChange={(event) => onFiles(event.currentTarget.files)}
          className="mt-[9px] block w-full text-[10px] file:mr-2.5 file:cursor-pointer file:border-0 file:bg-[#333] file:px-2.5 file:py-2 file:text-white"
        />
        <span className="mt-2.5 block text-[10px] leading-[1.8] text-[#999]">
          Up to {MAX_LEAD_FILES} files: photos up to 5 MB, videos up to 50 MB.
        </span>
        <span aria-live="polite" className="block text-[10px] leading-[1.8] text-[#999]">
          {fileNote}
        </span>
      </label>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button type="submit" className="btn w-full cursor-pointer btn-accent">
        {copy.submitLabel} ↗&#xFE0E;
      </button>
      {copy.helperText && (
        <p className="mt-2.5 text-[10px] leading-[1.8] text-[#999]">
          <Lines text={copy.helperText} />
        </p>
      )}
      {privacyNote && (
        <div className="mt-2.5 text-[10px] leading-[1.8] text-[#999] [&_a]:text-text [&_a]:underline">
          {privacyNote}
        </div>
      )}
      <p role="status" className="mt-4 text-[12px] text-text empty:hidden">
        {status}
      </p>
    </form>
  )
}
