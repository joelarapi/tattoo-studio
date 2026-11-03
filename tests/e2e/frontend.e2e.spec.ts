import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('homepage renders a single h1', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })
})
