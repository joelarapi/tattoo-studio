import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import type { Field, Tab, UploadField } from 'payload'

/*
 * SEO fields (title, description, share image, Google preview), stored under `meta`. The
 * "Auto-generate" buttons call the generate functions in src/plugins/seo.ts.
 *
 * `meta.title` holds the *full* title as Google shows it (the generator adds the studio name),
 * so the frontend renders it as-is rather than through the title template.
 */
export function seoFields(): Field[] {
  const image = MetaImageField({ relationTo: 'media', hasGenerateFn: true })
  // Keep the plugin's admin component; only replace its generic file-size hint.
  const shareImage = {
    ...image,
    label: 'Share image',
    admin: {
      ...image.admin,
      description:
        'Shown when the page is shared on WhatsApp, Facebook etc. Leave empty to use the main image.',
    },
  } as UploadField
  return [
    OverviewField({}),
    MetaTitleField({ hasGenerateFn: true }),
    MetaDescriptionField({ hasGenerateFn: true }),
    shareImage,
    PreviewField({ hasGenerateFn: true }),
  ]
}

/** An "SEO" tab for collections that already use tabs. */
export function seoTab(): Tab {
  return { name: 'meta', label: 'SEO', fields: seoFields() }
}
