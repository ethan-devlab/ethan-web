import { expect, test } from '@playwright/test'

test.use({ colorScheme: 'dark', reducedMotion: 'reduce' })

for (const width of [390, 1280]) {
  test(`portrait uses WebP with JPEG fallback at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    const requests: string[] = []
    page.on('request', request => {
      if (/\/me-[^/]+\.(jpg|webp)$/.test(request.url())) requests.push(request.url())
    })
      await page.goto('/zh/')
      const image = page.getByRole('img', { name: 'Ethan Chan portrait', exact: true })
      await expect(image).toBeVisible()
      await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBe(1745)
      await page.evaluate(() => document.fonts.ready)
      await expect.poll(() => image.evaluate(element => getComputedStyle(element.closest('.hero__avatarFrame')!).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/)
      const result = await image.evaluate(element => {
        const image = element as HTMLImageElement
        const style = getComputedStyle(image)
        const frameElement = image.closest('.hero__avatarFrame')!
        const frame = getComputedStyle(frameElement)
        return {
          width: image.getBoundingClientRect().width,
          height: image.getBoundingClientRect().height,
          frameWidth: frameElement.getBoundingClientRect().width,
          frameHeight: frameElement.getBoundingClientRect().height,
          currentSrc: image.currentSrc,
          naturalHeight: image.naturalHeight,
          objectFit: style.objectFit,
          objectPosition: style.objectPosition,
          borderRadius: style.borderRadius,
          shadow: frame.boxShadow,
        }
      })
      expect(result.shadow).not.toBe('none')
      expect(result.currentSrc).toMatch(/\.webp$/)
      expect(result.naturalHeight).toBe(1745)
      expect(result.width).toBe(result.frameWidth)
      expect(result.height).toBe(result.frameHeight)
      await expect(image).toHaveAttribute('src', /\.jpg$/)
      await expect(page.locator('.hero__avatarFrame source')).toHaveAttribute('type', 'image/webp')
      expect(requests).toHaveLength(1)
      expect(requests[0]).toMatch(/\.webp$/)
  })
}

test('uses the original JPEG when the picture source type is unsupported', async ({ page }) => {
  const requests: string[] = []
  page.on('request', request => {
    if (/\/me-[^/]+\.(jpg|webp)$/.test(request.url())) requests.push(request.url())
  })
  await page.route(/\/assets\/index-[^/]+\.js$/, async route => {
    const response = await route.fetch()
    const body = (await response.text()).replaceAll('image/webp', 'image/x-review-unsupported')
    await route.fulfill({ response, body })
  })
  await page.goto('/zh/')
  const image = page.getByRole('img', { name: 'Ethan Chan portrait', exact: true })
  await expect(page.locator('.hero__avatarFrame source')).toHaveAttribute('type', 'image/x-review-unsupported')
  await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBe(1745)
  expect(await image.evaluate(element => (element as HTMLImageElement).currentSrc)).toMatch(/\.jpg$/)
  expect(requests).toHaveLength(1)
  expect(requests[0]).toMatch(/\.jpg$/)
})
