import { expect, test } from '@playwright/test'

test.describe('blog pinned posts', () => {
  test('places pinned published posts first and hides drafts', async ({ page }) => {
    await page.goto('/zh/blog')

    const cards = page.locator('.blog-card')
    await expect(cards.first()).toBeVisible()
    await expect(cards.nth(0)).toContainText('Hello World')
    await expect(page.locator('.draft-preview')).toHaveCount(0)
    await expect(page.locator('.blog-card--draft')).toHaveCount(0)
    await expect(page.locator('body')).not.toContainText('Draft：架構復盤')
  })

  test('ignores draft preview query in production preview builds', async ({ page }) => {
    await page.goto('/zh/blog?preview=drafts')

    const cards = page.locator('.blog-card')
    await expect(cards.first()).toBeVisible()
    await expect(page.locator('.draft-preview')).toHaveCount(0)
    await expect(page.locator('.blog-card--draft')).toHaveCount(0)
    await expect(page.locator('body')).not.toContainText('Draft：架構復盤')
  })

  test('does not open direct draft URLs in production preview builds', async ({ page }) => {
    await page.goto('/zh/blog/draft-architecture-retro?preview=drafts')

    await expect(page.locator('.blog-article')).toHaveCount(0)
    await expect(page.locator('.empty-state')).toContainText('文章不存在或尚未發佈')
  })
})
