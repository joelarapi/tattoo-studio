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
  const logo = typeof settings.logo === 'object' ? settings.logo : null
  // The supplied square Canva export has artwork at x=131..986, y=436..731.
  // Frame that artwork without changing the original CMS upload.
  const paddedLogo =
    logo?.width === 1080 && logo?.height === 1080 && /ads.*booster/i.test(logo.filename ?? '')
  return (
    <Link href="/" className={cn('inline-block max-w-full self-start', className)}>
      {logo ? (
        <span
          className={cn(
            'block w-[180px] max-w-full lg:w-[220px]',
            paddedLogo && 'relative aspect-[856/296] overflow-hidden',
          )}
        >
          <CmsImage
            media={logo}
            alt={settings.studioName}
            photo={false}
            className={paddedLogo ? 'absolute h-auto max-w-none' : 'h-auto w-full'}
            style={
              paddedLogo
                ? {
                    width: `${(1080 / 856) * 100}%`,
                    left: `${(-131 / 856) * 100}%`,
                    top: `${(-436 / 296) * 100}%`,
                  }
                : undefined
            }
          />
        </span>
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
