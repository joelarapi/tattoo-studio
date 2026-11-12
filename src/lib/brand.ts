const STUDIO_NAME = 'LondonInk Tattoo'
const brandVariants = /\bLondon\s*Ink\s*Tattoo\b/gi
const identifierFields = new Set(['href', 'url', 'slug', 'filename', 'email', 'path', 'prefix'])

/** Normalize old CMS copy at the public read boundary, including rich text and SEO fields. */
export function normalizeBrandCopy<T>(value: T): T
export function normalizeBrandCopy(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(brandVariants, STUDIO_NAME)
  }
  if (Array.isArray(value)) return value.map(normalizeBrandCopy)
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        identifierFields.has(key) || /url$/i.test(key) ? entry : normalizeBrandCopy(entry),
      ]),
    )
  }
  return value
}
