import Link from 'next/link'

import { Asterisk } from '@/components/art/Glyphs'
import { CmsImage } from '@/components/ui/CmsImage'
import { cn } from '@/lib/cn'
import type { SiteSetting } from '@/payload-types'

/**
 * The studio name as a two-line wordmark: first word on top, the rest underneath with the
 * asterisk. An uploaded logo (Studio details) replaces it.
 */
export function Wordmark({
  settings,
  className,
}: {
  settings: Pick<SiteSetting, 'studioName' | 'logo'>
  className?: string
}) {
  const [first, ...rest] = settings.studioName.trim().split(/\s+/)
  return (
    <Link href="/" className={cn('inline-block', className)}>
      {typeof settings.logo === 'object' && settings.logo ? (
        <CmsImage
          media={settings.logo}
          alt={settings.studioName}
          photo={false}
          className="h-11 w-auto"
        />
      ) : (
        <span className="block text-[22px] leading-none font-extrabold tracking-[-1.2px] text-text uppercase lg:text-[26px]">
          {first}
          {rest.length > 0 && (
            <span className="mt-[5px] block text-[14px] tracking-[-0.5px] lg:text-[17px]">
              {rest.join(' ')}
              <Asterisk className="ml-[5px] align-[-2px] text-[0.9em]" />
            </span>
          )}
        </span>
      )}
    </Link>
  )
}
