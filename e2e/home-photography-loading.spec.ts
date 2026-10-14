import { expect, test } from '@playwright/test'

test.use({ colorScheme: 'dark' })

for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 720 }]) {
  test(`loads photography near the viewport without changing section height at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    let requested = false
    let release!: () => void
    const held = new Promise<void>(resolve => { release = resolve })
    await page.route(/\/assets\/HomePhotographyCarousel-[^/]+\.js$/, async route => {
      requested = true
      await held
      await route.continue()
    })
    await page.goto('/en/')
    await expect(page.locator('.hero-section')).toBeVisible()
    const section = page.locator('.home-photography-deferred')
    await expect(section).toBeAttached()
    expect(requested).toBe(false)
    const before = await section.evaluate(element => element.getBoundingClientRect().height)
    await section.scrollIntoViewIfNeeded()
    await expect.poll(() => requested).toBe(true)
    await expect(section.locator('.hp-carousel__placeholder')).toBeVisible()
    await section.screenshot({ path: testInfo.outputPath('photography-waiting.png') })
    release()
    await expect(page.getByRole('region', { name: 'Photography', exact: true })).toBeVisible()
    await expect(section.locator('.hp-carousel__placeholder')).toHaveCount(0)
    const after = await section.evaluate(element => element.getBoundingClientRect().height)
    expect(Math.abs(after - before)).toBeLessThanOrEqual(2)
    await expect(section.locator('.hp-carousel__name')).toHaveText('Sunset Through Buildings')
    await expect(section.locator('.hp-carousel__image').first()).toHaveCSS('object-fit', 'contain')
    await section.screenshot({ path: testInfo.outputPath('photography-ready.png') })
  })
}

test('loads the carousel immediately when viewport observation is unavailable', async ({ page }) => {
  await page.addInitScript(() => { Reflect.deleteProperty(window, 'IntersectionObserver') })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/en/')
  const carousel = page.getByRole('region', { name: 'Photography', exact: true })
  await expect(carousel).toBeAttached()
  await carousel.getByRole('button', { name: 'Next photo', exact: true }).click()
  await expect(carousel.locator('.hp-carousel__name')).toHaveText('Tasik Cermin 2')
})
