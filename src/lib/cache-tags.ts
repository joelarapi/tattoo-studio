import type { CollectionSlug, GlobalSlug } from 'payload'

/*
 * Cache tags shared by the revalidation hooks (src/hooks/revalidate.ts) and the frontend data
 * fetchers. One tag per collection and per global. A fetcher tags itself with *every* collection
 * it reads, populated relationships included (a post page reads posts, artists, categories and
 * media), so a change anywhere refreshes every page that shows it.
 */

export const collectionTag = (slug: CollectionSlug) => `collection:${slug}`

export const globalTag = (slug: GlobalSlug) => `global:${slug}`
