import { expect, type Page, test } from '@playwright/test'

import { login } from '../helpers/login'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

const base = process.env.E2E_BASE_URL ?? 'http://localhost:3000'
const slug = `e2e-page-${Date.now()}`
// Its own login: the admin spec runs in parallel and resets the shared test user.
const user = { ...testUser, email: 'pages-e2e@example.com' }

const sections = [
  {
    blockType: 'pageHero',
    layout: 'centred',
    height: 'compact',
    heading: { text: 'A page built in the CMS.' },
    showJumpBar: true,
  },
  {
    blockType: 'faq',
    tag: 'Questions',
    heading: { text: 'Questions first.' },
    settings: { anchor: 'questions', jumpLabel: 'Your questions', background: 'line' },
  },
  { blockType: 'pageCta', source: 'shared' },
]

/** The page's sections, top to bottom, by block type. */
const blockOrder = (page: Page) =>
  page
    .locator('main [data-block]')
    .evaluateAll((els) => els.map((el) => el.getAttribute('data-block')))

test.describe('Page builder', () => {
  let page: Page
  let id: number | undefined

  test.beforeAll(async ({ browser }) => {
    await seedTestUser(user)
    page = await (await browser.newContext()).newPage()
    await login({ page, user, serverURL: base })
  })

  test.afterAll(async () => {
    if (id) await page.request.delete(`${base}/api/pages/${id}`)
    await cleanupTestUser(user)
  })

  test('a new page goes live at its own address', async () => {
    const response = await page.request.post(`${base}/api/pages`, {
      data: { title: 'E2E page', slug, layout: sections, _status: 'published' },
    })
    expect(response.ok()).toBe(true)
    id = (await response.json()).doc.id

    const visit = await page.goto(`${base}/${slug}`)
    expect(visit?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveText('A page built in the CMS.')
    expect(await blockOrder(page)).toEqual(['pageHero', 'faq', 'pageCta'])
    await expect(
      page.getByRole('navigation', { name: 'On this page' }).getByRole('link'),
    ).toHaveAttribute('href', '#questions')
    await expect(page.locator('#questions')).toBeVisible()
  })

  test('reordering the sections reorders the page', async () => {
    const response = await page.request.patch(`${base}/api/pages/${id}`, {
      data: { layout: [sections[0], sections[2], sections[1]], _status: 'published' },
    })
    expect(response.ok()).toBe(true)
    await page.goto(`${base}/${slug}`)
    expect(await blockOrder(page)).toEqual(['pageHero', 'pageCta', 'faq'])
  })

  test('the page editor shows the sections by their headings', async () => {
    await page.goto(`${base}/admin/collections/pages/${id}`)
    await expect(page.getByText('Questions first.').first()).toBeVisible()
  })
})
