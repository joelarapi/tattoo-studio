/**
 * Site languages. Only English is built today. To add Albanian later: add 'sq' here, enable
 * Payload `localization` with the same codes, and move frontend routes under app/(frontend)/[locale].
 */
export const locales = ['en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'
