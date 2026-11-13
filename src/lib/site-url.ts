/** Public SEO URLs follow the site's non-www redirect destination. */
export function getCanonicalOrigin(): string {
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  url.hostname = url.hostname.replace(/^www\./i, '')
  return url.origin
}
