import { Asterisk } from '@/components/art/Glyphs'

import type { BlockProps } from '../types'

/** A band of short phrases separated by asterisks (decorative: screen readers skip it). */
export function TextStrip({ block }: BlockProps<'textStrip'>) {
  if (!block.phrases?.length) return null
  return (
    <div
      aria-hidden="true"
      data-block="textStrip"
      className="flex items-center justify-start gap-5 overflow-hidden border-y border-line-strong bg-panel px-[6%] py-[15px] whitespace-nowrap md:justify-around md:gap-[25px] md:px-[5%] md:py-5"
    >
      {block.phrases.map((item) => (
        <span key={item.id} className="contents">
          <span className="font-label text-[10px] tracking-[1px] text-text uppercase md:text-[12px]">
            {item.text}
          </span>
          <Asterisk className="shrink-0 text-[16px] md:text-[20px]" />
        </span>
      ))}
    </div>
  )
}
