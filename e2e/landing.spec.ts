import { test, expect } from '@playwright/test'

// The redesigned landing is fully static (no API calls), so these run offline.

test.describe('Landing page', () => {
  test('renders the hero and every section', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /build your verified web development roadmap/i,
      }),
    ).toBeVisible()
    for (const id of ['why', 'how', 'features', 'faq']) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }
    await expect(page.getByText(/all rights reserved/i)).toBeVisible()
  })

  test('has no horizontal overflow across the target width range', async ({ page }) => {
    for (const width of [320, 375, 900, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1)
    }
  })

  test('mobile menu opens and closes on link tap (<900px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 })
    await page.goto('/')
    const burger = page.getByRole('button', { name: /open menu/i })
    await expect(burger).toBeVisible()
    await burger.click()

    const menu = page.locator('#landing-mobile-menu')
    await expect(menu).toBeVisible()
    await menu.getByRole('link', { name: /how it works/i }).click()
    await expect(menu).toBeHidden()
  })

  test('FAQ item toggles with aria-expanded', async ({ page }) => {
    await page.goto('/')
    const question = page.getByRole('button', { name: /are the roadmaps ai-generated/i })
    await expect(question).toHaveAttribute('aria-expanded', 'false')
    await question.click()
    await expect(question).toHaveAttribute('aria-expanded', 'true')
  })

  test('primary CTAs navigate to signup and the demo', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: /get started/i })
      .first()
      .click()
    await expect(page).toHaveURL(/signup/)

    await page.goto('/')
    await page.getByRole('link', { name: /view demo roadmap/i }).click()
    await expect(page).toHaveURL(/demo-roadmap/)
  })
})
