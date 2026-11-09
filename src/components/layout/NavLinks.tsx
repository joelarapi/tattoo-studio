'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/cn'

type NavLink = { id?: string | null; label: string; href: string }

/** Whether a menu link points at the current page (or a page inside it). */
function isCurrent(href: string, pathname: string) {
  const path = href.split(/[?#]/)[0]
  if (!path.startsWith('/')) return false
  if (path === '/') return pathname === '/'
  return pathname === path || pathname.startsWith(`${path}/`)
}

/** The menu links, with the current page marked for screen readers and in orange. */
export function NavLinks({
  links,
  cta,
  className,
  linkClassName,
  ctaClassName,
}: {
  links: NavLink[]
  cta?: { label: string; href: string } | null
  className?: string
  linkClassName?: string
  ctaClassName?: string
}) {
  const pathname = usePathname()
  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.id ?? link.href}>
          <Link
            href={link.href}
            aria-current={isCurrent(link.href, pathname) ? 'page' : undefined}
            className={cn(
              'whitespace-nowrap uppercase transition-colors hover:text-accent aria-[current=page]:text-accent',
              linkClassName,
            )}
          >
            {link.label}
          </Link>
        </li>
      ))}
      {cta?.href && (
        <li>
          <Link
            href={cta.href}
            aria-current={isCurrent(cta.href, pathname) ? 'page' : undefined}
            className={cn('btn btn-accent', ctaClassName)}
          >
            {cta.label} ↗&#xFE0E;
          </Link>
        </li>
      )}
    </ul>
  )
}
