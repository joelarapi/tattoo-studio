import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export const testUser = {
  name: 'Test user',
  email: 'dev@payloadcms.com',
  password: 'test',
  roles: ['admin' as const],
}

/**
 * Seeds a test user for e2e admin tests. Specs that run in parallel pass their own user.
 */
export async function seedTestUser(user = testUser): Promise<void> {
  const payload = await getPayload({ config })

  // Delete existing test user if any
  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: user.email,
      },
    },
  })

  // Create fresh test user
  await payload.create({
    collection: 'users',
    data: user,
  })
}

/**
 * Cleans up test user after tests
 */
export async function cleanupTestUser(user = testUser): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: user.email,
      },
    },
  })
}
