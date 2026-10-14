import { expect, test } from '@playwright/test'

for (const segment of ['experience', 'resume', 'blog', 'contact']) {
  test(`an obsolete build recovers ${segment} without a manual refresh`, async ({ page, request }) => {
    const html = await (await request.get('/')).text()
    const entry = html.match(/src="([^"]+\.js)"/)![1]
    const staleEntry = '/assets/index-obsolete-review.js'
    const entrySource = await (await request.get(entry)).text()
    const chunks = { experience: 'ExperiencePage', resume: 'ResumePage', blog: 'BlogListPage', contact: 'ContactPage' }
    const chunk = entrySource.match(new RegExp(`${chunks[segment as keyof typeof chunks]}-[^"/]+\\.js`))![0]
    const obsoleteChunk = chunk.replace('.js', '-obsolete.js')
    const entryBody = entrySource.replaceAll(chunk, obsoleteChunk)
    let documents = 0
    await page.route('**/assets/index-obsolete-review.js', route => route.request().method() === 'HEAD'
      ? route.fulfill(route.request().headers().accept === 'text/javascript' ? { status: 404 } : { contentType: 'text/html', body: html })
      : route.fulfill({ contentType: 'text/javascript', body: entryBody }))
    await page.route(/\/en\/(?:experience|resume|blog|contact)?$/, route => {
      if (route.request().isNavigationRequest()) documents++
      return route.fulfill({ contentType: 'text/html', body: documents <= 1 && route.request().isNavigationRequest() ? html.replace(entry, staleEntry) : html })
    })
    await page.route(`**/assets/${obsoleteChunk}`, route => route.fulfill({ status: 404 }))
    await page.goto('/en/')
    await page.locator(`.header__nav a[href='/en/${segment}']`).click()
    const selectors = { experience: '.experience__timeline', resume: '.resume__document', blog: '.blog-controls', contact: '.contact-channel' }
    await expect(page.locator(selectors[segment as keyof typeof selectors]).first()).toBeVisible()
    await expect(page).toHaveURL(`/en/${segment}`)
    expect(documents).toBe(2)
  })
}

test('an inconsistent updated manifest cannot cause a reload loop', async ({ page, request }) => {
  const html = await (await request.get('/')).text()
  const entry = html.match(/src="([^"]+\.js)"/)![1]
  const body = await (await request.get(entry)).body()
  const staleEntry = '/assets/index-obsolete-review.js'
  let documents = 0
  await page.route('**/assets/index-obsolete-review.js', route => route.request().method() === 'HEAD'
    ? route.fulfill(route.request().headers().accept === 'text/javascript' ? { status: 404 } : { contentType: 'text/html', body: html })
    : route.fulfill({ contentType: 'text/javascript', body }))
  await page.route(/\/en\/(?:experience)?$/, route => {
    const navigation = route.request().isNavigationRequest()
    if (navigation) documents++
    return route.fulfill({ contentType: 'text/html', body: navigation ? html.replace(entry, staleEntry) : html })
  })
  await page.route(/\/assets\/ExperiencePage-[^/]+\.js$/, route => route.fulfill({ status: 404 }))
  await page.goto('/en/')
  await page.locator('.header__nav').getByRole('link', { name: 'Experience', exact: true }).click()
  await expect.poll(() => documents).toBe(2)
  await expect(page.locator('main').getByRole('link', { name: 'Back to Home', exact: true })).toBeVisible()
  await page.waitForTimeout(750)
  expect(documents).toBe(2)
})

for (const theme of ['dark', 'light']) {
  test(`the failed-content return link is centered and transparent in ${theme}`, async ({ page }, testInfo) => {
    await page.addInitScript(value => localStorage.setItem('ethan-theme', value), theme)
    await page.route(/\/assets\/ExperiencePage-[^/]+\.js$/, route => route.fulfill({ status: 404 }))
    let documents = 0
    page.on('request', request => { if (request.isNavigationRequest() && request.resourceType() === 'document') documents++ })
    await page.goto('/en/experience')
    const link = page.locator('main').getByRole('link', { name: 'Back to Home', exact: true })
    await expect(link).toBeVisible()
    await expect(link).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
    const offsets = await link.evaluate(element => {
      const button = element.getBoundingClientRect()
      const main = element.closest('main')!.getBoundingClientRect()
      return { x: button.x + button.width / 2 - main.x - main.width / 2, y: button.y + button.height / 2 - main.y - main.height / 2 }
    })
    expect(Math.abs(offsets.x)).toBeLessThan(1)
    expect(Math.abs(offsets.y)).toBeLessThan(1)
    await page.screenshot({ path: testInfo.outputPath(`page-load-error-${theme}.png`) })
    await link.hover()
    await expect(link).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
    await page.waitForTimeout(750)
    expect(documents).toBe(1)
    await page.setViewportSize({ width: 390, height: 844 })
    await expect(link).toBeVisible()
    expect(await link.evaluate(element => {
      const button = element.getBoundingClientRect()
      const main = element.closest('main')!.getBoundingClientRect()
      return Math.abs(button.y + button.height / 2 - main.y - main.height / 2)
    })).toBeLessThan(1)
  })
}
