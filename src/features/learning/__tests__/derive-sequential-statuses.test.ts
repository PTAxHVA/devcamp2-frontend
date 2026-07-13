import { describe, it, expect } from 'vitest'
import { deriveSequentialStatuses } from '@/features/learning/hooks/use-my-learning'
import type { LearningTopic } from '@/features/learning/types'

function makeTopic(overrides: Partial<LearningTopic> & { masterTopicId: string }): LearningTopic {
  return {
    userTopicId: null,
    title: overrides.masterTopicId,
    status: 'locked',
    orderIndex: 0,
    estimatedHours: 5,
    sectionTotal: 3,
    sectionCompleted: 0,
    prerequisiteTopicIds: [],
    ...overrides,
  }
}

describe('deriveSequentialStatuses', () => {
  it('returns empty array unchanged', () => {
    expect(deriveSequentialStatuses([])).toEqual([])
  })

  it('always marks the first topic as available when nothing is completed', () => {
    const topics = [
      makeTopic({ masterTopicId: 'a', orderIndex: 0 }),
      makeTopic({ masterTopicId: 'b', orderIndex: 1 }),
    ]
    const result = deriveSequentialStatuses(topics)
    expect(result.find((t) => t.masterTopicId === 'a')?.status).toBe('available')
    expect(result.find((t) => t.masterTopicId === 'b')?.status).toBe('locked')
  })

  it('marks first topic as completed when all its sections are done', () => {
    const topics = [
      makeTopic({ masterTopicId: 'a', orderIndex: 0, sectionTotal: 3, sectionCompleted: 3 }),
      makeTopic({ masterTopicId: 'b', orderIndex: 1 }),
    ]
    const result = deriveSequentialStatuses(topics)
    expect(result.find((t) => t.masterTopicId === 'a')?.status).toBe('completed')
    expect(result.find((t) => t.masterTopicId === 'b')?.status).toBe('available')
  })

  it('marks a topic in_progress when partially completed', () => {
    const topics = [
      makeTopic({ masterTopicId: 'a', orderIndex: 0, sectionTotal: 3, sectionCompleted: 3 }),
      makeTopic({ masterTopicId: 'b', orderIndex: 1, sectionTotal: 4, sectionCompleted: 2 }),
      makeTopic({ masterTopicId: 'c', orderIndex: 2 }),
    ]
    const result = deriveSequentialStatuses(topics)
    expect(result.find((t) => t.masterTopicId === 'b')?.status).toBe('in_progress')
    expect(result.find((t) => t.masterTopicId === 'c')?.status).toBe('locked')
  })

  it('sequential unlock: topic 3 stays locked until topic 2 is done', () => {
    const topics = [
      makeTopic({ masterTopicId: 'a', orderIndex: 0, sectionTotal: 2, sectionCompleted: 2 }),
      makeTopic({ masterTopicId: 'b', orderIndex: 1 }),
      makeTopic({ masterTopicId: 'c', orderIndex: 2 }),
    ]
    const result = deriveSequentialStatuses(topics)
    expect(result.find((t) => t.masterTopicId === 'b')?.status).toBe('available')
    expect(result.find((t) => t.masterTopicId === 'c')?.status).toBe('locked')
  })

  it('respects explicit prerequisiteTopicIds over sequential position', () => {
    // 'c' explicitly requires 'a', NOT 'b' — so it unlocks as soon as 'a' is done
    const topics = [
      makeTopic({ masterTopicId: 'a', orderIndex: 0, sectionTotal: 2, sectionCompleted: 2 }),
      makeTopic({ masterTopicId: 'b', orderIndex: 1 }),
      makeTopic({ masterTopicId: 'c', orderIndex: 2, prerequisiteTopicIds: ['a'] }),
    ]
    const result = deriveSequentialStatuses(topics)
    expect(result.find((t) => t.masterTopicId === 'c')?.status).toBe('available')
  })

  it('locks topic when an explicit prerequisite is not yet completed', () => {
    const topics = [
      makeTopic({ masterTopicId: 'a', orderIndex: 0 }),
      makeTopic({ masterTopicId: 'b', orderIndex: 1, prerequisiteTopicIds: ['a'] }),
    ]
    const result = deriveSequentialStatuses(topics)
    expect(result.find((t) => t.masterTopicId === 'b')?.status).toBe('locked')
  })

  it('preserves topic data other than status', () => {
    const topics = [
      makeTopic({ masterTopicId: 'x', orderIndex: 0, estimatedHours: 10, title: 'Keep me' }),
    ]
    const result = deriveSequentialStatuses(topics)
    expect(result[0].estimatedHours).toBe(10)
    expect(result[0].title).toBe('Keep me')
  })
})

// Two mutually-exclusive branches learned in parallel (React + Vue). The content
// seed gives each fork HEAD an explicit prerequisite on the shared pre-fork topic,
// so they unlock TOGETHER and never gate on each other — the sequential fallback
// (which would lock the later one) is bypassed whenever an explicit prereq exists.
// These lock in that behaviour so a future edit to deriveSequentialStatuses can't
// silently re-introduce parallel branches blocking each other.
describe('deriveSequentialStatuses — parallel fork branches', () => {
  const done = { sectionTotal: 2, sectionCompleted: 2 }

  it('unlocks two parallel fork heads together once their shared predecessor is done', () => {
    const topics = [
      makeTopic({ masterTopicId: 'ts', orderIndex: 1, ...done, prerequisiteTopicIds: [] }),
      makeTopic({ masterTopicId: 'react', orderIndex: 2, prerequisiteTopicIds: ['ts'] }),
      makeTopic({ masterTopicId: 'vue', orderIndex: 3, prerequisiteTopicIds: ['ts'] }),
      makeTopic({ masterTopicId: 'nextjs', orderIndex: 4, prerequisiteTopicIds: ['react'] }),
    ]
    const byId = Object.fromEntries(
      deriveSequentialStatuses(topics).map((t) => [t.masterTopicId, t.status]),
    )
    // React and Vue are BOTH available — neither locks the other.
    expect(byId.react).toBe('available')
    expect(byId.vue).toBe('available')
    // A continuation (Next.js after React) stays locked inside its branch.
    expect(byId.nextjs).toBe('locked')
  })

  it('keeps both parallel fork heads locked until the shared predecessor is done', () => {
    const topics = [
      makeTopic({ masterTopicId: 'ts', orderIndex: 1, prerequisiteTopicIds: [] }), // not done
      makeTopic({ masterTopicId: 'react', orderIndex: 2, prerequisiteTopicIds: ['ts'] }),
      makeTopic({ masterTopicId: 'vue', orderIndex: 3, prerequisiteTopicIds: ['ts'] }),
    ]
    const byId = Object.fromEntries(
      deriveSequentialStatuses(topics).map((t) => [t.masterTopicId, t.status]),
    )
    expect(byId.react).toBe('locked')
    expect(byId.vue).toBe('locked')
  })
})
