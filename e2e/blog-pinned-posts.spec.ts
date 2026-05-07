import { expect, test } from '@playwright/test'

test.describe('blog pinned posts', () => {
  test('places pinned published posts first and hides drafts', async ({ page }) => {
    await page.goto('/zh/blog')

    const cards = page.locator('.blog-card')
    await expect(cards).toHaveCount(6)
    await expect(cards.nth(0)).toContainText('Hello World')
    await expect(page.locator('body')).not.toContainText('Draft：架構復盤')
  })
})
