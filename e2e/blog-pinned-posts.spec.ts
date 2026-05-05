import { expect, test } from '@playwright/test'

test.describe('blog pinned posts', () => {
  test('places pinned posts before newer unpinned posts', async ({ page }) => {
    await page.goto('/ethan-web/en/blog')

    const cards = page.locator('.blog-card')
    await expect(cards).toHaveCount(2)
    await expect(cards.nth(0)).toContainText('Using Phone Camera as OpenCV Capture Source')
    await expect(cards.nth(1)).toContainText('System Design Note: From Requirements to Maintainable Structure')
  })
})
