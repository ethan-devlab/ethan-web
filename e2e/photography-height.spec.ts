import { expect, test } from '@playwright/test'

for (const [width, height] of [[320, 700], [667, 375], [1024, 480], [1920, 1080]]) {
  for (const theme of ['light', 'dark']) {
    test(`photo counter stays 16px below the complete image at ${width}x${height} in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.addInitScript(theme => localStorage.setItem('ethan-theme', theme), theme)
      await page.goto('/en/photography')
      await page.getByRole('button', { name: 'Open photo: Yuguang Island', exact: true }).click()
      const image = page.locator('.photography-modal__image')
      const counter = page.locator('.photography-modal__counter')
      for (let index = 0; index < 3; index += 1) {
        await expect(counter).toHaveText(`${index + 1} / 3`)
        await expect.poll(() => image.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
        const photoBounds = await image.boundingBox()
        const counterBounds = await counter.boundingBox()
        expect(counterBounds!.y - photoBounds!.y - photoBounds!.height).toBeCloseTo(16, 0)
        const ratio = await image.evaluate(image => (image as HTMLImageElement).naturalWidth / (image as HTMLImageElement).naturalHeight)
        expect(photoBounds!.width / photoBounds!.height).toBeCloseTo(ratio, 2)
        await expect(counter).toBeInViewport({ ratio: 1 })
        if (index < 2) await page.getByRole('button', { name: 'Next photo', exact: true }).click()
      }
    })
  }
}

for (const width of [1280, 1920, 2560]) {
  test(`desktop group controls follow the dialog at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1080 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/en/photography')
    await page.locator('.photography-card__open').first().click()
    const content = await page.locator('.photography-modal__content').boundingBox()
    const controls = page.locator('.photography-modal__group-controls--floating')
    const previous = await controls.getByRole('button', { name: 'Previous work' }).boundingBox()
    const next = await controls.getByRole('button', { name: 'Next work' }).boundingBox()
    expect(previous!.width).toBe(56)
    expect(next!.width).toBe(56)
    if (width >= 1376) {
      expect(content!.x - previous!.x - previous!.width).toBeCloseTo(24, 0)
      expect(next!.x - content!.x - content!.width).toBeCloseTo(24, 0)
    } else {
      expect(previous!.x).toBe(18)
      expect(next!.x + next!.width).toBe(width - 18)
    }
    const title = await page.locator('#photography-modal-title').textContent()
    await controls.getByRole('button', { name: 'Next work' }).click()
    await expect(page.locator('#photography-modal-title')).not.toHaveText(title!)
  })
}

for (const [width, height] of [[320, 700], [390, 844]]) {
  for (const reducedMotion of ['reduce', 'no-preference'] as const) {
    test(`portrait dialog keeps close accessible after scrolling at ${width}px with ${reducedMotion}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.emulateMedia({ reducedMotion })
      await page.goto('/en/photography')
      const opener = page.getByRole('button', { name: 'Open photo: Yuguang Island', exact: true })
      await opener.click()
      const content = page.locator('.photography-modal__content')
      await expect(content).toHaveCSS('opacity', '1')
      const close = page.locator('.photography-modal__close')
      const position = await close.boundingBox()
      await content.hover()
      await page.mouse.wheel(0, 2000)
      await expect.poll(() => content.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
      await expect(close).toBeInViewport({ ratio: 1 })
      const scrolledPosition = await close.boundingBox()
      expect(scrolledPosition!.x).toBeCloseTo(position!.x, 0)
      expect(scrolledPosition!.y).toBeCloseTo(position!.y, 0)
      await close.click()
      await expect(page.getByRole('dialog')).not.toBeVisible()
      await expect(opener).toBeFocused()
    })
  }
}

for (const [width, height] of [[1024, 480], [1280, 600]]) {
  for (const lang of ['zh', 'en']) {
    test(`desktop dialog keeps photos and controls visible at ${width}x${height} in ${lang}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`/${lang}/photography`)
      await page.locator('.photography-card__open').first().click()
      await expect(page.getByRole('dialog')).toBeVisible()
      const image = page.locator('.photography-modal__image')
      const bounds = await image.boundingBox()
      expect(bounds).not.toBeNull()
      expect(bounds!.y).toBeGreaterThanOrEqual(24)
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height - 24)
      const details = page.locator('.photography-modal__details')
      await details.hover()
      await page.mouse.wheel(0, 2000)
      await expect.poll(() => details.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
      expect(await page.locator('.photography-modal__content').evaluate(element => element.scrollTop)).toBe(0)
      const close = page.locator('.photography-modal__close')
      await expect(close).toBeInViewport({ ratio: 1 })
      await close.click()
      await expect(page.getByRole('dialog')).not.toBeVisible()
    })
  }
}

for (const [width, height] of [[667, 375], [844, 390]]) {
  for (const reducedMotion of ['reduce', 'no-preference'] as const) {
    test(`landscape dialog retains full photo and close control at ${width}x${height} with ${reducedMotion}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.emulateMedia({ reducedMotion })
      await page.goto('/en/photography')
      const opener = page.getByRole('button', { name: 'Open photo: Yuguang Island', exact: true })
      await opener.click()
      await expect(page.locator('.photography-modal__content')).toHaveCSS('opacity', '1')
      await expect(page.locator('.photography-modal__image')).toBeInViewport({ ratio: 1 })
      await expect(page.locator('.photography-modal__counter')).toBeInViewport({ ratio: 1 })
      await page.getByRole('button', { name: 'Next photo', exact: true }).click()
      await expect(page.locator('.photography-modal__counter')).toHaveText('2 / 3')
      const content = page.locator('.photography-modal__content')
      await content.hover()
      await page.mouse.wheel(0, 2000)
      await expect.poll(() => content.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
      const close = page.locator('.photography-modal__close')
      await expect(close).toBeInViewport({ ratio: 1 })
      await close.click()
      await expect(page.getByRole('dialog')).not.toBeVisible()
      await expect(opener).toBeFocused()
    })
  }
}
