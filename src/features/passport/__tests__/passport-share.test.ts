import { describe, it, expect } from 'vitest'
import {
  buildLinkedInShareUrl,
  buildPassportNudge,
  buildPassportUrl,
  calcPassportCompletionPct,
  formatSkillLevel,
  hasNudgedAttempt,
  markNudgedAttempt,
} from '../lib/passport-share'

describe('buildPassportUrl', () => {
  it('joins origin and token as <origin>/p/<token>', () => {
    expect(buildPassportUrl('https://vora.app', 'abc123')).toBe('https://vora.app/p/abc123')
  })

  it('tolerates a trailing slash on the origin', () => {
    expect(buildPassportUrl('http://localhost:5173/', 'tok')).toBe('http://localhost:5173/p/tok')
  })
})

describe('buildLinkedInShareUrl', () => {
  it('URL-encodes the passport link into the share-offsite URL', () => {
    const url = buildLinkedInShareUrl('https://vora.app/p/abc123')
    expect(url).toBe(
      'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fvora.app%2Fp%2Fabc123',
    )
  })
})

describe('buildPassportNudge', () => {
  it('names the topic that was just verified', () => {
    expect(buildPassportNudge('React Basics')).toBe('You just verified a skill in “React Basics”!')
  })

  it('falls back to generic copy when the topic name is unknown', () => {
    expect(buildPassportNudge(null)).toBe('You just verified a new skill!')
    expect(buildPassportNudge(undefined)).toBe('You just verified a new skill!')
  })
})

describe('calcPassportCompletionPct', () => {
  it('rounds to an integer percentage', () => {
    expect(calcPassportCompletionPct(1, 3)).toBe(33)
    expect(calcPassportCompletionPct(2, 3)).toBe(67)
    expect(calcPassportCompletionPct(2, 2)).toBe(100)
  })

  it('is zero-safe when the learner has no topics yet', () => {
    expect(calcPassportCompletionPct(0, 0)).toBe(0)
  })
})

describe('formatSkillLevel', () => {
  it('renders the BE enum value as a display chip label', () => {
    expect(formatSkillLevel('BEGINNER')).toBe('Beginner')
    expect(formatSkillLevel('INTERMEDIATE')).toBe('Intermediate')
    expect(formatSkillLevel('')).toBe('')
  })
})

describe('nudge per-attempt guard', () => {
  it('marks an attempt as nudged so reopening the result page stays silent', () => {
    sessionStorage.clear()
    expect(hasNudgedAttempt('attempt-1')).toBe(false)
    markNudgedAttempt('attempt-1')
    expect(hasNudgedAttempt('attempt-1')).toBe(true)
    expect(hasNudgedAttempt('attempt-2')).toBe(false)
  })
})
