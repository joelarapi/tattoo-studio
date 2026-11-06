import type { ReactNode } from 'react'

import type { SiteSetting } from '@/payload-types'

type Platform = NonNullable<SiteSetting['socialLinks']>[number]['platform']

export const platformLabels: Record<Platform, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  pinterest: 'Pinterest',
  x: 'X',
  google: 'Google',
}

const paths: Record<Platform, ReactNode> = {
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: (
    <path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4a21 21 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.1H8.7v3h2.6V21" />
  ),
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.2 4.4 5 4.7" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="m10 9.2 5 2.8-5 2.8Z" />
    </>
  ),
  pinterest: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m10.5 21 2-8.5M10 13.5c.5 1 1.4 1.5 2.5 1.5 2.2 0 3.5-2 3.5-4.2C16 8.4 14.2 7 12 7s-4 1.6-4 3.8c0 .9.3 1.7.8 2.2" />
    </>
  ),
  x: <path d="m4 4 16 16M20 4 4 20" />,
  google: (
    <path d="M20.5 12.2c0-.6-.1-1.2-.2-1.7H12v3.3h4.8a4.2 4.2 0 0 1-1.8 2.7A5.6 5.6 0 0 1 6.4 12 5.6 5.6 0 0 1 15.8 7.8l2.4-2.4A9 9 0 1 0 12 21c5 0 8.5-3.5 8.5-8.8Z" />
  ),
}

export function SocialIcon({ platform }: { platform: Platform }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      {paths[platform]}
    </svg>
  )
}
