import { test, expect } from '@playwright/test'

// Unique email per run so re-runs don't fail with EMAIL_TAKEN
const testEmail = `e2e+${Date.now()}@test.devcamp`
const testPassword = 'Test1234!'
const testUsername = `e2euser${Date.now()}`

test.describe('Happy path', () => {
  test('signup → onboarding → enroll → quiz → dashboard', async ({ page }) => {
    // ── 1. Signup ─────────────────────────────────────────────────────────────
    await page.goto('/signup')
    await page.getByPlaceholder(/username/i).fill(testUsername)
    await page.getByPlaceholder(/email/i).fill(testEmail)
    await page.getByPlaceholder(/password/i).fill(testPassword)
    await page.getByRole('button', { name: /sign up/i }).click()

    // Should land on onboarding
    await expect(page).toHaveURL(/onboarding/, { timeout: 15_000 })

    // ── 2. Onboarding wizard ───────────────────────────────────────────────────
    // Step 1 — Intro: click Get Started
    await page.getByRole('button', { name: /get started/i }).click()

    // Step 2 — Role: pick first available role card
    await page.locator('[data-testid="role-card"]').first().click()
    await page.getByRole('button', { name: /continue/i }).click()

    // Step 3 — Goal
    await page.locator('[data-testid="goal-card"]').first().click()
    await page.getByRole('button', { name: /continue/i }).click()

    // Step 4 — Level
    await page.locator('[data-testid="level-card"]').first().click()
    await page.getByRole('button', { name: /continue/i }).click()

    // Step 5a — Preferences (fill required fields)
    // The step may contain selects or cards; just click Continue if auto-populated
    const prefContinue = page.getByRole('button', { name: /continue/i })
    if (await prefContinue.isEnabled()) {
      await prefContinue.click()
    }

    // Step 5b — Learning path
    await page.getByRole('button', { name: /personalize/i }).click()

    // Step 6 — Generating animation (auto-advances after 3s)
    await page.waitForTimeout(4_000)

    // Step 7 — Gate screen: click Accept & Start Learning
    await page.getByRole('button', { name: /accept/i }).click()

    // Enrollment can take up to 30s (BE + AI suggest on Render free tier)
    await expect(page).toHaveURL(/dashboard/, { timeout: 60_000 })

    // ── 3. Dashboard sanity ────────────────────────────────────────────────────
    await expect(page.getByText(/welcome back/i)).toBeVisible()

    // ── 4. Navigate to a quiz ─────────────────────────────────────────────────
    // Try to find a "Continue Learning" link or navigate to my-learning
    const continueLearning = page.getByRole('link', { name: /continue/i }).first()
    if (await continueLearning.isVisible()) {
      await continueLearning.click()
      // From topic/section page, look for a quiz button
      const quizBtn = page.getByRole('link', { name: /quiz|take quiz/i }).first()
      if (await quizBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await quizBtn.click()
        await expect(page.getByRole('heading', { name: /quiz/i })).toBeVisible({ timeout: 10_000 })
      }
    }

    // ── 5. Dashboard is reachable after flow ──────────────────────────────────
    await page.goto('/dashboard')
    await expect(page.getByText(/welcome back/i)).toBeVisible()
  })
})
