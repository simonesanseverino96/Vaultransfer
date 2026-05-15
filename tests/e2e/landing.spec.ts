import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('renders hero section with upload dropzone', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByRole('button', { name: /upload/i })).toBeVisible()
  })

  test('shows stats bar', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('2 GB')).toBeVisible()
    await expect(page.getByText('256-bit')).toBeVisible()
  })

  test('features section is present', async ({ page }) => {
    await page.goto('/')
    // scroll to features
    await page.evaluate(() => window.scrollBy(0, 600))
    await expect(page.locator('section').nth(2)).toBeVisible()
  })

  test('CTA section links to pricing', async ({ page }) => {
    await page.goto('/')
    const pricingLink = page.getByRole('link', { name: /view plans/i })
    await pricingLink.scrollIntoViewIfNeeded()
    await expect(pricingLink).toBeVisible()
    await expect(pricingLink).toHaveAttribute('href', /pricing/)
  })

  test('mobile nav toggle works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const menuBtn = page.getByRole('button', { name: /open menu/i })
    await expect(menuBtn).toBeVisible()
    await menuBtn.click()
    await expect(page.locator('#mobile-nav')).toBeVisible()
    await menuBtn.click()
    await expect(page.locator('#mobile-nav')).not.toBeVisible()
  })
})
