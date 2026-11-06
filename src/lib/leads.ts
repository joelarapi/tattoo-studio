/** Options shared by the lead form (Phase 6) and the `leads` collection. */

export const tattooSizeOptions = [
  { label: 'Small (up to 5 cm)', value: 'small' },
  { label: 'Medium (5–15 cm)', value: 'medium' },
  { label: 'Large (15–30 cm)', value: 'large' },
  { label: 'Extra large / sleeve or back piece', value: 'xl' },
  { label: 'Not sure yet', value: 'unsure' },
] as const

export const leadStatusOptions = [
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Booked', value: 'booked' },
  { label: 'Closed', value: 'closed' },
] as const

/** Videos on portfolio items and reference images on leads are capped to keep pages fast. */
export const MAX_VIDEO_BYTES = 8 * 1024 * 1024
export const MAX_LEAD_IMAGE_BYTES = 5 * 1024 * 1024
