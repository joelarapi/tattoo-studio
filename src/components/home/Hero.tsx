import Link from 'next/link'

import { HeroArt } from '@/components/art/HeroArt'
import { LineArt } from '@/components/motion/LineArt'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { GridLines } from '@/components/ui/GridLines'
import type { Homepage } from '@/payload-types'

export function Hero({ hero }: { hero: Homepage['hero'] }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      {/* Line art fills the hero from below the nav down, never behind the nav itself. */}
      <div className="absolute inset-x-0 top-nav bottom-0 overflow-hidden">
        <GridLines />
        <LineArt trigger="load" className="absolute inset-0">
          <HeroArt />
        </LineArt>
        {/* Darken the centre so the headline always reads cleanly over the drawing. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_50%_50%,var(--color-bg)_20%,transparent_100%)]" />
      </div>

      <Container className="relative flex flex-1 flex-col items-center justify-center pt-nav pb-16 text-center">
        {hero.eyebrow && (
          <Eyebrow pill className="flex-wrap justify-center gap-y-1 text-label-sm sm:text-label">
            <span className="whitespace-nowrap">{hero.eyebrow}</span>
            {hero.eyebrowLink?.label && hero.eyebrowLink.href && (
              <>
                <span aria-hidden="true" className="text-text-muted">
                  ·
                </span>
                <Link
                  href={hero.eyebrowLink.href}
                  className="whitespace-nowrap underline-offset-4 hover:underline"
                >
                  {hero.eyebrowLink.label} <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </Eyebrow>
        )}
        {/* Painted straight away (it's the LCP element); the flicker plays once JS arrives. */}
        <SplitReveal
          as="h1"
          id="hero-heading"
          play
          hideUntilPlayed={false}
          className="mt-8 max-w-[15ch] text-display"
        >
          {hero.heading}
        </SplitReveal>
        <p className="mt-6 max-w-[46ch] text-large">{hero.intro}</p>
        {hero.cta?.label && hero.cta.href && (
          <Button href={hero.cta.href} className="mt-10">
            {hero.cta.label}
          </Button>
        )}
      </Container>

      {hero.scrollLabel && (
        <a
          href="#process"
          className="relative mx-auto mb-8 flex flex-col items-center gap-3 mono-label-sm text-text-muted transition-colors hover:text-text"
        >
          {hero.scrollLabel}
          <span aria-hidden="true" className="relative h-10 w-px overflow-hidden bg-surface-2">
            <span className="absolute inset-x-0 top-0 h-1/3 animate-[scroll-hint_1.8s_var(--ease-studio)_infinite] bg-accent motion-reduce:animate-none" />
          </span>
        </a>
      )}
    </section>
  )
}
