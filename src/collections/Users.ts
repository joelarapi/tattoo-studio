import type { CollectionConfig } from 'payload'

import { adminFieldAccess, adminOrSelf, hasRole, isAdmin } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'CMS user', plural: 'CMS users' },
  admin: {
    group: 'Settings',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
    description:
      'People who can log in to this CMS. Admins manage users and settings; editors manage content.',
  },
  auth: true,
  access: {
    admin: ({ req: { user } }) => hasRole(user, 'admin', 'editor'),
    create: isAdmin,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      // Whoever creates the very first account (the /admin setup screen) becomes an admin.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        if (totalDocs === 0) data.roles = ['admin']
        return data
      },
    ],
  },
  fields: [
    // Email and password are added by `auth`.
    { name: 'name', type: 'text', required: true },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        create: adminFieldAccess,
        update: adminFieldAccess,
      },
      admin: {
        position: 'sidebar',
        description: 'Editors can manage all content. Only admins can manage users and settings.',
      },
    },
  ],
}
