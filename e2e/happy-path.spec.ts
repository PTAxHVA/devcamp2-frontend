import { test, expect } from '@playwright/test'

// Unique email per run so re-runs don't fail with EMAIL_TAKEN
const testEmail = `e2e+${Date.now()}@test.devcamp`
const testPassword = 'Test1234!'
const testUsername = `e2euser${Date.now()}`

// Shared mock attempt id used across quiz mocks
const MOCK_ATTEMPT_ID = 'e2e-mock-attempt-123'

test.describe('Happy path', () => {
  test('signup → onboarding → enroll → dashboard', async ({ page }) => {
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

    // Step 5a — Preferences: click Continue if enabled
    const prefContinue = page.getByRole('button', { name: /continue/i })
    if (await prefContinue.isEnabled()) {
      await prefContinue.click()
    }

    // Step 5b — Learning path
    await page.getByRole('button', { name: /personalize/i }).click()

    // Step 6 — Generating: the real AI suggestion runs here; the reveal shows the
    // personalization reason and a Continue button once the request settles
    // (typically ~12s: 10s Gemini timeout server-side + reveal dwell; the global
    // 60s actionTimeout covers Render cold starts).
    await page.getByRole('button', { name: /continue/i }).click()

    // Step 7 — Gate screen: click Accept & Start Learning
    await page.getByRole('button', { name: /accept/i }).click()

    // Enrollment can take up to 30s (BE + AI suggest on Render free tier)
    await expect(page).toHaveURL(/dashboard/, { timeout: 60_000 })

    // ── 3. Dashboard sanity ────────────────────────────────────────────────────
    await expect(page.getByText(/welcome back/i)).toBeVisible()
  })

  test('quiz attempt → pass result page', async ({ page }) => {
    // ── Setup: mock submit + result to guarantee a pass ───────────────────────
    // Intercept submit and force isPassed: true regardless of answers given.
    await page.route('**/attempts/*/submit', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            quizAttemptId: MOCK_ATTEMPT_ID,
            score: 100,
            isPassed: true,
            cooldownUntil: null,
          },
        }),
      })
    })

    // Intercept the result fetch so the pass page can render
    await page.route(`**/attempts/${MOCK_ATTEMPT_ID}/result`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            quizAttempt: {
              attemptId: MOCK_ATTEMPT_ID,
              quizId: 'mock-quiz-id',
              startedAt: new Date().toISOString(),
              submittedAt: new Date().toISOString(),
              score: 100,
              isPassed: true,
              cooldownUntil: null,
            },
            questions: [],
          },
        }),
      })
    })

    // ── 1. Login ───────────────────────────────────────────────────────────────
    await page.goto('/login')
    await page.getByPlaceholder(/email/i).fill(testEmail)
    await page.getByPlaceholder(/password/i).fill(testPassword)
    await page.getByRole('button', { name: /sign in|log in/i }).click()
    await expect(page).toHaveURL(/dashboard/, { timeout: 20_000 })

    // ── 2. Navigate to my-learning → first topic ───────────────────────────────
    await page.goto('/my-learning')
    // Prefer a link that indicates the topic is available to start/continue
    const topicLink = page.locator('a[href*="/topics/"]').first()
    await expect(topicLink).toBeVisible({ timeout: 10_000 })
    await topicLink.click()
    await expect(page).toHaveURL(/topics/, { timeout: 10_000 })

    // ── 3. Enter a section ─────────────────────────────────────────────────────
    const firstSection = page.locator('a[href*="/sections/"]').first()
    await expect(firstSection).toBeVisible({ timeout: 10_000 })
    await firstSection.click()
    await expect(page).toHaveURL(/sections/, { timeout: 10_000 })

    // Skip this test if the section has no quiz (only relevant for quiz sections)
    const startQuizBtn = page.getByRole('button', { name: /start quiz/i })
    const hasQuiz = await startQuizBtn.isVisible({ timeout: 5_000 }).catch(() => false)
    if (!hasQuiz) {
      test.skip()
      return
    }

    // ── 4. Start and answer the quiz ───────────────────────────────────────────
    await startQuizBtn.click()
    await expect(page).toHaveURL(/quizzes.*attempt/, { timeout: 10_000 })

    // Wait for at least one question to appear
    await expect(page.getByText(/question 1/i)).toBeVisible({ timeout: 15_000 })

    // Walk through every question: select first MCQ option or type for fill-in
    let onLastQuestion = false
    while (!onLastQuestion) {
      // MCQ: radio-style option buttons
      const firstOption = page.locator('label[data-option], button[data-option]').first()
      if (await firstOption.isVisible({ timeout: 1_500 }).catch(() => false)) {
        await firstOption.click()
      } else {
        // Fill-in-blank
        const fillInput = page.locator('input[type="text"], textarea').first()
        if (await fillInput.isVisible({ timeout: 1_500 }).catch(() => false)) {
          await fillInput.fill('answer')
        }
      }

      const submitBtn = page.getByRole('button', { name: /submit answer/i })
      const nextBtn = page.getByRole('button', { name: /^next$/i })

      if (await submitBtn.isVisible({ timeout: 1_000 }).catch(() => false)) {
        await submitBtn.click()
        onLastQuestion = true
      } else if (await nextBtn.isVisible({ timeout: 1_000 }).catch(() => false)) {
        await nextBtn.click()
      } else {
        // Safety: break if neither button is found
        break
      }
    }

    // ── 5. Assert pass result page ─────────────────────────────────────────────
    await expect(page).toHaveURL(/result\/pass/, { timeout: 15_000 })
    await expect(page.getByText(/great job|you passed/i)).toBeVisible()
  })
})
