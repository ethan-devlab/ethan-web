import { expect, test } from '@playwright/test'

test.use({ colorScheme: 'light', reducedMotion: 'reduce' })

for (const language of ['zh', 'en']) {
  test(`not-found pages retain the shared layout and language intent in ${language}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${language}/missing-page?check=preserved`)
    const title = language === 'zh' ? '找不到頁面' : 'Page not found'
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible()
    await expect(page.locator('.app-shell')).toHaveAttribute('data-button-system', 'contour')
    await expect(page.locator('html')).toHaveAttribute('lang', language === 'zh' ? 'zh-Hant' : 'en')
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
    const back = page.locator('main .btn--primary')
    await expect(back).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
    await back.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new RegExp(`/${language}/$`))
    await expect(page.locator('main')).toBeFocused()
    await expect(page.getByRole('img', { name: 'Ethan Chan portrait', exact: true })).toBeVisible()

    await page.setViewportSize({ width: 1280, height: 844 })
    await page.goto(`/${language}/missing-page?check=preserved`)
    await page.locator('.language-switcher').click()
    const otherLanguage = language === 'zh' ? 'en' : 'zh'
    await expect(page).toHaveURL(new RegExp(`/${otherLanguage}/missing-page\\?check=preserved$`))
    await expect(page.getByRole('heading', { name: otherLanguage === 'zh' ? '找不到頁面' : 'Page not found', exact: true })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
