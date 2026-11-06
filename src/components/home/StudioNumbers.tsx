import { CmsImage } from '@/components/ui/CmsImage'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'
import type { Homepage } from '@/payload-types'

/* Bento layout for up to 6 cards: the first is large, the rest fill around it. */
const spans = [
  'lg:col-span-2 lg:row-span-2',
  'lg:col-span-2',
  '',
  '',
  'lg:col-span-2',
  'lg:col-span-2',
]

export function StudioNumbers({ copy }: { copy: Homepage['numbers'] }) {
  const stats = copy.stats ?? []
  if (stats.length === 0) return null
  return (
    <section id="numbers" aria-labelledby="numbers-heading" className="py-section-lg">
      <Container>
        <SectionHeading id="numbers-heading" eyebrow={copy.eyebrow} heading={copy.heading} />
        <ul className="mt-14 grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <li
              key={stat.id}
              data-reveal=""
              data-fade=""
              className={cn('flex flex-col gap-7 rounded-md bg-surface p-7', spans[i])}
            >
              <div
                className={cn(
                  'relative overflow-hidden rounded-sm bg-bg',
                  i === 0 ? 'aspect-[4/3] lg:aspect-auto lg:flex-1' : 'aspect-[16/10]',
                )}
              >
                <CmsImage
                  media={stat.image}
                  alt=""
                  fill
                  sizes={
                    i === 0 ? '(min-width: 1024px) 45vw, 90vw' : '(min-width: 1024px) 22vw, 90vw'
                  }
                  className="object-cover"
                />
              </div>
              <p className="text-large">
                <strong className="font-medium text-text">
                  {formatNumber(stat.value)}
                  {stat.unit}
                </strong>{' '}
                {stat.text}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
