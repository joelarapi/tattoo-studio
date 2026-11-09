import { defaultLocale } from './i18n'

const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
type Day = (typeof DAY_ORDER)[number]

const DAY_LABELS: Record<Day, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
}

/** Schema.org day names, for openingHoursSpecification. */
export const SCHEMA_DAYS: Record<Day, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

/** "30 Oct 2026". */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat(defaultLocale === 'en' ? 'en-GB' : defaultLocale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

export const whatsappHref = (phone: string) => `https://wa.me/${phone.replace(/\D/g, '')}`

/** Turns ["tue","wed","thu","fri"] into "Tue–Fri" and ["mon","wed"] into "Mon, Wed". */
export function formatDays(days: readonly string[]): string {
  const indexes = days
    .map((day) => DAY_ORDER.indexOf(day as Day))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b)
  const runs: number[][] = []
  for (const i of indexes) {
    const run = runs.at(-1)
    if (run && run.at(-1) === i - 1) run.push(i)
    else runs.push([i])
  }
  return runs
    .map((run) => {
      const first = DAY_LABELS[DAY_ORDER[run[0]]]
      if (run.length === 1) return first
      const last = DAY_LABELS[DAY_ORDER[run.at(-1)!]]
      return run.length === 2 ? `${first}, ${last}` : `${first}–${last}`
    })
    .join(', ')
}

type OpeningHours = { days: readonly string[]; opens: string; closes: string }[] | null | undefined

/** Opening-hours rows plus a "Closed" row for the days not listed. */
export function openingHoursRows(hours: OpeningHours): { days: string; hours: string }[] {
  const rows = (hours ?? []).map((row) => ({
    days: formatDays(row.days),
    hours: `${row.opens}–${row.closes}`,
  }))
  const open = new Set((hours ?? []).flatMap((row) => row.days))
  const closed = DAY_ORDER.filter((day) => !open.has(day))
  if (closed.length) rows.push({ days: formatDays(closed), hours: 'Closed' })
  return rows
}
