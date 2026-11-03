import type Lenis from 'lenis'

let instance: Lenis | null = null

/** The active smooth-scroll instance, or null (reduced motion, or not mounted yet). */
export function getLenis(): Lenis | null {
  return instance
}

export function setLenis(next: Lenis | null): void {
  instance = next
}
