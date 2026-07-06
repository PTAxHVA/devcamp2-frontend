import { describe, it, expect } from 'vitest'
import { resolveIncomingTopics } from '../lib/resolve-incoming-topics'

const meta = new Map([
  ['m', { name: 'MongoDB (with Mongoose)', estimatedHours: 6, sectionTotal: 6 }],
])
const available = [
  { masterTopicId: 'p', name: 'PostgreSQL (with Prisma)', estimatedHours: 5, sectionTotal: 8 },
]

describe('resolveIncomingTopics', () => {
  it('prefers editor-known metadata — the unsaved switch-back case', () => {
    // After an unsaved mongo→pg switch, available-topics (saved enrollment)
    // contains neither original side; topicMeta still knows mongo.
    const result = resolveIncomingTopics(['m'], meta, available)
    expect(result).toEqual([
      {
        masterTopicId: 'm',
        name: 'MongoDB (with Mongoose)',
        estimatedHours: 6,
        sectionTotal: 6,
        alreadyKnown: true,
      },
    ])
  })

  it('falls back to the server list for a first-time add', () => {
    const result = resolveIncomingTopics(['p'], meta, available)
    expect(result).toEqual([
      {
        masterTopicId: 'p',
        name: 'PostgreSQL (with Prisma)',
        estimatedHours: 5,
        sectionTotal: 8,
        alreadyKnown: false,
      },
    ])
  })

  it('resolves a mixed list from both sources', () => {
    const result = resolveIncomingTopics(['m', 'p'], meta, available)
    expect(result?.map((t) => [t.masterTopicId, t.alreadyKnown])).toEqual([
      ['m', true],
      ['p', false],
    ])
  })

  it('returns null when a topic is unknown to both sources (still loading)', () => {
    expect(resolveIncomingTopics(['x'], meta, available)).toBeNull()
    expect(resolveIncomingTopics(['p'], new Map(), undefined)).toBeNull()
  })
})
