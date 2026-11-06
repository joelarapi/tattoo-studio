import type { Block } from 'payload'

/** Shows an artist's card (portrait, name, styles, link) inside a journal post. */
export const ArtistCard: Block = {
  slug: 'artistCard',
  interfaceName: 'ArtistCardBlock',
  labels: { singular: 'Artist card', plural: 'Artist cards' },
  fields: [
    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'artists',
      required: true,
    },
  ],
}
