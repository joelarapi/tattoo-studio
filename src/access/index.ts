import type { Access, FieldAccess, PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

export type Role = NonNullable<User['roles']>[number]

/**
 * True for a logged-in CMS user. MCP API keys are an auth collection too, so a request made with
 * one directly (not through /api/mcp) has a `user` from that collection, whose id can equal a CMS
 * user's.
 */
export function isCmsUser(user: PayloadRequest['user']): user is User & { collection: 'users' } {
  return user?.collection === 'users'
}

/** True when the logged-in user has at least one of the given roles. */
export function hasRole(user: PayloadRequest['user'], ...roles: Role[]): boolean {
  return isCmsUser(user) && Boolean(user.roles?.some((role) => roles.includes(role)))
}

export const anyone: Access = () => true

export const isAdmin: Access = ({ req: { user } }) => hasRole(user, 'admin')

/** Admins and editors: everyone who works in the CMS. */
export const isAdminOrEditor: Access = ({ req: { user } }) => hasRole(user, 'admin', 'editor')

/** Field-level variant of `isAdmin` (field access must return a boolean). */
export const adminFieldAccess: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin')

/** For collections with drafts: the public only ever sees published documents. */
export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (hasRole(user, 'admin', 'editor')) return true
  return { _status: { equals: 'published' } }
}

/** Admins see every user; everyone else only themselves. */
export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!isCmsUser(user)) return false
  if (hasRole(user, 'admin')) return true
  return { id: { equals: user.id } }
}
