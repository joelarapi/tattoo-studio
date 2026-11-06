import Image, { type ImageProps } from 'next/image'

import type { Media } from '@/payload-types'

type CmsImageProps = Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> & {
  /** An upload field value: the populated doc (IDs render nothing; populate with depth ≥ 1). */
  media: Media | number | null | undefined
  /** Override the CMS alt text, e.g. "" when the image is decorative next to its caption. */
  alt?: string
}

/**
 * `next/image` for CMS uploads: alt text from the CMS (required there), the editor's focal point
 * as `object-position`, and the original's dimensions unless `fill` is used.
 */
export function CmsImage({ media, alt, fill, style, ...rest }: CmsImageProps) {
  if (!media || typeof media !== 'object' || !media.url) return null
  const objectPosition =
    media.focalX != null && media.focalY != null ? `${media.focalX}% ${media.focalY}%` : undefined

  return (
    <Image
      {...rest}
      src={media.url}
      alt={alt ?? media.alt}
      {...(fill ? { fill: true } : { width: media.width ?? 1200, height: media.height ?? 800 })}
      style={{ objectPosition, ...style }}
    />
  )
}
