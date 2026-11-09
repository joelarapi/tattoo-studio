import type { ReactNode } from 'react'

import { RichText } from '@/components/RichText'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { Paragraphs } from '@/components/ui/Text'
import { cn } from '@/lib/cn'
import type { HeadingValue } from '@/lib/heading'
import { ENQUIRY_ID } from '@/lib/routes'
import type { ContactPage } from '@/payload-types'

import { EnquiryForm } from './EnquiryForm'

type EnquirySectionProps = {
  tag?: string | null
  number?: number
  heading: HeadingValue
  /** The contact page uses the heading as its H1. */
  headingAs?: 'h1' | 'h2'
  intro?: string | null
  /** Studio and contact details under the intro. */
  children?: ReactNode
  form: ContactPage['form']
  projects?: { slug?: string | null; title: string }[]
  className?: string
}

/** Copy and studio details on the left, the enquiry form on the right. */
export function EnquirySection({
  tag,
  number,
  heading,
  headingAs = 'h2',
  intro,
  children,
  form,
  projects,
  className,
}: EnquirySectionProps) {
  return (
    <section
      id={ENQUIRY_ID}
      className={cn(
        'grid scroll-mt-5 grid-cols-1 items-start gap-[35px] px-site py-section md:grid-cols-[1fr_1.4fr] md:gap-[5%] lg:gap-[9%]',
        className,
      )}
    >
      <div data-reveal>
        <Tag number={number}>{tag}</Tag>
        <StyledHeading
          as={headingAs}
          value={heading}
          className="text-[49px] leading-[1.13] tracking-[-1.5px] md:text-[clamp(42px,4.7vw,70px)] md:tracking-[-2.4px]"
        />
        <Paragraphs text={intro} className="mt-[23px] text-[14px]" />
        {children}
      </div>
      <EnquiryForm
        copy={form}
        projects={projects}
        privacyNote={form.privacyNote ? <RichText data={form.privacyNote} /> : undefined}
      />
    </section>
  )
}

/** A labelled block of details under the enquiry copy ("The studio", "Direct contact"). */
export function ContactDetail({
  label,
  title,
  children,
}: {
  label?: string | null
  title?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="mt-[25px] border-t border-line pt-[25px]">
      {label && <span className="tag mb-2.5">{label}</span>}
      {title && <h3 className="text-h3">{title}</h3>}
      {children && <div className="mt-3 text-[12px] leading-[1.8]">{children}</div>}
    </div>
  )
}
