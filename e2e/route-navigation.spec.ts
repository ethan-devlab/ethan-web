import { expect, test } from '@playwright/test'

test('moves keyboard focus into a new page only after its code arrives', async ({ page, browserName }) => {
  let release!: () => void
  const held = new Promise<void>(resolve => { release = resolve })
  await page.route(/\/assets\/PhotographyPage-[^/]+\.js$/, async route => {
    await held
    await route.continue()
  })
  await page.goto('/en/contact')
  const link = page.getByRole('link', { name: 'Photography', exact: true })
  await link.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.header__loading')).toBeVisible()
  await expect(link).toBeFocused()
  release()
  const main = page.locator('main')
  await expect(main.getByRole('heading', { name: 'Photography', exact: true })).toBeVisible()
  await expect(main).toBeFocused()
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab')
  await expect(main.getByRole('button').first()).toBeFocused()
})

test('starts link navigation at the top without forcing pointer focus and restores history positions', async ({ page }) => {
  await page.addInitScript(() => {
    const focus = HTMLElement.prototype.focus
    const calls: string[] = []
    Object.defineProperty(window, '__reviewFocusCalls', { value: calls })
    HTMLElement.prototype.focus = function(options) {
      calls.push(this.tagName)
      return focus.call(this, options)
    }
  })
  await page.goto('/zh/blog/hello-world')
  const backLink = page.getByRole('link', { name: '返回部落格', exact: true })
  await backLink.scrollIntoViewIfNeeded()
  const articleScroll = await page.evaluate(() => window.scrollY)
  expect(articleScroll).toBeGreaterThan(500)
  await backLink.click()
  await expect(page.getByRole('searchbox')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  expect(await page.evaluate(() => (window as unknown as { __reviewFocusCalls: string[] }).__reviewFocusCalls)).not.toContain('MAIN')
  await page.goBack()
  await expect(page.locator('.blog-article')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(articleScroll, 0)
  await page.goForward()
  await expect(page.getByRole('searchbox')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})
