import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const probe = { draws: 0, messages: 0 }
    Object.defineProperty(window, '__galleryProbe', { value: probe })
    const drawElements = WebGL2RenderingContext.prototype.drawElements
    WebGL2RenderingContext.prototype.drawElements = function (mode, count, type, offset) {
      probe.draws++
      return drawElements.call(this, mode, count, type, offset)
    }
    const OriginalWorker = Worker
    window.Worker = class extends OriginalWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        super(url, options)
        this.addEventListener('message', () => probe.messages++)
      }
    }
  })
})

for (const width of [390, 1440]) {
  for (const reducedMotion of ['reduce', 'no-preference'] as const) {
    test(`lights survive repeated theme changes at ${width}px with ${reducedMotion}`, async ({ page }) => {
      test.setTimeout(60000)
      await page.setViewportSize({ width, height: 1000 })
      await page.emulateMedia({ reducedMotion })
      await page.goto('/en/photography')
      const readProbe = () => page.evaluate(() => (window as unknown as { __galleryProbe: { draws: number; messages: number } }).__galleryProbe)
      await expect.poll(async () => (await readProbe()).draws).toBeGreaterThan(0)
      await expect.poll(async () => (await readProbe()).messages).toBeGreaterThan(0)
      if (width === 390) await page.getByRole('button', { name: 'Menu', exact: true }).click()
      const initialTheme = await page.locator('html').getAttribute('data-theme')
      for (let index = 0; index < 6; index++) {
        const before = await readProbe()
        const previousCanvas = await page.locator('.gallery-lights__scene').elementHandle()
        await page.locator('.header').getByRole('button', { name: 'Toggle theme', exact: true }).click()
        await expect(page.locator('html')).toHaveAttribute('data-theme', index % 2 === 0 ? (initialTheme === 'dark' ? 'light' : 'dark') : initialTheme!)
        await expect.poll(async () => (await readProbe()).draws).toBeGreaterThan(before.draws)
        await expect.poll(async () => (await readProbe()).messages).toBeGreaterThan(before.messages)
        await expect(page.locator('.gallery-lights')).toBeVisible()
        expect(await page.locator('.gallery-lights__scene').evaluate(element => (element as HTMLCanvasElement).getContext('webgl2')!.isContextLost())).toBe(false)
        await expect.poll(() => previousCanvas!.evaluate(element => (element as HTMLCanvasElement).getContext('webgl2')!.isContextLost())).toBe(true)
        await expect(page.locator('.photography-card')).toHaveCount(14)
      }
      const beforeRapid = await readProbe()
      for (let index = 0; index < 4; index++) await page.locator('.header').getByRole('button', { name: 'Toggle theme', exact: true }).click()
      await expect.poll(async () => (await readProbe()).messages).toBeGreaterThan(beforeRapid.messages)
      await expect.poll(async () => (await readProbe()).draws).toBeGreaterThan(beforeRapid.draws)
      await expect(page.locator('.gallery-lights')).toBeVisible()
      expect(await page.locator('.gallery-lights__scene').evaluate(element => (element as HTMLCanvasElement).getContext('webgl2')!.isContextLost())).toBe(false)
    })
  }
}

test('lights stop for reduced motion and outside the viewport, then release resources on navigation', async ({ page }) => {
  const readProbe = () => page.evaluate(() => (window as unknown as { __galleryProbe: { draws: number; messages: number } }).__galleryProbe)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/en/photography')
  await expect.poll(async () => (await readProbe()).messages).toBeGreaterThan(0)
  await expect.poll(async () => (await readProbe()).draws).toBeGreaterThan(0)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForTimeout(500)
  const staticProbe = await readProbe()
  await page.waitForTimeout(400)
  expect(await readProbe()).toEqual(staticProbe)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect.poll(async () => (await readProbe()).draws).toBeGreaterThan(staticProbe.draws)
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForTimeout(500)
  const hiddenProbe = await readProbe()
  await page.waitForTimeout(400)
  expect(await readProbe()).toEqual(hiddenProbe)
  await page.evaluate(() => scrollTo(0, 0))
  await expect.poll(async () => (await readProbe()).draws).toBeGreaterThan(hiddenProbe.draws)
  const canvas = await page.locator('.gallery-lights__scene').elementHandle()
  await page.locator('.header').getByRole('link', { name: 'Contact', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/contact$/)
  await expect.poll(() => canvas!.evaluate(element => (element as HTMLCanvasElement).getContext('webgl2')!.isContextLost())).toBe(true)
})

for (const failure of ['webgl', 'scene', 'worker', 'context'] as const) {
  test(`${failure} failure removes decoration and preserves photography`, async ({ page }) => {
    if (failure === 'webgl') await page.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof getContext>) {
        if (args[0] === 'webgl2') return null
        return getContext.apply(this, args)
      } as typeof getContext
    })
    if (failure === 'scene') await page.route('**/assets/galleryThreeScene-*.js', route => route.abort())
    if (failure === 'worker') await page.route('**/assets/galleryIllumination.worker-*.js', route => route.abort())
    await page.goto('/en/photography')
    if (failure === 'context') {
      await expect.poll(() => page.evaluate(() => (window as unknown as { __galleryProbe: { messages: number } }).__galleryProbe.messages)).toBeGreaterThan(0)
      await page.locator('.gallery-lights__scene').evaluate(element => (element as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext())
    }
    await expect(page.locator('.gallery-lights')).toHaveCount(0)
    await expect(page.locator('.photography-card')).toHaveCount(14)
    await page.getByRole('button', { name: 'Open photo: Yuguang Island', exact: true }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
}

test('home does not request gallery rendering code or workers', async ({ page }) => {
  const requests: string[] = []
  page.on('request', request => requests.push(request.url()))
  await page.goto('/en/')
  await page.locator('.header').getByRole('link', { name: 'Photography', exact: true }).hover()
  await page.waitForTimeout(500)
  expect(requests.filter(url => /galleryThreeScene-|galleryIllumination\.worker-/.test(url))).toEqual([])
})

test('opening the lightbox pauses background rendering and closing it resumes updates', async ({ page }) => {
  const readProbe = () => page.evaluate(() => (window as unknown as { __galleryProbe: { draws: number; messages: number } }).__galleryProbe)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/en/photography')
  await expect.poll(async () => (await readProbe()).messages).toBeGreaterThan(0)
  const opener = page.getByRole('button', { name: 'Open photo: Yuguang Island', exact: true })
  await opener.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.waitForTimeout(500)
  const paused = await readProbe()
  await page.waitForTimeout(500)
  expect(await readProbe()).toEqual(paused)
  await page.getByRole('button', { name: 'Next photo', exact: true }).click()
  await expect(page.locator('.photography-modal__counter')).toHaveText('2 / 3')
  await page.keyboard.press('Escape')
  await expect(opener).toBeFocused()
  await page.evaluate(() => scrollTo(0, 0))
  await expect.poll(async () => (await readProbe()).messages).toBeGreaterThan(paused.messages)
  await expect.poll(async () => (await readProbe()).draws).toBeGreaterThan(paused.draws)
})
