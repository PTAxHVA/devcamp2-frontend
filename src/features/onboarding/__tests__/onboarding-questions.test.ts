import { describe, it, expect } from 'vitest'
import {
  isFrontendFocusedRole,
  roleHasLearningPath,
  getLearningPathKeys,
  getPreferenceQuestions,
} from '@/features/onboarding/data/onboarding-data'

describe('isFrontendFocusedRole', () => {
  it('is true for frontend + fullstack, false for backend/unknown', () => {
    expect(isFrontendFocusedRole('frontend')).toBe(true)
    expect(isFrontendFocusedRole('fullstack')).toBe(true)
    expect(isFrontendFocusedRole('backend')).toBe(false)
    expect(isFrontendFocusedRole(undefined)).toBe(false)
  })
})

describe('roleHasLearningPath', () => {
  it('is true for every current role — each has a "Choose your learning path" step', () => {
    expect(roleHasLearningPath('frontend')).toBe(true)
    expect(roleHasLearningPath('fullstack')).toBe(true)
    expect(roleHasLearningPath('backend')).toBe(true)
  })

  it('is false for an unknown/undefined role (skips straight to generating)', () => {
    expect(roleHasLearningPath('devops')).toBe(false)
    expect(roleHasLearningPath(undefined)).toBe(false)
    expect(roleHasLearningPath(null)).toBe(false)
  })
})

describe('getLearningPathKeys', () => {
  it('asks a backend learner only for a database', () => {
    expect(getLearningPathKeys('backend')).toEqual(['database'])
  })

  it('asks frontend/fullstack for framework + styling + project direction', () => {
    const keys = ['learningFramework', 'styling', 'projectDirection']
    expect(getLearningPathKeys('frontend')).toEqual(keys)
    expect(getLearningPathKeys('fullstack')).toEqual(keys)
  })
})

describe('getPreferenceQuestions', () => {
  const ids = getPreferenceQuestions().map((q) => q.id)

  it('no longer asks framework or database here — those are learning-path cards now', () => {
    expect(ids).not.toContain('framework')
    expect(ids).not.toContain('database')
  })

  it('keeps the shared preference questions for every role', () => {
    expect(ids).toEqual([
      'weeklyTime',
      'projectType',
      'learningStyle',
      'targetTimeline',
      'os',
      'cliComfort',
      'additionalInfo',
    ])
  })
})
