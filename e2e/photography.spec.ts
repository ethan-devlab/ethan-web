import { expect, test } from '@playwright/test'

test.describe('photography page', () => {
  test('renders the English gallery and carousel modal', async ({ page }) => {
    await page.goto('/en/photography')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('link', { name: 'Photography' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Photography' })).toBeVisible()

    const cards = page.locator('.photography-card')
    await expect(cards).toHaveCount(12)
    await expect(cards.first()).toContainText('Taipei After Rain')
    await expect(cards.first()).toContainText('2024-03-16')
    await expect(cards.first()).toContainText('25.033964, 121.564468')

    const imageSources = await page.locator('.photography-card__image').evaluateAll((images) =>
      images.map((image) => image.getAttribute('src')),
    )

    expect(imageSources).toHaveLength(12)
    expect(imageSources.every((src) => Boolean(src))).toBe(true)
    expect(imageSources.some((src) => src?.includes('picsum.photos'))).toBe(true)

    const firstCardImage = cards.first().locator('.photography-card__image')
    const initialPreviewSrc = await firstCardImage.getAttribute('src')

    await cards.first().hover()
    await page.getByRole('button', { name: 'Next preview photo: Taipei After Rain' }).click()
    await expect.poll(async () => firstCardImage.getAttribute('src')).not.toBe(initialPreviewSrc)

    await page.getByRole('button', { name: 'Open photo: Near Taipei 101' }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: 'Near Taipei 101' })).toBeVisible()
    await expect(dialog).toContainText('2024-03-16')
    await expect(dialog).toContainText('25.033964, 121.564468')
    await expect(dialog).toContainText('The city felt quieter after the rain')
    await expect(dialog.locator('iframe.photography-modal__map')).toHaveAttribute('src', /google\.com\/maps/)
    await expect(dialog.getByRole('button', { name: 'Previous photo' })).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Next photo' })).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Previous work' })).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Next work' })).toBeVisible()

    const modalImage = dialog.locator('.photography-modal__image')
    const initialModalSrc = await modalImage.getAttribute('src')
    await dialog.getByRole('button', { name: 'Next photo' }).click()
    await expect(dialog.getByRole('heading', { name: 'Near Taipei 101' })).toBeVisible()
    await expect.poll(async () => modalImage.getAttribute('src')).not.toBe(initialModalSrc)

    await dialog.getByRole('button', { name: 'Next work' }).click()
    await expect(dialog.getByRole('heading', { name: "Tamsui Fishermen's Wharf" })).toBeVisible()

    await dialog.getByRole('button', { name: 'Previous work' }).click()
    await expect(dialog.getByRole('heading', { name: 'Near Taipei 101' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('renders localized Chinese copy and metadata', async ({ page }) => {
    await page.goto('/zh/photography')

    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant')
    await expect(page.getByRole('link', { name: '攝影' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '攝影' })).toBeVisible()

    const bodyFontFamily = await page.locator('body').evaluate((body) => getComputedStyle(body).fontFamily)
    expect(bodyFontFamily).toContain('Noto Serif TC')

    const cards = page.locator('.photography-card')
    await expect(cards).toHaveCount(12)
    await expect(cards.first()).toContainText('雨後台北')
    await expect(cards.first()).toContainText('2024-03-16')
    await expect(cards.first()).toContainText('25.033964, 121.564468')

    await page.getByRole('button', { name: '開啟照片: 台北 101 附近' }).click()
    const dialog = page.getByRole('dialog')

    await expect(dialog.getByRole('heading', { name: '台北 101 附近' })).toBeVisible()
    await expect(dialog).toContainText('雨後的城市反光')
    await expect(dialog.getByRole('button', { name: '下一張照片' })).toBeVisible()
    await expect(dialog.getByRole('button', { name: '下一組作品' })).toBeVisible()
  })
})
