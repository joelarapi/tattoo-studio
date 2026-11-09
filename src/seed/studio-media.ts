/*
 * The studio's own photos and films, as supplied for the design review. The seed downloads them
 * from there straight into the media library (R2 when it's configured), so the clients' tattoos
 * never sit in the git repository. Once seeded, the CMS is the only copy that matters.
 */
export const STUDIO_MEDIA_URL =
  'https://londonink-tattoo-design-review.cubii.chatgpt.site/assets/work/'

const mimeTypes: Record<string, string> = { jpg: 'image/jpeg', mp4: 'video/mp4' }

export const photoFile = (slug: string, number: number) =>
  `${slug}-${String(number).padStart(2, '0')}.jpg`
export const videoFile = (slug: string) => `${slug}-video-01.mp4`
export const posterFile = (slug: string) => `${slug}-video-01-poster.jpg`

/** One file, ready for `payload.create({ collection: 'media', file })`, or null if unavailable. */
export async function studioFile(name: string) {
  try {
    const response = await fetch(new URL(name, STUDIO_MEDIA_URL), {
      signal: AbortSignal.timeout(60_000),
    })
    if (!response.ok) return null
    const data = Buffer.from(await response.arrayBuffer())
    const mimetype =
      mimeTypes[name.split('.').pop() ?? ''] ?? response.headers.get('content-type') ?? ''
    return { data, mimetype, name, size: data.length }
  } catch {
    return null
  }
}
