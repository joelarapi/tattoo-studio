import { StatementArt } from '@/components/art/StatementArt'
import { LineArt } from '@/components/motion/LineArt'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import type { Homepage } from '@/payload-types'

export function Statement({ copy }: { copy: Homepage['statement'] }) {
  return (
    <section
      id="studio"
      aria-labelledby="studio-heading"
      className="relative overflow-hidden py-section-lg"
    >
      <LineArt className="absolute inset-0" duration={2.4}>
        <StatementArt />
      </LineArt>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_45%_at_50%_50%,var(--color-bg)_25%,transparent_100%)]" />

      <Container className="relative flex min-h-[70svh] flex-col items-center justify-center gap-8 text-center">
        {copy.eyebrow && <Eyebrow>{copy.eyebrow}</Eyebrow>}
        <SplitReveal as="h2" id="studio-heading" className="text-h1">
          {[copy.headingLine1, copy.headingLine2].filter(Boolean).join('\n')}
        </SplitReveal>
        {copy.text && (
          <p data-reveal="" data-fade="" className="max-w-[48ch] text-large">
            {copy.text}
          </p>
        )}
        <div data-reveal="" data-fade="" className="flex flex-wrap justify-center gap-3">
          {copy.secondaryButton?.label && copy.secondaryButton.href && (
            <Button href={copy.secondaryButton.href} variant="secondary">
              {copy.secondaryButton.label}
            </Button>
          )}
          {copy.primaryButton?.label && copy.primaryButton.href && (
            <Button href={copy.primaryButton.href}>{copy.primaryButton.label}</Button>
          )}
        </div>
      </Container>
    </section>
  )
}
