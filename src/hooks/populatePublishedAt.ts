import type { FieldHook } from 'payload'

/** Stamps the first publish date, including publishes run by the scheduler. Editors can change it. */
export const populatePublishedAt: FieldHook = ({ siblingData, value }) => {
  if (!value && siblingData._status === 'published') return new Date().toISOString()
  return value
}
