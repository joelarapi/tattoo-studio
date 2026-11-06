import { cn } from '@/lib/cn'

/**
 * Faint 1px drafting grid as a background layer, fading out towards the edges. Pure CSS, so it
 * costs nothing to render. Place inside a positioned parent.
 */
export function GridLines({ className, size = 80 }: { className?: string; size?: number }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]',
        className,
      )}
      style={{
        backgroundImage:
          'linear-gradient(var(--color-surface-2) 1px, transparent 1px), linear-gradient(90deg, var(--color-surface-2) 1px, transparent 1px)',
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: 'center center',
      }}
    />
  )
}
