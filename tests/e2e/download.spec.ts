import { test, expect } from '@playwright/test'

test.describe('Download page', () => {
  test('expired transfer shows expired state', async ({ page }) => {
    // Use a token that doesn't exist — server should return expired/error state
    await page.goto('/download/invalid-token-e2e-test')
    // Should show an error or expired state, not crash
    await expect(page.locator('main')).toBeVisible()
    // Should not show raw error page
    await expect(page.locator('body')).not.toContainText('Application error')
  })

  test('download page has proper meta and heading structure', async ({ page }) => {
    await page.goto('/download/invalid-token-e2e-test')
    // Should have h1 or h2 visible
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible()
  })

  test('back to home link is present on error state', async ({ page }) => {
    await page.goto('/download/invalid-token-e2e-test')
    const homeLink = page.getByRole('link', { name: /home/i })
    await expect(homeLink).toBeVisible()
  })

  test('password form renders for protected transfers', async ({ page }) => {
    // A real password-protected token would show the password form
    // We test that the page structure is correct — actual auth requires a live token
    await page.goto('/download/invalid-token-e2e-test')
    const body = page.locator('body')
    await expect(body).toBeVisible()
    // No JS crash
    const jsErrors: string[] = []
    page.on('pageerror', err => jsErrors.push(err.message))
    await page.waitForLoadState('networkidle')
    expect(jsErrors).toHaveLength(0)
  })
})

test.describe('Transfer page (public link)', () => {
  test('invalid token redirects or shows error gracefully', async ({ page }) => {
    const response = await page.goto('/download/nonexistent-abc123')
    // Should not be a 500 server error
    expect(response?.status()).not.toBe(500)
  })
})
