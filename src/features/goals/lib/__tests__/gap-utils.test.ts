import { describe, it, expect } from 'vitest'
import { pickAddableTopicIds } from '../gap-utils'
import type { GapTopicItem } from '../../types'

const topic = (topicId: string, name = topicId): GapTopicItem => ({
  topicId,
  name,
  estimatedHours: 2,
})

describe('pickAddableTopicIds', () => {
  it('keeps only missing topics the roadmap can accept, in gap order', () => {
    const missing = [topic('a'), topic('b'), topic('c')]
    expect(pickAddableTopicIds(missing, ['c', 'a'])).toEqual(['a', 'c'])
  })

  it('returns empty when nothing is missing', () => {
    expect(pickAddableTopicIds([], ['a', 'b'])).toEqual([])
  })

  it('returns empty when the roadmap offers none of the missing topics', () => {
    expect(pickAddableTopicIds([topic('a')], ['x', 'y'])).toEqual([])
  })

  it('dedupes repeated missing ids', () => {
    expect(pickAddableTopicIds([topic('a'), topic('a')], ['a'])).toEqual(['a'])
  })
})
