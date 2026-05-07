import { expect, test } from '@playwright/test'

test.describe('blog syntax highlighting', () => {
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
