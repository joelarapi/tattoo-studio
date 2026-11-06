/** Builds the URL the admin opens for preview / live preview. `/api/preview` checks the secret. */
export function generatePreviewPath(path: string): string {
  const params = new URLSearchParams({ path, secret: process.env.PREVIEW_SECRET || '' })
  return `${getServerURL()}/api/preview?${params.toString()}`
}

export function getServerURL(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
}
