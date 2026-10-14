import { expect, test } from '@playwright/test'

test('contour buttons keep bilingual labels and reduced-motion behavior', async ({ page, browserName }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const language of ['zh', 'en']) {
    await page.goto(`/${language}/`)
    await expect(page.locator('.app-shell')).toHaveAttribute('data-button-system', 'contour')
    const actions = page.locator('.closing-cta__actions')
    await expect(actions.getByRole('link', { name: language === 'zh' ? '查看經歷' : 'View Experience', exact: true })).toHaveCount(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const primary = actions.locator('.btn--primary')
    expect(await primary.evaluate((element) => {
      const label = element.querySelector('.btn__label-original')
      if (!label) return false
      const range = document.createRange()
      range.selectNodeContents(label)
      const text = range.getBoundingClientRect()
      const button = element.getBoundingClientRect()
      return text.left >= button.left && text.right <= button.right && text.top >= button.top && text.bottom <= button.bottom
    })).toBe(true)
  }
  const secondary = page.locator('.closing-cta__actions .btn--secondary')
  await secondary.hover()
  await expect.poll(() => secondary.evaluate((element) => getComputedStyle(element, '::before').clipPath)).toContain('50%')
  await page.screenshot({ path: testInfo.outputPath('contour-hover.png') })
  await page.mouse.down()
  await expect(secondary).toHaveCSS('transform', 'none')
  await page.mouse.move(0, 0)
  await page.mouse.up()
  await page.locator('.closing-cta__actions .btn--primary').focus()
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab')
  await expect(secondary).toBeFocused()
  await expect(secondary).toHaveCSS('clip-path', 'none')
  await expect(secondary).toHaveCSS('outline-style', 'solid')
  for (const pseudo of ['::before', '::after']) {
    expect(await secondary.evaluate((element, selector) => getComputedStyle(element, selector).opacity, pseudo)).toBe('0')
  }
  await page.screenshot({ path: testInfo.outputPath('contour-focus.png') })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await secondary.hover()
  await expect(secondary).toHaveCSS('transform', 'none')
  expect(await secondary.evaluate((element) => getComputedStyle(element, '::before').transitionDuration)).toBe('0s')
})

test('disabled English resume controls do not react to hover', async ({ page }) => {
  await page.goto('/zh/resume')
  const buttons = page.locator('.resume__actions button:disabled')
  await expect(buttons).toHaveCount(2)
  for (const button of await buttons.all()) {
    const before = await button.evaluate((element) => {
      const style = getComputedStyle(element)
      const label = element.querySelector('.btn__label-original')
      return [style.backgroundColor, style.borderColor, style.color, style.boxShadow, getComputedStyle(element, '::before').clipPath, label ? getComputedStyle(label).transform : null]
    })
    await button.hover()
    await expect(button).toHaveCSS('transform', 'none')
    expect(await button.evaluate((element) => {
      const style = getComputedStyle(element)
      const label = element.querySelector('.btn__label-original')
      return [style.backgroundColor, style.borderColor, style.color, style.boxShadow, getComputedStyle(element, '::before').clipPath, label ? getComputedStyle(label).transform : null]
    })).toEqual(before)
  }
})
