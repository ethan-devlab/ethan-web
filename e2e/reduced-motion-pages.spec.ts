import { expect, test } from '@playwright/test'

type MotionReview = { samples: { opacity: string; stationary: boolean }[]; done: boolean }

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

for (const [route, selector] of [
  ['experience', '.experience-review__entry'],
  ['photography', '.photography-card'],
] as const) {
  test(`${route} content is visible and stationary from its first frame`, async ({ page }) => {
    await page.addInitScript((selector) => {
      const review: MotionReview = { samples: [], done: false }
      Object.assign(window, { motionReview: review })
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector)
        if (!element) return
        observer.disconnect()
        const start = performance.now()
        const sample = () => {
          const style = getComputedStyle(element)
          review.samples.push({
            opacity: style.opacity,
            stationary: style.transform === 'none' || new DOMMatrixReadOnly(style.transform).isIdentity,
          })
          if (performance.now() - start < 200) requestAnimationFrame(sample)
          else review.done = true
        }
        sample()
      })
      observer.observe(document, { childList: true, subtree: true })
    }, selector)

    await page.goto(`/en/${route}`)
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)
    await page.waitForFunction(() => (window as typeof window & { motionReview: MotionReview }).motionReview.done)
    const samples = await page.evaluate(() => (window as typeof window & { motionReview: MotionReview }).motionReview.samples)
    expect(samples.length).toBeGreaterThan(1)
    for (const sample of samples) {
      expect(sample.opacity).toBe('1')
      expect(sample.stationary).toBe(true)
    }
  })
}

test('reduced-motion photography retains manual controls and focus return', async ({ page }) => {
  await page.goto('/en/photography')
  const opener = page.getByRole('button', { name: 'Open photo: Yuguang Island', exact: true })
  await opener.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.locator('.photography-modal__content')).toHaveCSS('opacity', '1')
  await expect(page.locator('.photography-modal__image')).toHaveCSS('filter', 'none')
  await page.getByRole('button', { name: 'Next photo', exact: true }).click()
  await expect(page.locator('.photography-modal__counter')).toHaveText('2 / 3')
  await expect(page.locator('.photography-modal__image')).toHaveCSS('opacity', '1')
  await page.locator('.photography-modal__group-controls--floating').getByRole('button', { name: 'Next work' }).click()
  await expect(page.locator('#photography-modal-title')).not.toHaveText('Yuguang Island')
  await expect(page.locator('.photography-modal__details-inner')).toHaveCSS('opacity', '1')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(opener).toBeFocused()
})

test('system preference changes stop active motion without reloading or closing the dialog', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/en/photography')
  const card = page.locator('.photography-card').first()
  await expect(card).toHaveCSS('opacity', '1')
  await card.hover()
  await expect.poll(() => card.evaluate(element => {
    const transform = getComputedStyle(element).transform
    return transform !== 'none' && !new DOMMatrixReadOnly(transform).isIdentity
  })).toBe(true)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(card).toHaveCSS('transform', 'none')
  const opener = page.getByRole('button', { name: 'Open photo: Yuguang Island', exact: true })
  await opener.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.getByRole('button', { name: 'Next photo', exact: true }).click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(dialog).toBeVisible()
  await expect(page.locator('.photography-modal__content')).toHaveCSS('transform', 'none')
  await expect(page.locator('.photography-modal__image')).toHaveCount(1)
  await expect(page.locator('.photography-modal__image')).toHaveCSS('opacity', '1')
  await expect(page.locator('.photography-modal__image')).toHaveCSS('filter', 'none')
  await expect(page.locator('.photography-modal__counter')).toHaveText('2 / 3')
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(opener).toBeFocused()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.mouse.move(0, 0)
  await card.hover()
  await expect.poll(() => card.evaluate(element => {
    const transform = getComputedStyle(element).transform
    return transform !== 'none' && !new DOMMatrixReadOnly(transform).isIdentity
  })).toBe(true)
})

for (const [route, selector] of [
  ['', '.hero__name, .hero__avatarFrame, .hero__role'],
  ['experience', '.experience-review__entry'],
] as const) {
  test(`${route || 'hero'} stops entrance motion when the system preference changes`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto(`/en/${route}`)
    await page.locator(selector).first().waitFor({ state: 'attached' })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const elements = page.locator(selector)
    expect(await elements.count()).toBeGreaterThan(0)
    for (const element of await elements.all()) {
      await expect(element).toHaveCSS('opacity', '1')
      await expect(element).toHaveCSS('transform', 'none')
    }
  })
}
