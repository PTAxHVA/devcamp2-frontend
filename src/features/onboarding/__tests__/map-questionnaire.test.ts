import { describe, it, expect } from 'vitest'
import {
  matchMasterRoadmap,
  mapAnswersToQuestionnaire,
} from '@/features/onboarding/lib/map-questionnaire'
import type { BrowseRoadmap } from '@/features/roadmap/hooks/use-browse-roadmaps'

function makeRoadmap(roleName: string): BrowseRoadmap {
  return { _id: roleName, roleName }
}

const roadmaps: BrowseRoadmap[] = [
  makeRoadmap('Frontend Development'),
  makeRoadmap('Backend Development'),
]

describe('matchMasterRoadmap', () => {
  it('returns undefined for empty roadmap list', () => {
    expect(matchMasterRoadmap('frontend', [])).toBeUndefined()
  })

  it('matches frontend role to Frontend Development roadmap', () => {
    expect(matchMasterRoadmap('frontend', roadmaps)?.roleName).toBe('Frontend Development')
  })

  it('matches backend role to Backend Development roadmap', () => {
    expect(matchMasterRoadmap('backend', roadmaps)?.roleName).toBe('Backend Development')
  })

  it('falls back to frontend roadmap for unknown role (fullstack)', () => {
    // No fullstack roadmap exists — should fall back to Frontend Development
    expect(matchMasterRoadmap('fullstack', roadmaps)?.roleName).toBe('Frontend Development')
  })

  it('falls back to first roadmap when no frontend roadmap exists', () => {
    const onlyBackend = [makeRoadmap('Backend Development')]
    expect(matchMasterRoadmap('fullstack', onlyBackend)?.roleName).toBe('Backend Development')
  })

  it('handles undefined role gracefully', () => {
    const result = matchMasterRoadmap(undefined, roadmaps)
    expect(result?.roleName).toBe('Frontend Development')
  })
})

describe('mapAnswersToQuestionnaire', () => {
  const base = {
    role: 'frontend',
    goal: 'job',
    level: 'beginner',
    weeklyTime: '5-10',
    learningStyle: 'video',
    projectType: 'web',
    cliComfort: 'beginner',
    targetTimeline: '3-6',
    os: 'mac',
  }

  it('maps core required fields', () => {
    const payload = mapAnswersToQuestionnaire(base, ['branch-1'])
    expect(payload.rolePreference).toBe('frontend')
    expect(payload.goal).toBe('job')
    expect(payload.selectedBranchIds).toEqual(['branch-1'])
  })

  it('converts weeklyTime bucket to a representative number', () => {
    expect(mapAnswersToQuestionnaire({ ...base, weeklyTime: '0-5' }, []).timePerWeekHours).toBe(5)
    expect(mapAnswersToQuestionnaire({ ...base, weeklyTime: '5-10' }, []).timePerWeekHours).toBe(10)
    expect(mapAnswersToQuestionnaire({ ...base, weeklyTime: '10-20' }, []).timePerWeekHours).toBe(
      15,
    )
    expect(mapAnswersToQuestionnaire({ ...base, weeklyTime: '20+' }, []).timePerWeekHours).toBe(25)
  })

  it('omits selectedBranchIds when empty array passed', () => {
    const payload = mapAnswersToQuestionnaire(base, [])
    expect(payload.selectedBranchIds).toBeUndefined()
  })

  it('derives frameworkPreference only from the learning-path framework card', () => {
    // The learning-path card stores learningFramework.
    expect(
      mapAnswersToQuestionnaire({ ...base, learningFramework: 'vue' }, []).frameworkPreference,
    ).toBe('vue')
    // The old "Framework preference" dropdown (answers.framework) is gone — a lone
    // framework value must not leak into the payload.
    expect(
      mapAnswersToQuestionnaire({ role: 'frontend', goal: 'job', framework: 'react' }, [])
        .frameworkPreference,
    ).toBeUndefined()
  })

  it('never sends the "auto" recommend sentinel to the saved profile', () => {
    const payload = mapAnswersToQuestionnaire(
      { ...base, framework: 'auto', learningFramework: 'auto', styling: 'auto', database: 'auto' },
      [],
    )
    expect(payload.frameworkPreference).toBeUndefined()
    expect(payload.extraPreferences ?? '').not.toContain('auto')
  })

  it('strips undefined keys from the payload', () => {
    const payload = mapAnswersToQuestionnaire({ role: 'backend', goal: 'fun' }, [])
    const keys = Object.keys(payload)
    expect(
      keys.every((k) => (payload as unknown as Record<string, unknown>)[k] !== undefined),
    ).toBe(true)
  })

  it('folds additionalInfo into extraPreferences', () => {
    const payload = mapAnswersToQuestionnaire({ ...base, additionalInfo: 'I know React.' }, [])
    expect(payload.extraPreferences).toContain('I know React.')
  })
})
