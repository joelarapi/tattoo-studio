import {
  BlocksFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'

import { ArtistCard } from '@/blocks/ArtistCard'
import { CallToAction } from '@/blocks/CallToAction'

const linkFeature = () =>
  LinkFeature({ enabledCollections: ['posts', 'artists', 'styles', 'legal-pages'] })

/** Short formatted text: bios, FAQ answers, legal pages. */
export const basicEditor = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    linkFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    InlineToolbarFeature(),
  ],
})

// Features that don't fit a dark long-form article, or that the post template doesn't style.
const unusedInPosts = new Set([
  'heading',
  'link',
  'upload',
  'relationship',
  'checklist',
  'subscript',
  'superscript',
  'inlineCode',
  'align',
  'indent',
])

/** Journal articles. The post title is the page's H1, so headings start at H2. */
export const postEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((feature) => !unusedInPosts.has(feature.key)),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    linkFeature(),
    UploadFeature({ enabledCollections: ['media'] }),
    BlocksFeature({ blocks: [CallToAction, ArtistCard] }),
    FixedToolbarFeature(),
  ],
})
