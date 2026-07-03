import { describe, it, expect } from 'vitest'
import {
  isFrontendFocusedRole,
  getPreferenceQuestions,
} from '@/features/onboarding/data/onboarding-data'

describe('isFrontendFocusedRole (H11)', () => {
  it('is true for frontend + fullstack, false for backend/unknown', () => {
    expect(isFrontendFocusedRole('frontend')).toBe(true)
    expect(isFrontendFocusedRole('fullstack')).toBe(true)
    expect(isFrontendFocusedRole('backend')).toBe(false)
    expect(isFrontendFocusedRole(undefined)).toBe(false)
  })
})

describe('getPreferenceQuestions (H11)', () => {
  it('includes the frontend framework question for frontend roles', () => {
    const ids = getPreferenceQuestions('frontend').map((q) => q.id)
    expect(ids).toContain('framework')
  })

  it('excludes the frontend framework question for a backend learner', () => {
    const ids = getPreferenceQuestions('backend').map((q) => q.id)
    expect(ids).not.toContain('framework')
  })
})
