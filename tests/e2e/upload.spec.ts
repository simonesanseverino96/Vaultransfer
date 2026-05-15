import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'
import os from 'os'

test.describe('Upload flow', () => {
  let tmpFile: string

  test.beforeAll(() => {
    tmpFile = path.join(os.tmpdir(), 'vaultransfer-test.txt')
    fs.writeFileSync(tmpFile, 'VaultTransfer E2E test file content')
  })

  test.afterAll(() => {
    fs.unlinkSync(tmpFile)
  })

  test('dropzone is keyboard accessible', async ({ page }) => {
    await page.goto('/')
    const dropzone = page.getByRole('button', { name: /upload files/i })
    await dropzone.focus()
    await expect(dropzone).toBeFocused()
  })

  test('shows options panel when toggled', async ({ page }) => {
    await page.goto('/')
    // drop a file to reveal file list and options toggle
    const dropzone = page.locator('[aria-label*="Upload files"]')
    await dropzone.waitFor({ state: 'visible' })

    // Use input to add file
    const input = page.locator('input[type="file"]')
    await input.setInputFiles(tmpFile)

    // options toggle should appear
    const toggle = page.getByText(/options/i)
    await expect(toggle).toBeVisible()
    await toggle.click()

    // expiry buttons should appear
    await expect(page.getByRole('button', { name: '1' })).toBeVisible()
  })

  test('upload button is disabled until file added', async ({ page }) => {
    await page.goto('/')
    // No file added — upload button should not be rendered
    await expect(page.getByRole('button', { name: /send/i })).not.toBeVisible()
  })

  test('remove file button appears per file', async ({ page }) => {
    await page.goto('/')
    const input = page.locator('input[type="file"]')
    await input.setInputFiles(tmpFile)
    const removeBtn = page.getByRole('button', { name: /remove/i })
    await expect(removeBtn).toBeVisible()
    await removeBtn.click()
    await expect(removeBtn).not.toBeVisible()
  })
})
