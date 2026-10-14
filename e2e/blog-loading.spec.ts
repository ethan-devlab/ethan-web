import { expect, test } from '@playwright/test'

test('loads no article bodies on the list and only the selected body on navigation', async ({ page }) => {
  const bodies: string[] = []
  page.on('request', request => {
    const name = new URL(request.url()).pathname.split('/').pop() ?? ''
    if (/^(hello-world|jetson-nano-setup-guide|windows-|django-|rasp-|phone-cam-|direct-eth-|lfsr-|draft-)/.test(name) && name.endsWith('.js')) bodies.push(name)
  })
  await page.goto('/zh/blog')
  await expect(page.locator('.blog-card')).toHaveCount(9)
  expect(bodies).toEqual([])
  await page.getByRole('link', { name: 'Hello World', exact: true }).click()
  await expect(page.locator('.blog-article h2').first()).toHaveText('關於這篇')
  expect(bodies).toHaveLength(1)
  expect(bodies[0]).toMatch(/^hello-world-/)
  await page.getByRole('link', { name: '返回部落格', exact: true }).click()
  await page.getByRole('link', { name: 'Hello World', exact: true }).click()
  await expect(page.locator('.blog-article h2').first()).toBeVisible()
  expect(bodies).toHaveLength(1)
})

test('keeps the loading line active until the selected article body arrives', async ({ page }) => {
  let release!: () => void
  const held = new Promise<void>(resolve => { release = resolve })
  await page.route(/\/assets\/hello-world-[^/]+\.js$/, async route => {
    await held
    await route.continue()
  })
  await page.goto('/zh/blog')
  await page.getByRole('link', { name: 'Hello World', exact: true }).click()
  await expect(page.locator('.header__loading')).toBeVisible()
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'true')
  release()
  await expect(page.locator('.blog-article h2').first()).toHaveText('關於這篇')
  await expect(page.locator('.header__loading')).toHaveCount(0)
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
})
