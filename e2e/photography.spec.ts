import { expect, test, type Locator } from '@playwright/test'

const yuguangIslandImages = [
  'DSC_0998_E.jpg.webp',
  'DSC_1007_E.jpg.webp',
  'DSC_1015_E.jpg.webp',
]

for (const width of [390, 1440]) {
  for (const lang of ['zh', 'en']) {
    test(`gallery pagination accepts edge clicks without opening the viewer at ${width}px in ${lang}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`/${lang}/photography`)
      const card = page.locator('.photography-card').filter({ has: page.locator('.photography-card__dots .photography-card__dot:nth-child(3)') }).first()
      const dots = card.locator('.photography-card__dot')
      await card.scrollIntoViewIfNeeded()
      const bounds = await dots.evaluateAll(elements => elements.map(element => {
        const rect = element.getBoundingClientRect()
        return { left: rect.left, right: rect.right, width: rect.width, height: rect.height }
      }))
      for (const bound of bounds) {
        expect(bound.width).toBeGreaterThanOrEqual(24)
        expect(bound.height).toBeGreaterThanOrEqual(24)
      }
      for (let index = 1; index < bounds.length; index += 1) expect(bounds[index].left).toBeGreaterThanOrEqual(bounds[index - 1].right)
      await dots.nth(2).click({ position: { x: 12, y: 2 } })
      await expect(dots.nth(2)).toHaveAttribute('aria-current', 'true')
      await expect(card.locator('.photography-card__image')).toHaveAttribute('src', new RegExp(yuguangIslandImages[2].replaceAll('.', '\\.')))
      await expect(page.getByRole('dialog')).not.toBeVisible()
    })
  }
}

function expectWebpSource(source: string | null, imageName: string) {
  expect(source).toContain(`/photography/webp/${imageName}`)
  expect(source).toMatch(/\.webp$/)
}

async function expectCounterInsidePhotoArea(counter: Locator) {
  const isInsidePhotoArea = await counter.evaluate((element) => {
    const stage = element.closest('.photography-modal__image-stage')
    const media = element.closest('.photography-modal__media')
    if (!stage || !media) return false

    const counterRect = element.getBoundingClientRect()
    const stageRect = stage.getBoundingClientRect()
    return (
      media.contains(element) &&
      counterRect.left >= stageRect.left &&
      counterRect.right <= stageRect.right &&
      counterRect.top >= stageRect.top &&
      counterRect.bottom <= stageRect.bottom
    )
  })

  expect(isInsidePhotoArea).toBe(true)
}

test.describe('photography page', () => {
  test('returns focus to the keyboard opener after Escape', async ({ page }) => {
    await page.goto('/en/photography')
    const opener = page.getByRole('button', { name: 'Open photo: Yuguang Island', exact: true })
    await opener.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.locator('.photography-modal__close')).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await expect(opener).toBeFocused()
  })

  test('uses current English gallery data and keeps multi-image modal state in sync', async ({ page, browserName }) => {
    await page.goto('/en/photography')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('link', { name: 'Photography' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Photography' })).toBeVisible()

    const cards = page.locator('.photography-card')
    await expect(cards).toHaveCount(14)
    await expect(cards.nth(0)).toContainText('Sunset Through Buildings')
    await expect(cards.nth(0)).toContainText('2026-03-18, 5:50 PM')
    await expect(cards.nth(0)).toContainText('24.180456, 120.646599')

    const cardSources = await page.locator('.photography-card__image').evaluateAll((images) =>
      images.map((image) => image.getAttribute('src')),
    )
    expect(cardSources).toHaveLength(14)
    expect(cardSources.every((source) =>
      source?.includes('/photography/webp/') && source.endsWith('.webp'),
    )).toBe(true)

    const islandCard = cards.nth(2)
    const islandPreview = islandCard.locator('.photography-card__image')
    expectWebpSource(await islandPreview.getAttribute('src'), yuguangIslandImages[0])

    await islandCard.getByRole('button', { name: 'Next preview photo: Yuguang Island' }).click()
    await expect(islandPreview).toHaveAttribute('src', new RegExp(yuguangIslandImages[1]))
    await islandCard.getByRole('button', { name: 'Open photo: Yuguang Island 3' }).click()
    await expect(islandPreview).toHaveAttribute('src', new RegExp(yuguangIslandImages[2]))

    const opener = page.getByRole('button', { name: 'Open photo: Yuguang Island', exact: true })
    await opener.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: 'Yuguang Island' })).toBeVisible()
    await expect(dialog).toContainText('2026-01-08, 3:57 PM')
    await expect(dialog).toContainText('22.981128, 120.155884')
    await expect(dialog).toContainText('Walking hand in hand along the coast')
    const closeButton = dialog.locator('.photography-modal__close')
    await expect(closeButton).toBeFocused()
    const nextPhoto = dialog.getByRole('button', { name: 'Next photo', exact: true })
    const photoTransform = await nextPhoto.evaluate(element => getComputedStyle(element).transform)
    await nextPhoto.hover()
    await expect.poll(() => nextPhoto.evaluate(element => getComputedStyle(element, '::before').clipPath)).toContain('50%')
    await expect(nextPhoto).toHaveCSS('transform', photoTransform)
    await dialog.getByRole('button', { name: 'Previous photo', exact: true }).focus()
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab')
    await expect(nextPhoto).toBeFocused()
    expect(await nextPhoto.evaluate(element => getComputedStyle(element, '::before').opacity)).toBe('0')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    expect(await nextPhoto.evaluate(element => getComputedStyle(element, '::before').transitionDuration)).toBe('0s')

    const modalImage = dialog.locator('.photography-modal__image')
    const counter = dialog.locator('.photography-modal__counter')
    expectWebpSource(await modalImage.getAttribute('src'), yuguangIslandImages[2])
    await expect(counter).toHaveText('3 / 3')

    await dialog.getByRole('button', { name: 'Next photo' }).click()
    await expect(modalImage).toHaveAttribute('src', new RegExp(yuguangIslandImages[0]))
    await expect(counter).toHaveText('1 / 3')
    await dialog.getByRole('button', { name: 'Previous photo' }).click()
    await expect(modalImage).toHaveAttribute('src', new RegExp(yuguangIslandImages[2]))
    await expect(counter).toHaveText('3 / 3')

    await expect(dialog.locator('.photography-modal__group-controls--floating button').first()).toBeVisible()
    await expect(dialog.locator('.photography-modal__group-controls--inline')).toBeHidden()
    await dialog.getByRole('button', { name: 'Next work' }).click()
    await expect(dialog.getByRole('heading', { name: 'Yuguang Forest' })).toBeVisible()
    await dialog.getByRole('button', { name: 'Previous work' }).click()
    await expect(dialog.getByRole('heading', { name: 'Yuguang Island' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(opener).toBeFocused()

    await opener.click()
    const reopenedDialog = page.getByRole('dialog')
    await expect(reopenedDialog.locator('.photography-modal__close')).toBeFocused()
    await reopenedDialog.locator('.photography-modal__close').click()
    await expect(reopenedDialog).toBeHidden()
    await expect(opener).toBeFocused()
  })

  test('keeps group controls and the photo counter in the photo area on narrow screens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/en/photography')

    const opener = page.getByRole('button', { name: 'Open photo: Yuguang Island', exact: true })
    await opener.click()

    const dialog = page.getByRole('dialog')
    const floatingControls = dialog.locator('.photography-modal__group-controls--floating')
    const inlineControls = dialog.locator('.photography-modal__group-controls--inline')
    const counter = dialog.locator('.photography-modal__counter')

    await expect(dialog).toBeVisible()
    await expect(floatingControls).toBeHidden()
    await expect(inlineControls).toBeVisible()
    expect(await inlineControls.evaluate(element => {
      const row = element.getBoundingClientRect()
      return [...element.querySelectorAll('button')].every(button => {
        const bounds = button.getBoundingClientRect()
        return Math.abs((bounds.top + bounds.bottom) / 2 - (row.top + row.bottom) / 2) < 1 && bounds.left >= row.left && bounds.right <= row.right
      })
    })).toBe(true)
    await expect(dialog.locator('.photography-modal__group-nav:visible')).toHaveCount(2)
    await expect(counter).toHaveText('1 / 3')
    await expectCounterInsidePhotoArea(counter)

    await inlineControls.getByRole('button', { name: 'Next work' }).click()
    await expect(dialog.getByRole('heading', { name: 'Yuguang Forest' })).toBeVisible()
    await expect(dialog.locator('.photography-modal__group-nav:visible')).toHaveCount(2)
    await expect(counter).toHaveText('1 / 1')
    await expect(dialog.locator('.photography-modal__nav')).toHaveCount(0)
    await expectCounterInsidePhotoArea(counter)
  })

  test('renders localized Chinese metadata and the current font stack', async ({ page }) => {
    await page.goto('/zh/photography')

    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant')
    await expect(page.getByRole('link', { name: '攝影' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '攝影' })).toBeVisible()

    const bodyFontFamily = await page.locator('body').evaluate((body) => getComputedStyle(body).fontFamily)
    expect(bodyFontFamily).toContain('Noto Sans TC')

    const cards = page.locator('.photography-card')
    await expect(cards).toHaveCount(14)
    await expect(cards.nth(0)).toContainText('建築間的夕陽')
    await expect(cards.nth(0)).toContainText('2026-03-18, 5:50 PM')
    await expect(cards.nth(0)).toContainText('24.180456, 120.646599')

    await page.getByRole('button', { name: '開啟照片: 逢甲大學育樂館' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading', { name: '逢甲大學育樂館' })).toBeVisible()
    await expect(dialog).toContainText('複雜的建築群間，留給夕陽穿越而過的空隙')
    await expect(dialog.getByRole('button', { name: '下一張照片' })).toHaveCount(0)
    await expect(dialog.getByRole('button', { name: '下一組作品' })).toBeVisible()
  })
})
