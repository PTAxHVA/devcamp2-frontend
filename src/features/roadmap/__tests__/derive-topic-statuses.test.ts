import { describe, it, expect } from 'vitest'
import { deriveTopicStatuses } from '@/features/roadmap/lib/build-flow-graph'
import type { BEGraphTopic } from '@/features/roadmap/hooks/use-roadmap-detail'

function makeTopic(overrides: Partial<BEGraphTopic> & { masterTopicId: string }): BEGraphTopic {
  return {
    orderIndex: 0,
    sectionTotal: 3,
    sectionCompleted: 0,
    prerequisiteTopicIds: [],
    ...overrides,
  }
}

describe('deriveTopicStatuses', () => {
  it('returns empty map for empty input', () => {
    expect(deriveTopicStatuses([])).toEqual(new Map())
  })

  it('root topic is always available when nothing is completed', () => {
    const topics = [
      makeTopic({ masterTopicId: 'a', orderIndex: 0 }),
      makeTopic({ masterTopicId: 'b', orderIndex: 1 }),
    ]
    const map = deriveTopicStatuses(topics)
    expect(map.get('a')).toBe('available')
    expect(map.get('b')).toBe('locked')
  })

  it('marks completed topic when all sections done', () => {
    const topics = [
      makeTopic({ masterTopicId: 'a', orderIndex: 0, sectionTotal: 2, sectionCompleted: 2 }),
    ]
    expect(deriveTopicStatuses(topics).get('a')).toBe('completed')
  })

  it('marks in_progress when some but not all sections are done', () => {
    const topics = [
      makeTopic({ masterTopicId: 'a', orderIndex: 0, sectionTotal: 4, sectionCompleted: 2 }),
    ]
    expect(deriveTopicStatuses(topics).get('a')).toBe('in_progress')
  })

  it('sequential unlock: topic 2 available only after topic 1 is completed', () => {
    const topics = [
      makeTopic({ masterTopicId: 'a', orderIndex: 0, sectionTotal: 2, sectionCompleted: 2 }),
      makeTopic({ masterTopicId: 'b', orderIndex: 1 }),
      makeTopic({ masterTopicId: 'c', orderIndex: 2 }),
    ]
    const map = deriveTopicStatuses(topics)
    expect(map.get('a')).toBe('completed')
    expect(map.get('b')).toBe('available')
    expect(map.get('c')).toBe('locked')
  })

  it('explicit prerequisites override sequential position', () => {
    const topics = [
      makeTopic({ masterTopicId: 'a', orderIndex: 0, sectionTotal: 2, sectionCompleted: 2 }),
      makeTopic({ masterTopicId: 'b', orderIndex: 1 }),
      makeTopic({ masterTopicId: 'c', orderIndex: 2, prerequisiteTopicIds: ['a'] }),
    ]
    const map = deriveTopicStatuses(topics)
    expect(map.get('c')).toBe('available')
  })

  it('locked when explicit prerequisite is not completed', () => {
    const topics = [
      makeTopic({ masterTopicId: 'a', orderIndex: 0 }),
      makeTopic({ masterTopicId: 'b', orderIndex: 1, prerequisiteTopicIds: ['a'] }),
    ]
    expect(deriveTopicStatuses(topics).get('b')).toBe('locked')
  })

  it('ignores prerequisite ids that are not in the roadmap', () => {
    // 'b' lists an external prerequisite not in this roadmap — should fall back to sequential
    const topics = [
      makeTopic({ masterTopicId: 'a', orderIndex: 0, sectionTotal: 2, sectionCompleted: 2 }),
      makeTopic({ masterTopicId: 'b', orderIndex: 1, prerequisiteTopicIds: ['external-id'] }),
    ]
    const map = deriveTopicStatuses(topics)
    // 'external-id' not in idSet → falls back to sequential: a is done → b available
    expect(map.get('b')).toBe('available')
  })
})
