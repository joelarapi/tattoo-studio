import { mcpPlugin } from '@payloadcms/plugin-mcp'

/*
 * MCP endpoint (POST /api/mcp) for AI assistants to read and edit content. Each request acts as
 * the CMS user who owns the key, so the usual access rules apply; the key's own checkboxes narrow
 * that further. Nothing can be deleted through it, and leads and users aren't exposed at all.
 *
 * Keys are sent as `Authorization: Bearer <key>`, or as `?key=<key>` in the URL for clients that
 * can't send headers (ChatGPT only offers OAuth or no authentication). A key in a URL works for
 * anyone who has the URL, so those keys should be narrow and revoked when no longer used.
 */

const content = (description: string) => ({
  enabled: { find: true, create: true, update: true },
  description,
})

export const mcp = mcpPlugin({
  collections: {
    pages: content(
      'Every page of the site. A page’s `layout` is its list of sections (blocks, each with a `blockType`); a page top (homeHero or pageHero) may only come first. The page with slug "home" is the homepage.',
    ),
    'portfolio-items': content(
      'Tattoo pieces. Each has its own page at /portfolio/<slug>. clientConsent must stay true.',
    ),
    styles: content('Portfolio categories, used by the portfolio filter.'),
    artists: content('The studio’s artists.'),
    posts: content('Journal articles (/journal/<slug>). content is Lexical rich text.'),
    categories: content('Journal categories.'),
    faqs: content('Questions and answers. A page’s FAQ section picks which ones it shows.'),
    // Uploading needs a file, which MCP can't send, so media can only be found and relabelled.
    media: {
      enabled: { find: true, update: true },
      description: 'Images and videos. Link them by id; alt and caption can be edited.',
    },
  },
  globals: {
    'piece-template': {
      enabled: { find: true, update: true },
      description:
        'Text shared by every portfolio piece’s own page, and the sections (`after`) shown under each piece.',
    },
    'article-template': {
      enabled: { find: true, update: true },
      description:
        'Labels shared by every journal article’s own page, and the sections (`after`) shown under each article.',
    },
    'site-settings': {
      enabled: { find: true, update: true },
      description:
        'Studio details used on every page (name, contact, address, hours, socials), the shared sections and the enquiry form’s text.',
    },
    navigation: { enabled: { find: true, update: true }, description: 'Header and footer links.' },
  },
  overrideAuth: (req, getDefaultMcpAccessSettings) =>
    getDefaultMcpAccessSettings(req.searchParams?.get('key')),
  overrideApiKeyCollection: (collection) => ({
    ...collection,
    labels: { singular: 'AI access key', plural: 'AI access keys' },
    admin: {
      ...collection.admin,
      group: 'Settings',
      description:
        'Keys that let an AI assistant (ChatGPT, Claude) read and edit content through MCP. A key acts as the user who created it; tick only what it needs. Delete a key to revoke it.',
    },
  }),
  mcp: {
    serverOptions: {
      serverInfo: { name: 'Website CMS', version: '1.0.0' },
      instructions: [
        'The content of this website, in Payload CMS. Pages are built from sections: a page’s `layout` is an ordered list of blocks. Portfolio pieces, journal posts, FAQs, styles and artists are collections.',
        'To change a page, find it by slug, then send its whole `layout` back with your change: add, remove or reorder blocks, or edit their fields. Keep each block’s `blockType`.',
        'Read a document before changing it. Send only the fields you change, but arrays and groups are replaced as a whole, so send them complete.',
        'Save edits with draft: true unless the user asks to publish. Drafts can be checked in the admin panel’s preview; published changes go live at once.',
        'Never invent studio facts such as prices, address, opening hours or client stories.',
      ].join('\n'),
    },
  },
})
