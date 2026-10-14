import { expect, test } from '@playwright/test'

for (const lang of ['zh', 'en']) {
  for (const theme of ['light', 'dark']) {
    test(`short-window menu scrolls to its actions in ${lang} with ${theme} theme`, async ({ page }) => {
      await page.setViewportSize({ width: 756, height: 383 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.addInitScript((theme) => localStorage.setItem('ethan-theme', theme), theme)
      await page.goto(`/${lang}/blog`)
      const toggle = page.getByRole('button', { name: 'Menu', exact: true })
      const panel = page.locator('#navigation-panel')
      await toggle.click()
      const bounds = await panel.boundingBox()
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(367)
      expect(await panel.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true)
      await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
      await page.mouse.wheel(0, 800)
      await expect.poll(() => panel.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
      expect(await page.evaluate(() => window.scrollY)).toBe(0)
      const themeToggle = panel.getByRole('button', { name: 'Toggle theme' })
      const actionBounds = await themeToggle.boundingBox()
      expect(actionBounds!.y).toBeGreaterThanOrEqual(bounds!.y)
      expect(actionBounds!.y + actionBounds!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height)
      await themeToggle.click()
      await expect(toggle).toHaveAttribute('aria-expanded', 'true')
      await page.keyboard.press('Escape')
      await expect(toggle).toBeFocused()
      await toggle.click()
      await themeToggle.focus()
      const focusedBounds = await themeToggle.boundingBox()
      expect(focusedBounds!.y + focusedBounds!.height).toBeLessThanOrEqual(367)
      await page.keyboard.press('Escape')
      await expect(toggle).toBeFocused()
    })
  }
}

test('mobile menu follows live motion preferences and opens statically under reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/en/experience')
  const toggle = page.getByRole('button', { name: 'Menu', exact: true })
  const panel = page.locator('#navigation-panel')
  const samples = await page.evaluate(async () => {
    const panel = document.querySelector('#navigation-panel')!
    document.querySelector<HTMLButtonElement>('#navigation-menu-button')!.click()
    const samples: { opacity: string; transform: string }[] = []
    for (let frame = 0; frame < 12; frame++) {
      await new Promise(requestAnimationFrame)
      const style = getComputedStyle(panel)
      samples.push({ opacity: style.opacity, transform: style.transform })
    }
    return samples
  })
  expect(samples.every(sample => sample.opacity === '1' && sample.transform === 'none')).toBe(true)
  await expect(panel).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(panel).toBeHidden()
  await expect(toggle).toBeFocused()

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(panel).toHaveCSS('opacity', '0.98')
  await toggle.click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(panel).toBeVisible()
  await expect(panel).toHaveCSS('opacity', '1')
  await expect(panel).toHaveCSS('transform', 'none')
  await page.mouse.click(200, 700)
  await expect(panel).toBeHidden()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

test('keeps icon menu controls inside the panel and dismisses outside clicks', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/zh/experience')

  const toggle = page.getByRole('button', { name: 'Menu', exact: true })
  const panel = page.locator('#navigation-panel')
  await toggle.locator('svg').click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(panel).toBeVisible()
  await expect(panel.locator('.header__link')).toHaveCount(6)

  const themeToggle = panel.getByRole('button', { name: 'Toggle theme' })
  await themeToggle.locator('svg').click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')

  const panelBounds = await panel.boundingBox()
  expect(panelBounds).not.toBeNull()
  expect(panelBounds!.y + panelBounds!.height).toBeLessThan(700)
  await page.mouse.click(200, 700)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(panel).toBeHidden()
  expect(await panel.evaluate((element) => element.contains(document.activeElement))).toBe(false)

  await toggle.locator('svg').click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await toggle.locator('svg').click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')

  await toggle.click()
  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toBeFocused()
})
