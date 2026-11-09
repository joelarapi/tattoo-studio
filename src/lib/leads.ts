/** Options and limits shared by the enquiry form and the `leads` collection. */

export const leadStatusOptions = [
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Booked', value: 'booked' },
  { label: 'Closed', value: 'closed' },
] as const

/** Videos on portfolio items and films are capped to keep pages fast. */
export const MAX_VIDEO_BYTES = 8 * 1024 * 1024

/** Reference files clients attach to an enquiry. */
export const MAX_LEAD_FILES = 5
export const MAX_LEAD_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_LEAD_VIDEO_BYTES = 50 * 1024 * 1024
export const LEAD_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const LEAD_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'] as const
