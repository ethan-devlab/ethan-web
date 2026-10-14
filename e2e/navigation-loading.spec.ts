import { expect, test } from '@playwright/test'

for (const intent of ['hover', 'focus'] as const) {
  test(`preloads navigation code on ${intent} without opening the page or loading photos`, async ({ page }) => {
    await page.setViewportSize({ width: 1456, height: 900 })
    await page.goto('/en/contact')
    await expect(page.getByRole('heading', { name: 'Contact', exact: true })).toBeVisible()
    const requested: string[] = []
    page.on('request', request => requested.push(request.url()))
    const request = page.waitForRequest(/\/assets\/PhotographyPage-[^/]+\.js$/)
    const link = page.locator('.header__nav').getByRole('link', { name: 'Photography', exact: true })
    if (intent === 'hover') await link.hover()
    else await link.focus()
    await request
    await expect(page).toHaveURL(/\/en\/contact$/)
    await expect(page.locator('.photography-grid')).toHaveCount(0)
    expect(requested.some(url => /\.(webp|jpe?g|png|pdf)(\?|$)/i.test(url))).toBe(false)
  })
}

for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`shows a loading line with ${reducedMotion} until the page code is ready`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion, colorScheme: 'dark' })
    let release = () => undefined as void
    const held = new Promise<void>(resolve => { release = resolve })
    await page.route(/\/assets\/PhotographyPage-[^/]+\.js$/, async route => {
      await held
      await route.continue()
    })
    try {
      await page.goto('/en/contact')
      await expect(page.getByRole('heading', { name: 'Contact', exact: true })).toBeVisible()
      await page.locator('.header__nav').getByRole('link', { name: 'Photography', exact: true }).click()
      await expect(page.locator('main')).toHaveAttribute('aria-busy', 'true')
      const line = page.locator('.header__loading')
      await expect(line).toBeVisible()
      expect(await line.evaluate(element => {
        const header = element.closest('header')
        return header && Math.abs(header.getBoundingClientRect().bottom - element.getBoundingClientRect().bottom) < 1
      })).toBe(true)
      await expect(page.getByRole('heading', { name: 'Contact', exact: true })).toBeVisible()
      await expect(line.locator('span')).toHaveCSS('animation-name', reducedMotion === 'reduce' ? 'none' : 'page-loading-line')
      await page.screenshot({ path: testInfo.outputPath(`loading-${reducedMotion}.png`) })
      release()
      await expect(page.getByRole('heading', { name: 'Photography', exact: true })).toBeVisible()
      await expect(line).toHaveCount(0)
      await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
    } finally {
      release()
    }
  })
}

test('reserves the content area when a direct page visit is still loading', async ({ page }) => {
  let release = () => undefined as void
  const held = new Promise<void>(resolve => { release = resolve })
  await page.route(/\/assets\/PhotographyPage-[^/]+\.js$/, async route => {
    await held
    await route.continue()
  })
  try {
    await page.goto('/en/photography', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('main')).toHaveAttribute('aria-busy', 'true')
    await expect(page.locator('.header__loading')).toBeVisible()
    expect(await page.locator('.page-loading-space').evaluate(element => element.getBoundingClientRect().height >= innerHeight - 64)).toBe(true)
    release()
    await expect(page.getByRole('heading', { name: 'Photography', exact: true })).toBeVisible()
    await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
  } finally {
    release()
  }
})

test('tracks homepage CTA loading and clears a superseded navigation', async ({ page }) => {
  let release = () => undefined as void
  const held = new Promise<void>(resolve => { release = resolve })
  await page.route(/\/assets\/ExperiencePage-[^/]+\.js$/, async route => {
    await held
    await route.continue()
  })
  try {
    await page.goto('/en/')
    await page.getByRole('link', { name: 'View Experience', exact: true }).click()
    await expect(page.locator('main')).toHaveAttribute('aria-busy', 'true')
    await expect(page.locator('.header__loading')).toBeVisible()
    await page.getByRole('link', { name: 'Ethan Chan 曾嘉誠', exact: true }).click()
    await expect(page).toHaveURL(/\/en\/$/)
    await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
    release()
    await expect(page.getByRole('heading', { name: 'Professional Summary', exact: true })).toHaveCount(0)
  } finally {
    release()
  }
})

test('keeps language switching and history navigation free of stale loading state', async ({ page }) => {
  await page.goto('/en/contact')
  await expect(page.getByRole('heading', { name: 'Contact', exact: true })).toBeVisible()
  await page.locator('.language-switcher').click()
  await expect(page).toHaveURL(/\/zh\/contact$/)
  await expect(page.getByRole('heading', { name: '聯絡', exact: true })).toBeVisible()
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Contact', exact: true })).toBeVisible()
  await expect(page.locator('.header__loading')).toHaveCount(0)
})
