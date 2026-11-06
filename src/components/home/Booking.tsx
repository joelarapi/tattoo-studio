import { BookingForm } from '@/components/forms/BookingForm'
import { RichText } from '@/components/RichText'
import { Container } from '@/components/ui/Container'
import { CornerTicks } from '@/components/ui/CornerTicks'
import { GridLines } from '@/components/ui/GridLines'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Artist, Homepage, Style } from '@/payload-types'

type BookingProps = {
  copy: Homepage['booking']
  styles: Pick<Style, 'id' | 'name'>[]
  artists: Pick<Artist, 'id' | 'name'>[]
}

export function Booking({ copy, styles, artists }: BookingProps) {
  return (
    <section
      id="book"
      aria-labelledby="book-heading"
      className="relative overflow-hidden py-section-lg"
    >
      <GridLines className="opacity-60" />
      <Container className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
        <SectionHeading
          id="book-heading"
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          intro={copy.intro}
          className="lg:sticky lg:top-[calc(var(--nav-height)+2rem)] lg:self-start"
        />
        <div className="relative rounded-md bg-surface p-6 sm:p-10">
          <CornerTicks />
          <BookingForm
            styles={styles.map(({ id, name }) => ({ id, name }))}
            artists={artists.map(({ id, name }) => ({ id, name }))}
            submitLabel={copy.submitLabel}
            privacyNote={
              copy.privacyNote ? (
                <RichText data={copy.privacyNote} className="[&_a]:text-text [&_a]:underline" />
              ) : undefined
            }
          />
        </div>
      </Container>
    </section>
  )
}
