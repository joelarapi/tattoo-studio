import { StandardsMark } from '@/components/art/StandardsMark'
import { LineArt } from '@/components/motion/LineArt'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/cn'
import type { Homepage } from '@/payload-types'

type Item = NonNullable<Homepage['standards']['items']>[number]

function Standard({ item, align }: { item: Item; align: 'left' | 'right' }) {
  return (
    <li
      data-reveal=""
      data-fade=""
      className={cn('flex flex-col gap-4', align === 'right' && 'lg:items-end lg:text-right')}
    >
      <Icon name={item.icon} className="size-8 text-text" />
      <h3 className="text-h5">{item.title}</h3>
      <p className="max-w-[34ch]">{item.text}</p>
    </li>
  )
}

/** Four promises around a central line-art mark (two either side on desktop). */
export function Standards({ copy }: { copy: Homepage['standards'] }) {
  const items = copy.items ?? []
  if (items.length === 0) return null
  const left = items.filter((_, i) => i % 2 === 0)
  const right = items.filter((_, i) => i % 2 === 1)
  return (
    <section id="standards" aria-labelledby="standards-heading" className="py-section-lg">
      <Container>
        <SectionHeading
          id="standards-heading"
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          align="center"
        />
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,26rem)_1fr]">
          <LineArt className="mx-auto aspect-square w-full max-w-72 lg:order-2 lg:max-w-none">
            <StandardsMark />
          </LineArt>
          <ul className="grid gap-12 sm:grid-cols-2 lg:order-1 lg:grid-cols-1 lg:gap-20">
            {left.map((item) => (
              <Standard key={item.id} item={item} align="right" />
            ))}
          </ul>
          <ul className="grid gap-12 sm:grid-cols-2 lg:order-3 lg:grid-cols-1 lg:gap-20">
            {right.map((item) => (
              <Standard key={item.id} item={item} align="left" />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
