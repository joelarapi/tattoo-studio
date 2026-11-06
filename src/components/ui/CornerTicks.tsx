import { cn } from '@/lib/cn'

const corners = [
  'top-0 left-0 border-t border-l',
  'top-0 right-0 border-t border-r',
  'bottom-0 left-0 border-b border-l',
  'bottom-0 right-0 border-b border-r',
]

/** Small L-shaped accent ticks on the four corners of the nearest positioned parent. */
export function CornerTicks({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('pointer-events-none absolute -inset-px', className)}>
      {corners.map((corner) => (
        <span key={corner} className={cn('absolute size-2.5 border-accent', corner)} />
      ))}
    </span>
  )
}
