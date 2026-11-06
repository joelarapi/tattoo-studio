import { DrawLines } from '@/components/motion/DrawLines'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { CornerTicks } from '@/components/ui/CornerTicks'
import { Icon } from '@/components/ui/Icon'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Homepage, Style } from '@/payload-types'

type StylesGridProps = {
  copy: Homepage['styles']
  styles: Style[]
}

/** A hairline that draws in (see <DrawLines>). */
function Line({ axis, className }: { axis: 'x' | 'y'; className: string }) {
  return (
    <span
      aria-hidden="true"
      data-line={axis}
      data-reveal=""
      className={`absolute bg-line ${axis === 'x' ? 'h-px origin-left' : 'w-px origin-top'} ${className}`}
    />
  )
}

export function StylesGrid({ copy, styles }: StylesGridProps) {
  if (styles.length === 0) return null
  return (
    <section id="styles" aria-labelledby="styles-heading" className="py-section-lg">
      <Container>
        <SectionHeading
          id="styles-heading"
          heading={copy.heading}
          action={
            copy.button?.label &&
            copy.button.href && (
              <Button href={copy.button.href} variant="secondary" size="sm">
                {copy.button.label}
              </Button>
            )
          }
        />

        <DrawLines className="relative mt-14">
          <ul className="relative grid md:grid-cols-2">
            {styles.map((style) => (
              <li key={style.id} className="relative flex flex-col gap-5 p-8 md:p-10 lg:p-14">
                {/* Each cell draws its top and left edge; the grid adds the right and bottom. */}
                <Line axis="x" className="inset-x-0 top-0" />
                <Line axis="y" className="inset-y-0 left-0" />
                <Icon name={style.icon} className="size-8 text-text" />
                <h3 className="text-h5">{style.name}</h3>
                <p className="max-w-[44ch]">{style.shortDescription}</p>
                <Button
                  href={`/styles/${style.slug}`}
                  size="sm"
                  className="mt-auto self-start"
                  aria-label={`Learn more about ${style.name}`}
                >
                  Learn more
                </Button>
              </li>
            ))}
          </ul>
          <Line axis="x" className="inset-x-0 bottom-0" />
          <Line axis="y" className="inset-y-0 right-0" />
          <CornerTicks />
        </DrawLines>
      </Container>
    </section>
  )
}
