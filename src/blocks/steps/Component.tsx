import { Action } from '@/components/ui/Action'
import { StyledHeading } from '@/components/ui/StyledHeading'
import { Tag } from '@/components/ui/Tag'
import { Paragraphs } from '@/components/ui/Text'

import { BlockSection } from '../BlockSection'
import type { BlockProps } from '../types'

/** Text on the left; a numbered list of steps on the right, as compact rows or a timeline. */
export function Steps({ block, ctx }: BlockProps<'steps'>) {
  const steps = block.steps ?? []
  if (block.style === 'timeline') {
    return (
      <BlockSection
        block={block}
        className="grid grid-cols-1 gap-10 px-site py-section md:grid-cols-2 md:gap-[10%]"
      >
        <div data-reveal>
          <Tag number={ctx.number}>{block.tag}</Tag>
          <StyledHeading as={ctx.headingAs} value={block.heading} className="text-h2" />
          <Paragraphs text={block.text} className="mt-[23px] max-w-[450px] text-[13px]" />
          <Action link={block.button} className="mt-[30px]" />
        </div>
        <div>
          <ol className="list-decimal pl-[25px] marker:font-label marker:text-[14px] marker:text-accent">
            {steps.map((step) => (
              <li key={step.id} data-reveal className="pb-[30px] pl-3">
                {step.label && <span className="label-sm text-[#999]">{step.label}</span>}
                <h3 className="mt-2.5 text-[25px] leading-[1.25] tracking-[-0.7px]">
                  {step.title}
                </h3>
                {step.text && <p className="mt-[13px] text-[13px] text-[#aaa]">{step.text}</p>}
              </li>
            ))}
          </ol>
          <Action link={block.link} variant="plain" className="mt-5" />
        </div>
      </BlockSection>
    )
  }

  return (
    <BlockSection
      block={block}
      className="grid grid-cols-1 gap-10 px-site py-section md:grid-cols-[1.1fr_1fr] md:gap-[7%] lg:gap-[10%]"
    >
      <div data-reveal>
        <Tag number={ctx.number}>{block.tag}</Tag>
        <StyledHeading
          as={ctx.headingAs}
          value={block.heading}
          className="text-[42px] leading-[1.13] tracking-[-1.5px] md:text-h2-lg"
        />
        <Paragraphs text={block.text} className="mt-[23px] max-w-[400px] text-[14px]" />
        <Action link={block.button} className="mt-[30px]" />
      </div>
      <div data-reveal>
        {steps.map((step, index) => (
          <article key={step.id} className="flex gap-[25px] border-t border-line-strong py-[25px]">
            <span className="mt-[5px] font-label text-[11px] text-accent">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              {step.label && <span className="label-sm text-[#999]">{step.label}</span>}
              <h3 className="text-h3">{step.title}</h3>
              {step.text && (
                <p className="mt-3 text-[13px] leading-[1.85] md:text-[12px]">{step.text}</p>
              )}
            </div>
          </article>
        ))}
        <Action link={block.link} variant="plain" className="mt-5" />
      </div>
    </BlockSection>
  )
}
