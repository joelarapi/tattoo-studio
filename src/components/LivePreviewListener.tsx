'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

/**
 * Mount on a page only while draft mode is on. When an editor saves (or autosaves) in the CMS's
 * live preview, it re-renders the server components with the new draft.
 */
export function LivePreviewListener() {
  const router = useRouter()
  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
    />
  )
}
