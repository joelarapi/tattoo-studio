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

const pageText = (page: string) => ({
  enabled: { find: true, update: true },
  description: `Text and images of the ${page} page.`,
})

const content = (description: string) => ({
  enabled: { find: true, create: true, update: true },
  description,
})

export const mcp = mcpPlugin({
  collections: {
    'portfolio-items': content(
      'Tattoo pieces. Each has its own page at /portfolio/<slug>. clientConsent must stay true.',
    ),
    styles: content('Portfolio categories, used by the portfolio filter.'),
    artists: content('The studio’s artists.'),
    posts: content('Journal articles (/journal/<slug>). content is Lexical rich text.'),
    categories: content('Journal categories.'),
    faqs: content('Questions and answers. pages sets where each one appears.'),
    'legal-pages': content('Privacy and cookie policy pages.'),
    // Uploading needs a file, which MCP can't send, so media can only be found and relabelled.
    media: {
      enabled: { find: true, update: true },
      description: 'Images and videos. Link them by id; alt and caption can be edited.',
    },
  },
  globals: {
    homepage: pageText('home'),
    'about-page': pageText('About'),
    'portfolio-page': pageText('Portfolio'),
    'visiting-page': pageText('Visiting Albania'),
    'journal-page': pageText('Journal'),
    'contact-page': pageText('Contact'),
    'site-settings': {
      enabled: { find: true, update: true },
      description:
        'Studio details used on every page (name, contact, address, hours, socials) and shared sections.',
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
        'The content of this website, in Payload CMS. Each page’s text is a global; portfolio pieces, journal posts, FAQs, styles and artists are collections.',
        'Read a document before changing it. Send only the fields you change, but arrays and groups are replaced as a whole, so send them complete.',
        'Save edits with draft: true unless the user asks to publish. Drafts can be checked in the admin panel’s preview; published changes go live at once.',
        'Never invent studio facts such as prices, address, opening hours or client stories.',
      ].join('\n'),
    },
  },
})
