import config from '@payload-config'
import { getPayload } from 'payload'

/** Local API client for server components and route handlers. `getPayload` caches the instance. */
export function getPayloadClient() {
  return getPayload({ config })
}
