import { expect, test } from '@playwright/test'

type HeroSample = { opacity: string; transform: string }

for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`hero respects ${reducedMotion} from its first render`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion })
    await page.addInitScript(() => {
      const state = window as unknown as { heroSamples: { opacity: string; transform: string }[] }
      state.heroSamples = []
      const observer = new MutationObserver(() => {
        document.querySelectorAll('.hero__name, .hero__avatarFrame, .hero__role').forEach(element => {
          const style = getComputedStyle(element)
          state.heroSamples.push({ opacity: style.opacity, transform: style.transform })
        })
      })
      observer.observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['style'] })
    })
    await page.goto('/zh/')
    await expect(page.locator('.hero__name')).toHaveCSS('opacity', '1')
    await expect(page.locator('.hero__avatarFrame')).toHaveCSS('opacity', '1')
    await expect(page.locator('.hero__role')).toHaveCSS('opacity', '1')
    const samples = await page.evaluate(() => (window as unknown as { heroSamples: HeroSample[] }).heroSamples)
    expect(samples.length).toBeGreaterThan(0)
    if (reducedMotion === 'reduce') {
      expect(samples.every(sample => sample.opacity === '1' && ['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(sample.transform))).toBe(true)
    } else {
      expect(samples.some(sample => Number(sample.opacity) < 1)).toBe(true)
    }
  })
}
