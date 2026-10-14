import { expect, test } from '@playwright/test'

test.use({ colorScheme: 'dark' })

  test('compact mobile filters preserve labels and keyboard order', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/zh/blog')
    await expect(page.locator('.blog-card')).toHaveCount(9)
    const controls = page.locator('.blog-controls')
    const language = controls.locator('select').nth(0)
    const category = controls.locator('select').nth(1)
    const langBounds = await language.boundingBox()
    const categoryBounds = await category.boundingBox()
    expect(langBounds?.y).toBe(categoryBounds?.y)
    await page.screenshot({ path: testInfo.outputPath('blog-controls-compact.png') })
    await page.getByRole('searchbox').focus()
    for (const select of await controls.locator('select').all()) {
      await page.keyboard.press('Tab')
      await expect(select).toBeFocused()
    }
    await page.goto('/en/blog')
    await expect(page.locator('.blog-card')).toHaveCount(9)
    for (const select of await controls.locator('select').all()) {
      const fits = await select.evaluate(element => {
        const field = element as HTMLSelectElement
        const style = getComputedStyle(field)
        const context = document.createElement('canvas').getContext('2d')!
        context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        const available = field.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
        return context.measureText(field.selectedOptions[0].text).width <= available
      })
      expect(fits).toBe(true)
    }
    await page.setViewportSize({ width: 320, height: 844 })
    const languageNarrow = await language.boundingBox()
    const categoryNarrow = await category.boundingBox()
    expect(categoryNarrow!.y).toBeGreaterThan(languageNarrow!.y)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  })
