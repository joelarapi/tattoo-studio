import { cn } from '@/lib/cn'
import type { SiteSetting } from '@/payload-types'

import { platformLabels, SocialIcon } from './SocialIcon'

/** The studio's CMS-managed social profiles, with consistent icon buttons and accessible names. */
export function SocialLinks({
  studioName,
  links,
  className,
}: {
  studioName: string
  links: SiteSetting['socialLinks']
  className?: string
}) {
  if (!links?.length) return null

  return (
    <ul className={cn('flex flex-wrap items-center gap-3', className)}>
      {links.map((social) => (
        <li key={social.id ?? social.platform}>
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${studioName} on ${platformLabels[social.platform]}`}
            title={platformLabels[social.platform]}
            className="grid size-11 place-items-center rounded-[5px] border border-[#3b3b3b] bg-panel text-[#deddd8] transition-colors hover:border-accent hover:text-accent"
          >
            <SocialIcon platform={social.platform} />
          </a>
        </li>
      ))}
    </ul>
  )
}
