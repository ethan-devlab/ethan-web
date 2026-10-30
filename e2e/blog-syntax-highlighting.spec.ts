import { expect, test } from '@playwright/test'

test.describe('blog syntax highlighting', () => {
    test('keeps short and overflowing code at the same mobile text scale', async ({ browser }, testInfo) => {
        const context = await browser.newContext({
            baseURL: testInfo.project.use.baseURL,
            viewport: { width: 393, height: 852 },
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
        })
        const page = await context.newPage()
        await page.goto('/zh/blog/rasp-pi-5-setup-guide')
        const blocks = page.locator('.blog-article pre').filter({ hasText: 'rpicam-still -t 0' })
        await expect(blocks.first()).toBeVisible()
        const measurements = await blocks.evaluateAll(elements => elements.slice(0, 2).map(element => {
            const code = element.querySelector('code')!
            const style = getComputedStyle(code)
            return {
                size: style.fontSize,
                adjustment: style.getPropertyValue('-webkit-text-size-adjust') || style.getPropertyValue('text-size-adjust'),
                overflow: element.scrollWidth > element.clientWidth,
            }
        }))
        expect(measurements).toHaveLength(2)
        expect(measurements.map(value => value.size)).toEqual(['14px', '14px'])
        expect(measurements.map(value => value.adjustment)).toEqual(['100%', '100%'])
        expect(measurements[0].overflow).toBe(false)
        expect(measurements[1].overflow).toBe(true)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await blocks.nth(1).scrollIntoViewIfNeeded()
        await page.screenshot({ path: testInfo.outputPath('mobile-code-size.png') })
        await context.close()
    })

    test('renders highlighted code blocks and keeps styling after theme toggle', async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem('ethan-theme', 'dark')
        })

        await page.goto('/en/blog/use-phone-camera-opencv')

        const html = page.locator('html')
        await expect(html).toHaveAttribute('data-theme', 'dark')

        const article = page.locator('.blog-article')
        await expect(article).toBeVisible()

        const highlightedFigures = article.locator('figure[data-rehype-pretty-code-figure]')
        expect(await highlightedFigures.count()).toBeGreaterThan(0)

        const highlightedFigure = highlightedFigures.first()
        await expect(highlightedFigure).toBeVisible()

        const highlightedCode = highlightedFigure.locator('code[data-theme]')
        await expect(highlightedCode).toHaveCount(1)

        const tokenSpans = highlightedCode.locator('span[style]')
        await expect(tokenSpans.first()).toBeVisible()
        expect(await tokenSpans.count()).toBeGreaterThan(0)

        const themeToggle = page.getByRole('button', { name: 'Toggle theme' })
        await themeToggle.click()

        await expect(html).toHaveAttribute('data-theme', 'light')
        await expect(highlightedFigure).toBeVisible()
        await expect(tokenSpans.first()).toBeVisible()
    })
})
