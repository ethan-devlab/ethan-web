import { expect, test } from '@playwright/test'
import { gzipSync } from 'node:zlib'

test('keeps article bodies out of the homepage and records its script payload', async ({ page }, testInfo) => {
  const scripts: Promise<{ file: string; bytes: number; gzipBytes: number }>[] = []
  page.on('response', response => {
    if (response.request().resourceType() !== 'script') return
    scripts.push(response.body().then(body => ({
      file: new URL(response.url()).pathname,
      bytes: body.length,
      gzipBytes: gzipSync(body).length,
    })))
  })
  await page.goto('/zh/')
  await expect(page.locator('.home-page')).toBeVisible()
  await page.waitForLoadState('networkidle')
  const payloads = await Promise.all(scripts)
  expect(payloads.some(({ file }) => /(?:hello-world|jetson-nano|django-production|draft-architecture)/.test(file))).toBe(false)
  const report = {
    scripts: payloads,
    totalBytes: payloads.reduce((sum, script) => sum + script.bytes, 0),
    totalGzipBytes: payloads.reduce((sum, script) => sum + script.gzipBytes, 0),
  }
  await testInfo.attach('homepage-script-payload', { body: JSON.stringify(report, null, 2), contentType: 'application/json' })
  console.log(JSON.stringify(report))
})
