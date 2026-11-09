import { expect, test } from '@playwright/test'

const base = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

const pages = [
  '/',
  '/about',
  '/portfolio',
  '/portfolio/joker-playing-cards-sleeve',
  '/portfolio/peaky-blinders-upper-arm-tattoo',
  '/visiting-albania',
  '/journal',
  '/journal/tattoo-consultation',
  '/contact',
  '/privacy',
]

test.describe('Frontend', () => {
  for (const path of pages) {
    test(`${path} renders with a single h1`, async ({ page }) => {
      const response = await page.goto(`${base}${path}`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    })
  }

  for (const path of ['/nope', '/a/b']) {
    test(`${path} answers 404 inside the site layout`, async ({ page }) => {
      const response = await page.goto(`${base}${path}`)
      expect(response?.status()).toBe(404)
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('h1')).toHaveCount(1)
    })
  }

  test('homepage film cards open the piece’s page', async ({ page }) => {
    await page.goto(base)
    const film = page.getByRole('region', { name: 'Tattoo films' }).getByRole('link').first()
    await expect(film).toHaveAttribute('href', /^\/portfolio\/[a-z0-9-]+$/)
  })

  test('a piece’s photo opens in the lightbox', async ({ page }) => {
    await page.goto(`${base}/portfolio/clown-faces-forearm-tattoo`)
    await page.locator('main a[href*="clown-faces-forearm-tattoo-01"]').click()
    const dialog = page.locator('dialog[open]')
    await expect(dialog).toContainText('1 of 2')
    await page.keyboard.press('ArrowRight')
    await expect(dialog).toContainText('2 of 2')
    await dialog.getByRole('button', { name: 'Close ×' }).click()
    await expect(page.locator('dialog[open]')).toHaveCount(0)
  })

  test('a piece’s video has its cover and caption', async ({ page }) => {
    await page.goto(`${base}/portfolio/peaky-blinders-upper-arm-tattoo`)
    await expect(page.locator('main video')).toHaveAttribute('poster', /.+/)
    await expect(page.locator('main figcaption')).toContainText('Peaky Blinders')
  })

  test('the travel link opens the form with the travel fields', async ({ page }) => {
    await page.goto(`${base}/contact?travel=1#tattoo-enquiry`)
    await expect(page.locator('#travelling')).toBeChecked()
    await expect(page.getByLabel('Planned dates in Albania')).toBeVisible()
  })

  test('the form shows the not-connected notice instead of sending', async ({ page }) => {
    await page.goto(`${base}/contact`)
    await page.getByLabel('First name').fill('Test')
    await page.getByLabel('Surname').fill('Visitor')
    await page.getByLabel('Phone number, including country code').fill('+355 69 000 0000')
    await page.getByLabel('Tattoo placement').fill('Forearm')
    await page.getByLabel('Describe your tattoo idea').fill('A small botanical piece.')
    await page.locator('form button[type="submit"]').click()
    await expect(page.locator('form [role="status"]')).not.toBeEmpty()
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })

    test('the mobile menu opens', async ({ page }) => {
      await page.goto(base)
      await page.locator('header summary').click()
      await expect(page.locator('header details nav')).toBeVisible()
    })

    test('a piece’s photo links to the image file', async ({ page }) => {
      await page.goto(`${base}/portfolio/joker-playing-cards-sleeve`)
      await expect(page.locator('main a[href*="joker-playing-cards-sleeve-01"]')).toHaveCount(1)
    })

    test('content is not hidden by scroll animations', async ({ page }) => {
      await page.goto(`${base}/about`)
      const hidden = await page
        .locator('[data-reveal]')
        .evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity === '0').length)
      expect(hidden).toBe(0)
    })
  })
})
