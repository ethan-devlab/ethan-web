import { expect, test } from '@playwright/test'

test.describe('blog callouts', () => {
  test('renders HackMD alerts and directive containers as styled callouts', async ({ page }) => {
    await page.goto('/en/blog/use-phone-camera-opencv')

    const article = page.locator('.blog-article')
    await expect(article).toBeVisible()

    await expect(article.locator('.blog-callout[data-callout-type="info"], .blog-callout[data-callout-type="note"]')).toHaveCount(1)
    await expect(article.locator('.blog-callout[data-callout-type="success"]')).toHaveCount(1)

    await expect(article).not.toContainText(':::success')
    await expect(article).not.toContainText(':::')
  })

  test('renders inline code with a visible background', async ({ page }) => {
    await page.goto('/en/blog/use-phone-camera-opencv')

    const inlineCode = page.locator('.blog-article p code', { hasText: 'Settings' })
    await expect(inlineCode).toBeVisible()

    const backgroundColor = await inlineCode.evaluate((element) => getComputedStyle(element).backgroundColor)
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(backgroundColor).not.toBe('transparent')
  })
})
