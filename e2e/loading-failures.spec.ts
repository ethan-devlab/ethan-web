import { expect, test } from '@playwright/test'

test('failed homepage carousel code preserves the original photo placeholder and other sections', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route(/\/assets\/HomePhotographyCarousel-[^/]+\.js$/, route => route.abort('failed'))
  await page.route(/\/photography\/webp\/fxn%202026-03-18%20175048280436F8A06D\.JPG\.webp$/, route => route.abort('failed'))
  await page.goto('/en/')
  await page.locator('.home-photography-deferred').scrollIntoViewIfNeeded()
  await expect(page.locator('.hp-carousel__placeholder')).toBeVisible()
  await expect(page.locator('.hp-carousel__name')).toHaveText('Sunset Through Buildings')
  await expect(page.locator('.hp-carousel__button--disabled')).toHaveCount(2)
  await expect(page.locator('.hp-carousel').getByRole('button')).toHaveCount(0)
  const image = page.locator('.hp-carousel__image')
  await expect(image).toHaveAttribute('src', '/photography/fxn 2026-03-18 175048280436F8A06D.JPG')
  await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await expect(page.locator('.hero__name')).toBeVisible()
  await expect(page.locator('.skill-accordion details')).toHaveCount(8)
  await expect(page.locator('.header')).toBeVisible()
  await expect(page.locator('.footer')).toBeVisible()
})

for (const lang of ['zh', 'en']) {
  for (const navigation of ['direct', 'link']) {
    test(`failed page code retains the shared layout in ${lang} through ${navigation}`, async ({ page }) => {
      await page.route(/\/assets\/ExperiencePage-[^/]+\.js$/, route => route.abort('failed'))
      if (navigation === 'direct') await page.goto(`/${lang}/experience`)
      else {
        await page.goto(`/${lang}/`)
        await page.locator('.header__nav').getByRole('link', { name: lang === 'zh' ? '經歷' : 'Experience', exact: true }).click()
      }
      const back = page.locator('main').getByRole('link', { name: lang === 'zh' ? '返回首頁' : 'Back to Home', exact: true })
      await expect(back).toBeVisible()
      await expect(page.locator('.header')).toBeVisible()
      await expect(page.locator('.footer')).toBeVisible()
      await expect(page.locator('.header__loading')).toHaveCount(0)
      await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
      await back.click()
      await expect(page.locator('.hero__name')).toBeVisible()
      await page.locator('.header__nav').getByRole('link', { name: lang === 'zh' ? '聯絡' : 'Contact', exact: true }).click()
      await expect(page.locator('.contact-channel')).toHaveCount(4)
    })
  }
}

test('failed article body retains its header and returns to the filtered list', async ({ page }) => {
  await page.route(/\/assets\/hello-world-[^/]+\.js$/, route => route.abort('failed'))
  await page.goto('/zh/blog')
  await page.getByRole('searchbox').fill('Hello World')
  await page.getByRole('link', { name: 'Hello World', exact: true }).click()
  await expect(page.locator('.blog-article h1')).toHaveText('Hello World')
  await expect(page.locator('.header__loading')).toHaveCount(0)
  await page.getByRole('link', { name: '返回部落格', exact: true }).click()
  await expect(page.getByRole('searchbox')).toHaveValue('Hello World')
  await expect(page.locator('.header')).toBeVisible()
})

test('gallery WebP failure requests its original once and retains modal controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const originals: string[] = []
  page.on('request', request => { if (new URL(request.url()).pathname === '/photography/DSC_0998_E.jpg') originals.push(request.url()) })
  await page.route(/\/photography\/webp\/DSC_0998_E\.jpg\.webp$/, route => route.abort('failed'))
  await page.goto('/en/photography')
  const cardImage = page.locator('.photography-card__image').filter({ visible: true }).nth(2)
  await expect(cardImage).toHaveAttribute('src', '/photography/DSC_0998_E.jpg')
  const opener = page.getByRole('button', { name: 'Open photo: Yuguang Island', exact: true })
  await opener.click()
  const image = page.locator('.photography-modal__image')
  await expect(image).toHaveAttribute('src', '/photography/DSC_0998_E.jpg')
  await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  expect(originals.length).toBeLessThanOrEqual(2)
  await page.getByRole('button', { name: 'Next photo', exact: true }).click()
  await expect(image).toHaveAttribute('src', /DSC_1007_E\.jpg\.webp$/)
  await page.keyboard.press('Escape')
  await expect(opener).toBeFocused()
})

test('failure of both photography formats does not start a retry loop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const originals: string[] = []
  page.on('request', request => { if (new URL(request.url()).pathname === '/photography/DSC_0998_E.jpg') originals.push(request.url()) })
  await page.route(/\/photography\/(?:webp\/)?DSC_0998_E\.jpg(?:\.webp)?$/, route => route.abort('failed'))
  await page.goto('/en/photography')
  await page.getByRole('button', { name: 'Open photo: Yuguang Island', exact: true }).click()
  await expect(page.locator('.photography-modal__image')).toHaveAttribute('src', '/photography/DSC_0998_E.jpg')
  await expect.poll(() => page.locator('.photography-modal__image').evaluate(element => (element as HTMLImageElement).complete)).toBe(true)
  await expect.poll(() => originals.length).toBeGreaterThan(0)
  const attempts = originals.length
  await page.getByRole('button', { name: 'Next work', exact: true }).filter({ visible: true }).click()
  await page.keyboard.press('Escape')
  expect(originals.length).toBe(attempts)
  expect(attempts).toBeLessThanOrEqual(2)
})

test('successful photography loads do not request original files', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const originals: string[] = []
  page.on('request', request => {
    const path = new URL(request.url()).pathname
    if (path.startsWith('/photography/') && !path.endsWith('.webp')) originals.push(path)
  })
  await page.goto('/en/photography')
  await page.getByRole('button', { name: 'Open photo: Yuguang Island', exact: true }).click()
  await page.locator('.photography-modal__image').evaluate(element => (element as HTMLImageElement).decode())
  await page.goto('/en/')
  await page.locator('.hp-carousel').scrollIntoViewIfNeeded()
  await page.locator('.hp-carousel__image').first().evaluate(element => (element as HTMLImageElement).decode())
  expect(originals).toEqual([])
})

test('homepage photography falls back to its original without changing its caption', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route(/\/photography\/webp\/fxn%202026-03-18%20175048280436F8A06D\.JPG\.webp$/, route => route.abort('failed'))
  await page.goto('/en/')
  await page.locator('.hp-carousel').scrollIntoViewIfNeeded()
  await expect(page.locator('.hp-carousel__name')).toHaveText('Sunset Through Buildings')
  const image = page.locator('.hp-carousel__image').first()
  await expect(image).toHaveAttribute('src', '/photography/fxn 2026-03-18 175048280436F8A06D.JPG')
  await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
})
