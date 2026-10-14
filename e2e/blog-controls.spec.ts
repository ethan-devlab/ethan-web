import { expect, test } from '@playwright/test'

test.use({ colorScheme: 'dark' })

for (const width of [390, 1280]) {
    test(`underline controls retain search, native filters, and line-only focus at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/zh/blog')
      await expect(page.locator('.blog-card')).toHaveCount(9)
      const search = page.getByRole('searchbox')
      await expect(search).toHaveCSS('border-radius', '0px')
      await expect(search).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
      const bounds = await search.boundingBox()
      await search.focus()
      await expect(search).toHaveCSS('outline-style', 'none')
      expect(await search.evaluate(element => getComputedStyle(element).boxShadow)).toContain('inset')
      expect((await search.boundingBox())?.height).toBe(bounds?.height)
      await page.screenshot({ path: testInfo.outputPath('blog-controls-focus.png') })
      await search.fill('Jetson')
      for (const [name, value] of [['所有語言', 'zh'], ['所有分類', 'Tutorial'], ['所有標籤', 'Windows']]) {
        await page.keyboard.press('Tab')
        const filter = page.getByRole('combobox', { name, exact: true })
        await expect(filter).toBeFocused()
        await expect(filter).toHaveCSS('outline-style', 'none')
        expect(await filter.evaluate(element => getComputedStyle(element).boxShadow)).toContain('inset')
        await filter.selectOption(value)
      }
      await expect(page.locator('.blog-card')).toHaveCount(1)
      await expect(page.locator('.blog-card')).toContainText('Jetson Nano Setup Guide (Windows)')
    })
}
