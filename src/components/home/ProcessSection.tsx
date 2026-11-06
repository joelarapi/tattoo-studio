import { ScrollSequence } from '@/components/scroll-sequence/ScrollSequence'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Homepage } from '@/payload-types'

type ProcessSectionProps = {
  process: Homepage['process']
  /** CMS override for the animation's first frame (Homepage → Hero → process still). */
  posterSrc?: string | null
}

export function ProcessSection({ process, posterSrc }: ProcessSectionProps) {
  return (
    <section id="process" aria-labelledby="process-heading" className="relative">
      <Container className="pt-section">
        <SectionHeading id="process-heading" heading={process.heading} align="center" />
      </Container>
      {/* Below the fold on the homepage, so the poster isn't fetched with high priority. */}
      <ScrollSequence
        name={process.sequence || 'placeholder'}
        steps={process.steps}
        posterSrc={posterSrc}
        priority={false}
      />
    </section>
  )
}
